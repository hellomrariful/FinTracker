import mongoose, { Document, Schema } from 'mongoose';

export interface IFile extends Document {
  fileId: string;
  userId: string;
  filename: string;
  storedFilename: string;
  path: string;
  thumbnailPath?: string;
  mimeType: string;
  size: number;
  category: string;
  entityType?: string;
  entityId?: string;
  tags?: string[];
  description?: string;
  isPublic: boolean;
  uploadedAt: Date;
  lastAccessedAt?: Date;
  accessCount: number;
}

const FileSchema = new Schema<IFile>(
  {
    fileId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    filename: {
      type: String,
      required: true,
    },
    storedFilename: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    thumbnailPath: {
      type: String,
    },
    mimeType: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
      default: 'general',
      enum: ['general', 'receipts', 'invoices', 'documents', 'reports', 'goals', 'assets'],
    },
    entityType: {
      type: String,
      enum: ['expense', 'income', 'goal', 'budget', 'asset'],
    },
    entityId: {
      type: String,
    },
    tags: [{
      type: String,
    }],
    description: {
      type: String,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
    lastAccessedAt: {
      type: Date,
    },
    accessCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
FileSchema.index({ userId: 1, category: 1 });
FileSchema.index({ userId: 1, entityType: 1, entityId: 1 });
FileSchema.index({ userId: 1, uploadedAt: -1 });
FileSchema.index({ tags: 1 });

// Virtual for file URL
FileSchema.virtual('url').get(function() {
  return this.path;
});

// Virtual for thumbnail URL
FileSchema.virtual('thumbnailUrl').get(function() {
  return this.thumbnailPath || this.path;
});

// Method to increment access count
FileSchema.methods.recordAccess = async function() {
  this.lastAccessedAt = new Date();
  this.accessCount += 1;
  await this.save();
};

// Static method to get files by entity
FileSchema.statics.getByEntity = async function(
  userId: string,
  entityType: string,
  entityId: string
) {
  return this.find({
    userId,
    entityType,
    entityId,
  }).sort({ uploadedAt: -1 });
};

// Static method to get user's storage stats
FileSchema.statics.getUserStorageStats = async function(userId: string) {
  const result = await this.aggregate([
    { $match: { userId } },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
        totalSize: { $sum: '$size' },
      },
    },
  ]);

  const total = await this.aggregate([
    { $match: { userId } },
    {
      $group: {
        _id: null,
        totalCount: { $sum: 1 },
        totalSize: { $sum: '$size' },
      },
    },
  ]);

  return {
    byCategory: result,
    total: total[0] || { totalCount: 0, totalSize: 0 },
  };
};

const File = mongoose.models.File || mongoose.model<IFile>('File', FileSchema);

export default File;