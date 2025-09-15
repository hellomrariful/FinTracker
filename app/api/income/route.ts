import { NextRequest } from "next/server";
import { withAuth } from "@/lib/auth/protected-route";
import * as apiResponse from "@/lib/api-response";
import { validateBody, validateQuery } from "@/lib/api-middleware";
import {
  incomeRepo,
  IncomeFiltersSchema,
  CreateIncomeSchema,
} from "@/lib/repos/income";
import { z } from "zod";
import mongoose from "mongoose";

// Import models to ensure they are registered
import "@/lib/models/Employee";
import "@/lib/models/Income";

// GET /api/income - Fetch all income transactions
export const GET = withAuth(async (req: NextRequest, { auth }) => {
  try {
    // Parse query parameters
    const { searchParams } = req.nextUrl;
    const params: any = {};

    // Extract all search params
    searchParams.forEach((value, key) => {
      if (key === "tags") {
        params[key] = searchParams.getAll(key);
      } else {
        params[key] = value;
      }
    });

    // Validate filters
    const validationResult = IncomeFiltersSchema.safeParse(params);
    if (!validationResult.success) {
      console.log("❌ Invalid query parameters:", validationResult.error);
      return apiResponse.badRequest(
        "Invalid query parameters",
        validationResult.error
      );
    }

    const filters = validationResult.data;
    console.log("📋 Filters:", filters);
    console.log("🔑 User ID:", auth.user.userId);
    console.log("🔑 User ID type:", typeof auth.user.userId);

    // Get income with filters
    const result = await incomeRepo.find(auth.user.userId, filters);
    console.log("💰 Income result:", {
      count: result.data.length,
      total: result.pagination?.total,
      stats: result.stats,
    });
    
    // Debug: Check database directly
    if (mongoose.connection.db) {
      const directCheck = await mongoose.connection.db
        .collection('incomes')
        .countDocuments({ 
          userId: new mongoose.Types.ObjectId(auth.user.userId) 
        });
      console.log('Direct database check - income count:', directCheck);
    }

    return apiResponse.ok({
      incomes: result.data,
      pagination: result.pagination,
      stats: result.stats,
    });
  } catch (error) {
    console.error("❌ Error fetching income:", error);
    return apiResponse.serverError("Failed to fetch income");
  }
});

// POST /api/income - Create new income transaction
export const POST = withAuth(async (req: NextRequest, { auth }) => {
  try {
    const incomeData = await validateBody<z.infer<typeof CreateIncomeSchema>>(
      req,
      CreateIncomeSchema
    );

    // Create income
    const income = await incomeRepo.create(auth.user.userId, incomeData);

    return apiResponse.created({
      message: "Income created successfully",
      income,
    });
  } catch (error: any) {
    console.error("Error creating income:", error);

    if (error.name === "ValidationError") {
      return apiResponse.badRequest("Validation failed", error);
    }

    return apiResponse.serverError("Failed to create income");
  }
});
