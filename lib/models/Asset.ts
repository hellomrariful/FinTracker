import mongoose, { Document, Schema } from 'mongoose';

export interface IAsset extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  category: 'physical' | 'digital' | 'financial' | 'intellectual';
  subCategory?: string;
  purchaseDate: Date;
  purchasePrice: number;
  currentValue?: number;
  depreciationRate?: number;
  depreciationMethod?: 'straight-line' | 'declining-balance' | 'sum-of-years' | 'units-of-production';
  salvageValue?: number;
  usefulLife?: number; // in months
  location?: string;
  condition?: 'excellent' | 'good' | 'fair' | 'poor';
  warranty?: Date;
  maintenanceSchedule?: string;
  lastMaintenanceDate?: Date;
  assignedTo?: mongoose.Types.ObjectId;
  serialNumber?: string;
  manufacturer?: string;
  model?: string;
  notes?: string;
  attachments?: string[];
  tags?: string[];
  status: 'active' | 'inactive' | 'disposed' | 'maintenance';
  disposalDate?: Date;
  disposalValue?: number;
  createdAt: Date;
  updatedAt: Date;
}

const assetSchema = new Schema<IAsset>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: [true, 'Asset name is required'],
    trim: true,
    maxlength: [200, 'Asset name cannot exceed 200 characters'],
  },
  category: {
    type: String,
    enum: ['physical', 'digital', 'financial', 'intellectual'],
    required: [true, 'Category is required'],
    index: true,
  },
  subCategory: {
    type: String,
    trim: true,
  },
  purchaseDate: {
    type: Date,
    required: [true, 'Purchase date is required'],
  },
  purchasePrice: {
    type: Number,
    required: [true, 'Purchase price is required'],
    min: [0, 'Purchase price must be positive'],
  },
  currentValue: {
    type: Number,
    min: [0, 'Current value must be positive'],
  },
  depreciationRate: {
    type: Number,
    min: [0, 'Depreciation rate must be positive'],
    max: [100, 'Depreciation rate cannot exceed 100%'],
  },
  depreciationMethod: {
    type: String,
    enum: ['straight-line', 'declining-balance', 'sum-of-years', 'units-of-production'],
    default: 'straight-line',
  },
  salvageValue: {
    type: Number,
    min: [0, 'Salvage value must be positive'],
  },
  usefulLife: {
    type: Number,
    min: [1, 'Useful life must be at least 1 month'],
  },
  location: {
    type: String,
    trim: true,
  },
  condition: {
    type: String,
    enum: ['excellent', 'good', 'fair', 'poor'],
    default: 'good',
  },
  warranty: {
    type: Date,
  },
  maintenanceSchedule: {
    type: String,
  },
  lastMaintenanceDate: {
    type: Date,
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'Employee',
  },
  serialNumber: {
    type: String,
    trim: true,
  },
  manufacturer: {
    type: String,
    trim: true,
  },
  model: {
    type: String,
    trim: true,
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters'],
  },
  attachments: [{
    type: String,
  }],
  tags: [{
    type: String,
    trim: true,
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'disposed', 'maintenance'],
    default: 'active',
    index: true,
  },
  disposalDate: {
    type: Date,
  },
  disposalValue: {
    type: Number,
    min: [0, 'Disposal value must be positive'],
  },
}, {
  timestamps: true,
});

// Indexes for better query performance
assetSchema.index({ userId: 1, status: 1 });
assetSchema.index({ userId: 1, category: 1 });
assetSchema.index({ userId: 1, assignedTo: 1 });

// Virtual for age in months
assetSchema.virtual('ageInMonths').get(function() {
  const now = new Date();
  const purchaseDate = new Date(this.purchaseDate);
  const months = (now.getFullYear() - purchaseDate.getFullYear()) * 12 + 
                 (now.getMonth() - purchaseDate.getMonth());
  return Math.max(0, months);
});

// Method to calculate current depreciated value
assetSchema.methods.calculateDepreciatedValue = function() {
  if (!this.depreciationRate || !this.usefulLife) {
    return this.currentValue || this.purchasePrice;
  }

  const ageInMonths = this.ageInMonths;
  const salvageValue = this.salvageValue || 0;
  
  switch (this.depreciationMethod) {
    case 'straight-line': {
      const monthlyDepreciation = (this.purchasePrice - salvageValue) / this.usefulLife;
      const totalDepreciation = Math.min(monthlyDepreciation * ageInMonths, this.purchasePrice - salvageValue);
      return Math.max(this.purchasePrice - totalDepreciation, salvageValue);
    }
    
    case 'declining-balance': {
      const monthlyRate = this.depreciationRate / 12 / 100;
      let value = this.purchasePrice;
      for (let i = 0; i < ageInMonths && value > salvageValue; i++) {
        value = value * (1 - monthlyRate);
      }
      return Math.max(value, salvageValue);
    }
    
    default:
      return this.currentValue || this.purchasePrice;
  }
};

// Method to check if warranty is still valid
assetSchema.methods.isUnderWarranty = function() {
  return this.warranty && new Date() < new Date(this.warranty);
};

// Method to check if maintenance is due
assetSchema.methods.isMaintenanceDue = function(daysBefore = 30) {
  if (!this.maintenanceSchedule || !this.lastMaintenanceDate) return false;
  
  // Parse maintenance schedule (e.g., "90 days", "6 months", "1 year")
  const match = this.maintenanceSchedule.match(/(\d+)\s*(day|month|year)/i);
  if (!match) return false;
  
  const [, value, unit] = match;
  const lastMaintenance = new Date(this.lastMaintenanceDate);
  const nextMaintenance = new Date(lastMaintenance);
  
  switch (unit.toLowerCase()) {
    case 'day':
      nextMaintenance.setDate(nextMaintenance.getDate() + parseInt(value));
      break;
    case 'month':
      nextMaintenance.setMonth(nextMaintenance.getMonth() + parseInt(value));
      break;
    case 'year':
      nextMaintenance.setFullYear(nextMaintenance.getFullYear() + parseInt(value));
      break;
  }
  
  const dueDate = new Date(nextMaintenance);
  dueDate.setDate(dueDate.getDate() - daysBefore);
  
  return new Date() >= dueDate;
};

// Static method to get total asset value
assetSchema.statics.getTotalAssetValue = async function(
  userId: string,
  category?: string
) {
  const query: any = { userId, status: 'active' };
  if (category) query.category = category;
  
  const assets = await this.find(query);
  return assets.reduce((total, asset) => {
    return total + (asset.calculateDepreciatedValue ? asset.calculateDepreciatedValue() : 0);
  }, 0);
};

// Static method to get assets by category
assetSchema.statics.getAssetsByCategory = async function(userId: string) {
  return this.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId), status: 'active' } },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
        totalPurchasePrice: { $sum: '$purchasePrice' },
        totalCurrentValue: { $sum: '$currentValue' },
      },
    },
    { $sort: { totalPurchasePrice: -1 } },
  ]);
};

// Static method to get assets needing maintenance
assetSchema.statics.getAssetsNeedingMaintenance = async function(userId: string) {
  const assets = await this.find({ 
    userId, 
    status: 'active',
    maintenanceSchedule: { $exists: true, $ne: null },
    lastMaintenanceDate: { $exists: true },
  });
  
  return assets.filter(asset => asset.isMaintenanceDue && asset.isMaintenanceDue());
};

const Asset = mongoose.models.Asset || mongoose.model<IAsset>('Asset', assetSchema);

export default Asset;
