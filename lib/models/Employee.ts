import mongoose, { Document, Schema } from 'mongoose';

export interface IEmployee extends Document {
  userId: mongoose.Types.ObjectId; // Organization/company owner
  name: string;
  email: string;
  role: string;
  department: string;
  avatar?: string;
  hireDate: Date;
  salary?: number;
  salaryFrequency?: 'hourly' | 'weekly' | 'bi-weekly' | 'monthly' | 'yearly';
  performance?: number; // 0-100 performance score
  status: 'active' | 'inactive' | 'terminated' | 'on_leave';
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  emergencyContact?: {
    name?: string;
    relationship?: string;
    phone?: string;
    email?: string;
  };
  permissions?: {
    canViewIncome?: boolean;
    canEditIncome?: boolean;
    canViewExpenses?: boolean;
    canEditExpenses?: boolean;
    canViewAssets?: boolean;
    canEditAssets?: boolean;
    canViewReports?: boolean;
    canManageTeam?: boolean;
    canManageSettings?: boolean;
  };
  bankDetails?: {
    accountName?: string;
    accountNumber?: string;
    bankName?: string;
    routingNumber?: string;
  };
  taxInfo?: {
    taxId?: string;
    taxRate?: number;
    filingStatus?: string;
  };
  benefits?: {
    healthInsurance?: boolean;
    dentalInsurance?: boolean;
    visionInsurance?: boolean;
    retirement401k?: boolean;
    retirementContribution?: number;
    paidTimeOff?: number;
    sickLeave?: number;
  };
  performanceReviews?: {
    date: Date;
    score: number;
    reviewer: string;
    comments?: string;
  }[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const employeeSchema = new Schema<IEmployee>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: [true, 'Employee name is required'],
    trim: true,
    maxlength: [200, 'Name cannot exceed 200 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(v: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Invalid email address',
    },
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    trim: true,
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true,
  },
  avatar: {
    type: String,
  },
  hireDate: {
    type: Date,
    required: [true, 'Hire date is required'],
  },
  salary: {
    type: Number,
    min: [0, 'Salary must be positive'],
  },
  salaryFrequency: {
    type: String,
    enum: ['hourly', 'weekly', 'bi-weekly', 'monthly', 'yearly'],
    default: 'monthly',
  },
  performance: {
    type: Number,
    min: [0, 'Performance score must be between 0 and 100'],
    max: [100, 'Performance score must be between 0 and 100'],
    default: 75,
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'terminated', 'on_leave'],
    default: 'active',
    index: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    postalCode: String,
  },
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String,
    email: String,
  },
  permissions: {
    canViewIncome: { type: Boolean, default: false },
    canEditIncome: { type: Boolean, default: false },
    canViewExpenses: { type: Boolean, default: true },
    canEditExpenses: { type: Boolean, default: false },
    canViewAssets: { type: Boolean, default: false },
    canEditAssets: { type: Boolean, default: false },
    canViewReports: { type: Boolean, default: false },
    canManageTeam: { type: Boolean, default: false },
    canManageSettings: { type: Boolean, default: false },
  },
  bankDetails: {
    accountName: String,
    accountNumber: String,
    bankName: String,
    routingNumber: String,
  },
  taxInfo: {
    taxId: String,
    taxRate: Number,
    filingStatus: String,
  },
  benefits: {
    healthInsurance: { type: Boolean, default: false },
    dentalInsurance: { type: Boolean, default: false },
    visionInsurance: { type: Boolean, default: false },
    retirement401k: { type: Boolean, default: false },
    retirementContribution: Number,
    paidTimeOff: Number,
    sickLeave: Number,
  },
  performanceReviews: [{
    date: {
      type: Date,
      required: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    reviewer: {
      type: String,
      required: true,
    },
    comments: String,
  }],
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters'],
  },
}, {
  timestamps: true,
});

// Indexes for better query performance
employeeSchema.index({ userId: 1, status: 1 });
employeeSchema.index({ userId: 1, department: 1 });
employeeSchema.index({ userId: 1, role: 1 });
employeeSchema.index({ email: 1 });

// Virtual for years of service
employeeSchema.virtual('yearsOfService').get(function() {
  const now = new Date();
  const hireDate = new Date(this.hireDate);
  const years = (now.getFullYear() - hireDate.getFullYear()) + 
                ((now.getMonth() - hireDate.getMonth()) / 12);
  return Math.round(years * 10) / 10;
});

