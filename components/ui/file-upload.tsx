'use client';

import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  Upload,
  X,
  FileText,
  Image as ImageIcon,
  Loader2,
  CheckCircle,
  AlertCircle,
  Download,
  Eye,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

interface FileUploadProps {
  category?: string;
  entityType?: string;
  entityId?: string;
  maxFiles?: number;
  maxSize?: number;
  acceptedTypes?: string[];
  onUploadComplete?: (files: UploadedFile[]) => void;
  onFileRemove?: (fileId: string) => void;
  existingFiles?: UploadedFile[];
  className?: string;
}

interface UploadedFile {
  id: string;
  filename: string;
  path: string;
  thumbnailPath?: string;
  mimeType: string;
  size: number;
  uploadedAt: string;
}

interface UploadingFile {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

export function FileUpload({
  category = 'general',
  entityType,
  entityId,
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024, // 10MB
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
  onUploadComplete,
  onFileRemove,
  existingFiles = [],
  className,
}: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>(existingFiles);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = async (files: File[]) => {
    // Validate file count
    if (uploadedFiles.length + files.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`);
      return;
    }

    // Validate and prepare files
    const validFiles: UploadingFile[] = [];
    
    for (const file of files) {
      // Check file size
      if (file.size > maxSize) {
        toast.error(`${file.name} exceeds maximum size of ${maxSize / 1024 / 1024}MB`);
        continue;
      }

      // Check file type
      if (!acceptedTypes.includes(file.type)) {
        toast.error(`${file.name} has invalid file type`);
        continue;
      }

      validFiles.push({
        file,
        progress: 0,
        status: 'pending',
      });
    }

    if (validFiles.length === 0) return;

    setUploadingFiles(validFiles);

    // Upload files
    for (let i = 0; i < validFiles.length; i++) {
      await uploadFile(validFiles[i], i);
    }
  };

  const uploadFile = async (uploadingFile: UploadingFile, index: number) => {
    const formData = new FormData();
    formData.append('file', uploadingFile.file);
    formData.append('category', category);
    if (entityType) formData.append('entityType', entityType);
    if (entityId) formData.append('entityId', entityId);

    try {
      // Update status to uploading
      setUploadingFiles(prev => {
        const updated = [...prev];
        updated[index] = { ...updated[index], status: 'uploading', progress: 0 };
        return updated;
      });

      // Simulate progress (in real app, use XMLHttpRequest for progress)
      const progressInterval = setInterval(() => {
        setUploadingFiles(prev => {
          const updated = [...prev];
          if (updated[index] && updated[index].progress < 90) {
            updated[index] = { 
              ...updated[index], 
              progress: updated[index].progress + 10 
            };
          }
          return updated;
        });
      }, 200);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();

      // Update status to success
      setUploadingFiles(prev => {
        const updated = [...prev];
        updated[index] = { ...updated[index], status: 'success', progress: 100 };
        return updated;
      });

      // Add to uploaded files
      setUploadedFiles(prev => [...prev, data.file]);

      // Notify parent
      if (onUploadComplete) {
        onUploadComplete([...uploadedFiles, data.file]);
      }

      toast.success(`${uploadingFile.file.name} uploaded successfully`);

      // Remove from uploading after delay
      setTimeout(() => {
        setUploadingFiles(prev => prev.filter((_, i) => i !== index));
      }, 2000);

    } catch (error) {
      console.error('Upload error:', error);
      
      // Update status to error
      setUploadingFiles(prev => {
        const updated = [...prev];
        updated[index] = { 
          ...updated[index], 
          status: 'error', 
          error: 'Upload failed' 
        };
        return updated;
      });

      toast.error(`Failed to upload ${uploadingFile.file.name}`);
    }
  };

  const removeFile = async (fileId: string) => {
    try {
      const response = await fetch('/api/upload', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileId }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete file');
      }

      setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
      
      if (onFileRemove) {
        onFileRemove(fileId);
      }

      toast.success('File removed successfully');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to remove file');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return ImageIcon;
    return FileText;
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Upload Area */}
      <Card
        className={cn(
          'border-2 border-dashed p-8 text-center transition-colors cursor-pointer',
          isDragging && 'border-primary bg-primary/5',
          uploadedFiles.length >= maxFiles && 'opacity-50 cursor-not-allowed'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => uploadedFiles.length < maxFiles && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploadedFiles.length >= maxFiles}
        />

        <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-lg font-medium mb-2">
          Drop files here or click to browse
        </p>
        <p className="text-sm text-muted-foreground">
          Maximum {maxFiles} files, up to {maxSize / 1024 / 1024}MB each
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Supported: Images (JPEG, PNG, WebP) and PDFs
        </p>
      </Card>

      {/* Uploading Files */}
      {uploadingFiles.length > 0 && (
        <div className="space-y-2">
          {uploadingFiles.map((file, index) => (
            <Card key={index} className="p-3">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  {file.status === 'uploading' && (
                    <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                  )}
                  {file.status === 'success' && (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  )}
                  {file.status === 'error' && (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.file.size)}
                  </p>
                  {file.status === 'uploading' && (
                    <Progress value={file.progress} className="h-1 mt-1" />
                  )}
                  {file.error && (
                    <p className="text-xs text-red-600 mt-1">{file.error}</p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Uploaded Files ({uploadedFiles.length}/{maxFiles})</h4>
          {uploadedFiles.map((file) => {
            const FileIcon = getFileIcon(file.mimeType);
            const isImage = file.mimeType.startsWith('image/');

            return (
              <Card key={file.id} className="p-3">
                <div className="flex items-center gap-3">
                  {/* Thumbnail or Icon */}
                  <div className="flex-shrink-0">
                    {isImage && file.thumbnailPath ? (
                      <div className="relative h-12 w-12 rounded overflow-hidden">
                        <Image
                          src={file.thumbnailPath}
                          alt={file.filename}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <FileIcon className="h-12 w-12 text-muted-foreground" />
                    )}
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.filename}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)} • Uploaded {new Date(file.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(file.path, '_blank');
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Trigger download
                        const a = document.createElement('a');
                        a.href = file.path;
                        a.download = file.filename;
                        a.click();
                      }}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(file.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}