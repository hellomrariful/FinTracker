import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/middleware/auth';
import { writeFile, mkdir, unlink } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import connectDB from '@/lib/db/mongodb';
import File from '@/models/File';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'application/pdf',
];

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

// Helper to ensure upload directory exists
async function ensureUploadDir(userId: string) {
  const userDir = path.join(UPLOAD_DIR, userId);
  try {
    await mkdir(userDir, { recursive: true });
    return userDir;
  } catch (error) {
    console.error('Error creating upload directory:', error);
    throw new Error('Failed to create upload directory');
  }
}

// Helper to process and optimize images
async function processImage(buffer: Buffer, filename: string) {
  const ext = path.extname(filename).toLowerCase();
  
  if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
    try {
      // Process image with sharp - resize if too large and optimize
      const processedImage = await sharp(buffer)
        .resize(2048, 2048, { 
          fit: 'inside',
          withoutEnlargement: true 
        })
        .jpeg({ quality: 85, progressive: true })
        .toBuffer();
      
      // Also create a thumbnail
      const thumbnail = await sharp(buffer)
        .resize(300, 300, { 
          fit: 'cover',
          position: 'center'
        })
        .jpeg({ quality: 75 })
        .toBuffer();
      
      return { processed: processedImage, thumbnail };
    } catch (error) {
      console.error('Image processing error:', error);
      return { processed: buffer, thumbnail: null };
    }
  }
  
  return { processed: buffer, thumbnail: null };
}

// POST /api/upload - Upload a file
export async function POST(req: NextRequest) {
  try {
    const auth = await authenticateUser(req);
    if (!auth.authenticated) {
      return auth.response || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const category = formData.get('category') as string || 'general';
    const entityType = formData.get('entityType') as string; // expense, income, etc.
    const entityId = formData.get('entityId') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only images (JPEG, PNG, WebP) and PDFs are allowed' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const fileExt = path.extname(file.name);
    const uniqueId = uuidv4();
    const filename = `${uniqueId}${fileExt}`;
    const thumbnailFilename = `thumb_${uniqueId}.jpg`;

    // Ensure upload directory exists
    const userDir = await ensureUploadDir(auth.user!.userId);
    const categoryDir = path.join(userDir, category);
    await mkdir(categoryDir, { recursive: true });

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Process image if applicable
    const { processed, thumbnail } = await processImage(buffer, file.name);

    // Write main file
    const filePath = path.join(categoryDir, filename);
    await writeFile(filePath, processed);

    // Write thumbnail if created
    let thumbnailPath = null;
    if (thumbnail) {
      thumbnailPath = path.join(categoryDir, thumbnailFilename);
      await writeFile(thumbnailPath, thumbnail);
    }

    // Save file record to database
    await connectDB();
    
    const fileRecord = await File.create({
      fileId: uniqueId,
      userId: auth.user!.userId,
      filename: file.name,
      storedFilename: filename,
      path: `/uploads/${auth.user!.userId}/${category}/${filename}`,
      thumbnailPath: thumbnail ? `/uploads/${auth.user!.userId}/${category}/${thumbnailFilename}` : null,
      mimeType: file.type,
      size: file.size,
      category,
      entityType,
      entityId,
      uploadedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      file: fileRecord,
      message: 'File uploaded successfully',
    });
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

// GET /api/upload - List user's uploaded files
export async function GET(req: NextRequest) {
  try {
    const auth = await authenticateUser(req);
    if (!auth.authenticated) {
      return auth.response || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const entityType = searchParams.get('entityType');
    const entityId = searchParams.get('entityId');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Fetch files from database
    await connectDB();
    
    const query: any = { userId: auth.user!.userId };
    if (category) query.category = category;
    if (entityType) query.entityType = entityType;
    if (entityId) query.entityId = entityId;
    
    const files = await File.find(query)
      .sort({ uploadedAt: -1 })
      .limit(limit)
      .skip(offset);
    
    const total = await File.countDocuments(query);

    return NextResponse.json({
      files,
      total,
      limit,
      offset,
      hasMore: offset + files.length < total,
    });
  } catch (error) {
    console.error('List files error:', error);
    return NextResponse.json(
      { error: 'Failed to list files' },
      { status: 500 }
    );
  }
}

// DELETE /api/upload - Delete a file
export async function DELETE(req: NextRequest) {
  try {
    const auth = await authenticateUser(req);
    if (!auth.authenticated) {
      return auth.response || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { fileId } = await req.json();

    if (!fileId) {
      return NextResponse.json({ error: 'File ID is required' }, { status: 400 });
    }

    // Delete file from database and filesystem
    await connectDB();
    
    const file = await File.findOne({ 
      fileId: fileId, 
      userId: auth.user!.userId 
    });

    if (!file) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Delete physical files
    try {
      await unlink(path.join(process.cwd(), 'public', file.path));
      if (file.thumbnailPath) {
        await unlink(path.join(process.cwd(), 'public', file.thumbnailPath));
      }
    } catch (error) {
      console.error('Error deleting physical files:', error);
    }

    // Delete database record
    await File.deleteOne({ fileId: fileId });

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully',
    });
  } catch (error) {
    console.error('Delete file error:', error);
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    );
  }
}