import { NextRequest } from "next/server";
import { withAuth } from "@/lib/auth/protected-route";
import * as apiResponse from "@/lib/api-response";
import { validateBody } from "@/lib/api-middleware";
import Employee from "@/lib/models/Employee";
import { connectDB } from "@/lib/db/mongoose";
import { z } from "zod";

const CreateEmployeeSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email(),
  role: z.string().min(1).max(100),
  department: z.string().optional(),
  hireDate: z.coerce.date().optional(),
  salary: z.number().min(0).optional(),
  salaryFrequency: z
    .enum(["hourly", "daily", "weekly", "monthly", "yearly"])
    .optional(),
  status: z.enum(["active", "inactive", "terminated"]).default("active"),
  phone: z.string().optional(),
  address: z.string().optional(),
  emergencyContact: z
    .object({
      name: z.string(),
      phone: z.string(),
      relationship: z.string(),
    })
    .optional(),
});

// GET /api/employees - Get all employees
export const GET = withAuth(async (req: NextRequest, { auth }) => {
  try {
    await connectDB();

    const { searchParams } = req.nextUrl;
    const status = searchParams.get("status") || "active";
    const department = searchParams.get("department");
    const role = searchParams.get("role");

    const query: any = { userId: auth.user.userId };

    if (status) {
      query.status = status;
    }

    if (department) {
      query.department = department;
    }

    if (role) {
      query.role = role;
    }

    const employees = await Employee.find(query)
      .select("name email role department status hireDate salary avatar")
      .sort({ name: 1 })
      .lean();

    return apiResponse.ok({
      success: true,
      data: employees.map((emp: any) => ({
        ...emp,
        id: emp._id.toString(),
      })),
    });
  } catch (error) {
    console.error("Error fetching employees:", error);
    return apiResponse.serverError("Failed to fetch employees");
  }
});

// POST /api/employees - Create new employee
export const POST = withAuth(async (req: NextRequest, { auth }) => {
  try {
    await connectDB();

    const employeeData = await validateBody<
      z.infer<typeof CreateEmployeeSchema>
    >(req, CreateEmployeeSchema);

    // Check if email already exists
    const existingEmployee = await Employee.findOne({
      userId: auth.user.userId,
      email: employeeData.email,
    });

    if (existingEmployee) {
      return apiResponse.badRequest("Employee with this email already exists");
    }

    const employee = new Employee({
      ...employeeData,
      userId: auth.user.userId,
    });

    await employee.save();

    return apiResponse.created({
      message: "Employee created successfully",
      employee: {
        ...employee.toObject(),
        id: employee._id.toString(),
      },
    });
  } catch (error: any) {
    console.error("Error creating employee:", error);

    if (error.name === "ValidationError") {
      return apiResponse.badRequest("Validation failed", error);
    }

    return apiResponse.serverError("Failed to create employee");
  }
});