// Virtual for annual salary (normalized)
employeeSchema.virtual('annualSalary').get(function() {
  if (!this.salary) return 0;
  
  switch (this.salaryFrequency) {
    case 'hourly':
      return this.salary * 2080; // 40 hours/week * 52 weeks
    case 'weekly':
      return this.salary * 52;
    case 'bi-weekly':
      return this.salary * 26;
    case 'monthly':
      return this.salary * 12;
    case 'yearly':
    default:
      return this.salary;
  }
});

// Method to calculate total compensation
employeeSchema.methods.calculateTotalCompensation = function() {
  let total = this.annualSalary || 0;
  
  if (this.benefits) {
    // Add retirement contribution
    if (this.benefits.retirement401k && this.benefits.retirementContribution) {
      total += this.benefits.retirementContribution;
    }
    
    // Estimate insurance costs
    if (this.benefits.healthInsurance) total += 6000; // Average employer contribution
    if (this.benefits.dentalInsurance) total += 600;
    if (this.benefits.visionInsurance) total += 300;
  }
  
  return total;
};

// Method to add performance review
employeeSchema.methods.addPerformanceReview = function(
  score: number,
  reviewer: string,
  comments?: string
) {
  if (!this.performanceReviews) {
    this.performanceReviews = [];
  }
  
  this.performanceReviews.push({
    date: new Date(),
    score,
    reviewer,
    comments,
  });
  
  // Update overall performance score (weighted average of recent reviews)
  const recentReviews = this.performanceReviews
    .sort((a: any, b: any) => b.date.getTime() - a.date.getTime())
    .slice(0, 3); // Consider last 3 reviews
  
  if (recentReviews.length > 0) {
    const avgScore = recentReviews.reduce((sum: number, review: any) => sum + review.score, 0) / recentReviews.length;
    this.performance = Math.round(avgScore);
  }
  
  return this.save();
};

// Static method to get team statistics
employeeSchema.statics.getTeamStatistics = async function(userId: string) {
  const employees = await this.find({ userId, status: 'active' });
  
  const stats = {
    totalEmployees: employees.length,
    averageSalary: 0,
    averagePerformance: 0,
    averageYearsOfService: 0,
    departmentBreakdown: {} as Record<string, number>,
    roleBreakdown: {} as Record<string, number>,
    totalPayroll: 0,
    totalCompensation: 0,
  };
  
  if (employees.length === 0) return stats;
  
  let totalSalary = 0;
  let totalPerformance = 0;
  let totalYears = 0;
  let totalCompensation = 0;
  
  employees.forEach((emp: any) => {
    const annualSalary = emp.annualSalary || 0;
    totalSalary += annualSalary;
    totalPerformance += emp.performance || 0;
    totalYears += emp.yearsOfService || 0;
    totalCompensation += emp.calculateTotalCompensation ? emp.calculateTotalCompensation() : 0;
    
    // Department breakdown
    if (emp.department) {
      stats.departmentBreakdown[emp.department] = (stats.departmentBreakdown[emp.department] || 0) + 1;
    }
    
    // Role breakdown
    if (emp.role) {
      stats.roleBreakdown[emp.role] = (stats.roleBreakdown[emp.role] || 0) + 1;
    }
  });
  
  stats.averageSalary = Math.round(totalSalary / employees.length);
  stats.averagePerformance = Math.round(totalPerformance / employees.length);
  stats.averageYearsOfService = Math.round((totalYears / employees.length) * 10) / 10;
  stats.totalPayroll = totalSalary;
  stats.totalCompensation = totalCompensation;
  
  return stats;
};

// Static method to get employees by performance
employeeSchema.statics.getTopPerformers = async function(userId: string, limit = 5) {
  return this.find({ userId, status: 'active' })
    .sort({ performance: -1 })
    .limit(limit)
    .select('name email role department performance avatar');
};

// Static method to calculate employee-related expenses
employeeSchema.statics.getEmployeeExpenses = async function(
  userId: string,
  employeeId: string,
  startDate?: Date,
  endDate?: Date
) {
  const Expense = mongoose.model('Expense');
  
  const query: any = { 
    userId, 
    employeeId: new mongoose.Types.ObjectId(employeeId),
    status: { $ne: 'cancelled' },
  };
  
  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = startDate;
    if (endDate) query.date.$lte = endDate;
  }
  
  const result = await Expense.aggregate([
    { $match: query },
    {
      $group: {
        _id: '$category',
        total: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    { $sort: { total: -1 } },
  ]);
  
  return result;
};

const Employee = mongoose.models.Employee || mongoose.model<IEmployee>('Employee', employeeSchema);

export default Employee;
