import Asset, { IAsset } from "@/lib/models/Asset";
import { connectDB } from "@/lib/db/mongodb";
import mongoose from "mongoose";
import { z } from "zod";

// Validation schemas
export const AssetFiltersSchema = z.object({
  q: z.string().optional(),
  category: z
    .enum(["physical", "digital", "financial", "intellectual"])
    .optional(),
  status: z.enum(["active", "inactive", "disposed", "maintenance"]).optional(),
  condition: z.enum(["excellent", "good", "fair", "poor"]).optional(),
  minValue: z.coerce.number().min(0).optional(),
  maxValue: z.coerce.number().min(0).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  assignedTo: z.string().optional(),
  tags: z.array(z.string()).or(z.string()).optional(),
  underWarranty: z.coerce.boolean().optional(),
  needsMaintenance: z.coerce.boolean().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  sortBy: z
    .enum([
      "name",
      "purchaseDate",
      "purchasePrice",
      "currentValue",
      "createdAt",
    ])
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type AssetFilters = z.infer<typeof AssetFiltersSchema>;

export const CreateAssetSchema = z.object({
  name: z.string().min(1).max(200),
  category: z.enum(["physical", "digital", "financial", "intellectual"]),
  subCategory: z.string().optional(),
  purchaseDate: z.coerce.date(),
  purchasePrice: z.coerce
    .number()
    .min(0, "Purchase price must be 0 or greater"),
  currentValue: z.coerce.number().min(0).optional(),
  depreciationRate: z.number().min(0).max(100).optional(),
  depreciationMethod: z
    .enum([
      "straight-line",
      "declining-balance",
      "sum-of-years",
      "units-of-production",
    ])
    .optional(),
  salvageValue: z.number().min(0).optional(),
  usefulLife: z.number().min(1).optional(),
  location: z.string().optional(),
  condition: z.enum(["excellent", "good", "fair", "poor"]).optional(),
  warranty: z.coerce.date().optional(),
  maintenanceSchedule: z.string().optional(),
  lastMaintenanceDate: z.coerce.date().optional(),
  assignedTo: z.string().optional(),
  serialNumber: z.string().optional(),
  manufacturer: z.string().optional(),
  modelNumber: z.string().optional(),
  notes: z.string().max(1000).optional(),
  attachments: z
    .array(
      z.object({
        url: z.string().url(),
        pathname: z.string(),
        size: z.number(),
        contentType: z.string(),
        uploadedAt: z.coerce.date(),
      })
    )
    .optional(),
  tags: z.array(z.string()).optional(),
  status: z
    .enum(["active", "inactive", "disposed", "maintenance"])
    .default("active"),
});

export const UpdateAssetSchema = CreateAssetSchema.partial().extend({
  disposalDate: z.coerce.date().optional(),
  disposalValue: z.number().min(0).optional(),
});

export class AssetsRepository {
  private async ensureConnection() {
    await connectDB();
  }

  async find(userId: string, filters: AssetFilters) {
    await this.ensureConnection();

    const query: any = { userId: new mongoose.Types.ObjectId(userId) };

    // Text search
    if (filters.q) {
      query.$or = [
        { name: { $regex: filters.q, $options: "i" } },
        { notes: { $regex: filters.q, $options: "i" } },
        { serialNumber: { $regex: filters.q, $options: "i" } },
        { manufacturer: { $regex: filters.q, $options: "i" } },
        { modelNumber: { $regex: filters.q, $options: "i" } },
        { location: { $regex: filters.q, $options: "i" } },
        { tags: { $in: [new RegExp(filters.q, "i")] } },
      ];
    }

    // Category filter
    if (filters.category) {
      query.category = filters.category;
    }

    // Status filter
    if (filters.status) {
      query.status = filters.status;
    }

    // Condition filter
    if (filters.condition) {
      query.condition = filters.condition;
    }

    // Value range filters
    if (filters.minValue !== undefined || filters.maxValue !== undefined) {
      query.purchasePrice = {};
      if (filters.minValue !== undefined) {
        query.purchasePrice.$gte = filters.minValue;
      }
      if (filters.maxValue !== undefined) {
        query.purchasePrice.$lte = filters.maxValue;
      }
    }

    // Date range filters
    if (filters.startDate || filters.endDate) {
      query.purchaseDate = {};
      if (filters.startDate) {
        query.purchaseDate.$gte = filters.startDate;
      }
      if (filters.endDate) {
        query.purchaseDate.$lte = filters.endDate;
      }
    }

    // Assigned to filter
    if (filters.assignedTo) {
      query.assignedTo = new mongoose.Types.ObjectId(filters.assignedTo);
    }

    // Tags filter
    if (filters.tags) {
      const tags = Array.isArray(filters.tags) ? filters.tags : [filters.tags];
      query.tags = { $in: tags };
    }

    // Build sort object
    const sort: any = {};
    sort[filters.sortBy] = filters.sortOrder === "asc" ? 1 : -1;

    // Execute query with pagination
    const skip = (filters.page - 1) * filters.limit;

    let assetsQuery = Asset.find(query)
      .sort(sort)
      .skip(skip)
      .limit(filters.limit)
      .lean();

    // Get assets and total count
    const [assets, total] = await Promise.all([
      assetsQuery.exec(),
      Asset.countDocuments(query),
    ]);

    // Post-process for warranty and maintenance filters
    let processedAssets = assets;

    if (filters.underWarranty !== undefined) {
      processedAssets = processedAssets.filter((asset) => {
        const isUnderWarranty =
          asset.warranty && new Date() < new Date(asset.warranty);
        return filters.underWarranty ? isUnderWarranty : !isUnderWarranty;
      });
    }

    if (filters.needsMaintenance !== undefined) {
      const assetModels = await Asset.find({
        _id: { $in: processedAssets.map((a) => (a as any)._id) },
      });
      const maintenanceStatus = new Map();

      for (const model of assetModels) {
        maintenanceStatus.set(
          (model as any)._id.toString(),
          (model as any).isMaintenanceDue()
        );
      }

      processedAssets = processedAssets.filter((asset) => {
        const needsMaintenance =
          maintenanceStatus.get((asset as any)._id.toString()) || false;
        return filters.needsMaintenance ? needsMaintenance : !needsMaintenance;
      });
    }

    // Calculate depreciated values for each asset
    const enrichedAssets = await Promise.all(
      processedAssets.map(async (asset) => {
        const assetModel = await Asset.findById((asset as any)._id);
        const depreciatedValue = assetModel
          ? assetModel.calculateDepreciatedValue()
          : asset.currentValue || asset.purchasePrice;
        return {
          ...asset,
          depreciatedValue,
          ageInMonths: assetModel ? assetModel.ageInMonths : 0,
        };
      })
    );

    return {
      data: enrichedAssets,
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total,
        totalPages: Math.ceil(total / filters.limit),
      },
    };
  }

  async findById(userId: string, assetId: string) {
    await this.ensureConnection();

    const asset = await Asset.findOne({
      _id: new mongoose.Types.ObjectId(assetId),
      userId: new mongoose.Types.ObjectId(userId),
    });

    if (!asset) {
      return null;
    }

    // Enrich with calculated values
    return {
      ...asset.toObject(),
      depreciatedValue: asset.calculateDepreciatedValue(),
      ageInMonths: asset.ageInMonths,
      isUnderWarranty: asset.isUnderWarranty(),
      isMaintenanceDue: asset.isMaintenanceDue(),
    };
  }

  async create(userId: string, data: z.infer<typeof CreateAssetSchema>) {
    await this.ensureConnection();

    const asset = new Asset({
      ...data,
      userId: new mongoose.Types.ObjectId(userId),
      assignedTo: data.assignedTo
        ? new mongoose.Types.ObjectId(data.assignedTo)
        : undefined,
    });

    await asset.save();

    return {
      ...asset.toObject(),
      depreciatedValue: asset.calculateDepreciatedValue(),
      ageInMonths: asset.ageInMonths,
      isUnderWarranty: asset.isUnderWarranty(),
      isMaintenanceDue: asset.isMaintenanceDue(),
    };
  }

  async update(
    userId: string,
    assetId: string,
    data: z.infer<typeof UpdateAssetSchema>
  ) {
    await this.ensureConnection();

    const updateData: any = { ...data };
    if (data.assignedTo) {
      updateData.assignedTo = new mongoose.Types.ObjectId(data.assignedTo);
    }

    const asset = await Asset.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(assetId),
        userId: new mongoose.Types.ObjectId(userId),
      },
      updateData,
      { new: true, runValidators: true }
    );

    if (!asset) {
      return null;
    }

    return {
      ...asset.toObject(),
      depreciatedValue: asset.calculateDepreciatedValue(),
      ageInMonths: asset.ageInMonths,
      isUnderWarranty: asset.isUnderWarranty(),
      isMaintenanceDue: asset.isMaintenanceDue(),
    };
  }

  async delete(userId: string, assetId: string) {
    await this.ensureConnection();

    const result = await Asset.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(assetId),
      userId: new mongoose.Types.ObjectId(userId),
    });

    return result !== null;
  }

  async getStatistics(userId: string) {
    await this.ensureConnection();

    const userObjectId = new mongoose.Types.ObjectId(userId);

    const [
      totalAssets,
      activeAssets,
      totalValue,
      categoryBreakdown,
      conditionBreakdown,
      maintenanceDue,
      underWarranty,
      recentAcquisitions,
    ] = await Promise.all([
      Asset.countDocuments({ userId: userObjectId }),
      Asset.countDocuments({ userId: userObjectId, status: "active" }),
      (Asset as any).getTotalAssetValue(userId),
      (Asset as any).getAssetsByCategory(userId),
      Asset.aggregate([
        { $match: { userId: userObjectId, status: "active" } },
        { $group: { _id: "$condition", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      (Asset as any).getAssetsNeedingMaintenance(userId),
      Asset.countDocuments({
        userId: userObjectId,
        status: "active",
        warranty: { $gt: new Date() },
      }),
      Asset.find({ userId: userObjectId })
        .sort({ purchaseDate: -1 })
        .limit(5)
        .lean(),
    ]);

    return {
      totalAssets,
      activeAssets,
      totalValue,
      categoryBreakdown,
      conditionBreakdown,
      maintenanceDue: maintenanceDue.length,
      underWarranty,
      recentAcquisitions,
    };
  }

  async bulkUpdateStatus(userId: string, assetIds: string[], status: string) {
    await this.ensureConnection();

    const result = await Asset.updateMany(
      {
        _id: { $in: assetIds.map((id) => new mongoose.Types.ObjectId(id)) },
        userId: new mongoose.Types.ObjectId(userId),
      },
      { status }
    );

    return result.modifiedCount;
  }

  async getDepreciationReport(userId: string, year?: number) {
    await this.ensureConnection();

    const currentYear = year || new Date().getFullYear();
    const startDate = new Date(currentYear, 0, 1);
    const endDate = new Date(currentYear, 11, 31);

    const assets = await Asset.find({
      userId: new mongoose.Types.ObjectId(userId),
      purchaseDate: { $lte: endDate },
      $or: [{ disposalDate: null }, { disposalDate: { $gte: startDate } }],
    });

    const report = assets.map((asset) => {
      const depreciatedValue = asset.calculateDepreciatedValue();
      const totalDepreciation = asset.purchasePrice - depreciatedValue;

      return {
        assetId: asset._id,
        name: asset.name,
        category: asset.category,
        purchasePrice: asset.purchasePrice,
        currentValue: depreciatedValue,
        totalDepreciation,
        depreciationMethod: asset.depreciationMethod,
        ageInMonths: asset.ageInMonths,
      };
    });

    const totalOriginalValue = report.reduce(
      (sum, item) => sum + item.purchasePrice,
      0
    );
    const totalCurrentValue = report.reduce(
      (sum, item) => sum + item.currentValue,
      0
    );
    const totalDepreciation = totalOriginalValue - totalCurrentValue;

    return {
      year: currentYear,
      assets: report,
      summary: {
        totalAssets: report.length,
        totalOriginalValue,
        totalCurrentValue,
        totalDepreciation,
        averageDepreciationRate:
          totalOriginalValue > 0
            ? (totalDepreciation / totalOriginalValue) * 100
            : 0,
      },
    };
  }
}

export const assetsRepo = new AssetsRepository();
