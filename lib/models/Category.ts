import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  type: 'income' | 'expense' | 'both';
  description?: string;
  icon?: string;
  color?: string;
  parentId?: mongoose.Types.ObjectId; // For subcategories
  isActive: boolean;
  isDefault: boolean; // System default categories
  order?: number; // Display order
  budgetLimit?: number; // Monthly budget limit for expense categories
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    maxlength: [100, 'Category name cannot exceed 100 characters'],
  },
  type: {
    type: String,
    enum: ['income', 'expense', 'both'],
    required: [true, 'Category type is required'],
    index: true,
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters'],
  },
  icon: {
    type: String,
    maxlength: [50, 'Icon identifier cannot exceed 50 characters'],
  },
  color: {
    type: String,
    validate: {
      validator: function(v: string) {
        return !v || /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v);
      },
      message: 'Color must be a valid hex color code',
    },
  },
  parentId: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
  order: {
    type: Number,
    default: 0,
  },
  budgetLimit: {
    type: Number,
    min: [0, 'Budget limit must be positive'],
  },
}, {
  timestamps: true,
});

// Indexes for better query performance
categorySchema.index({ userId: 1, type: 1, isActive: 1 });
categorySchema.index({ userId: 1, name: 1 }, { unique: true });
categorySchema.index({ parentId: 1 });

// Virtual for subcategories
categorySchema.virtual('subcategories', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parentId',
});

// Method to check if category has transactions
categorySchema.methods.hasTransactions = async function() {
  const Income = mongoose.model('Income');
  const Expense = mongoose.model('Expense');
  
  if (this.type === 'income' || this.type === 'both') {
    const incomeCount = await Income.countDocuments({ 
      userId: this.userId, 
      category: this.name 
    });
    if (incomeCount > 0) return true;
  }
  
  if (this.type === 'expense' || this.type === 'both') {
    const expenseCount = await Expense.countDocuments({ 
      userId: this.userId, 
      category: this.name 
    });
    if (expenseCount > 0) return true;
  }
  
  return false;
};

// Static method to get categories with transaction counts
categorySchema.statics.getCategoriesWithStats = async function(
  userId: string,
  type?: 'income' | 'expense' | 'both'
) {
  const query: any = { userId, isActive: true };
  if (type) query.type = { $in: type === 'both' ? ['both', 'income', 'expense'] : [type, 'both'] };
  
  const categories = await this.find(query).sort({ order: 1, name: 1 });
  
  const Income = mongoose.model('Income');
  const Expense = mongoose.model('Expense');
  
  const categoriesWithStats = await Promise.all(
    categories.map(async (category: any) => {
      let incomeTotal = 0;
      let incomeCount = 0;
      let expenseTotal = 0;
      let expenseCount = 0;
      
      if (category.type === 'income' || category.type === 'both') {
        const incomeStats = await Income.aggregate([
          { $match: { userId: category.userId, category: category.name, status: 'completed' } },
          { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
        ]);
        if (incomeStats[0]) {
          incomeTotal = incomeStats[0].total;
          incomeCount = incomeStats[0].count;
        }
      }
      
      if (category.type === 'expense' || category.type === 'both') {
        const expenseStats = await Expense.aggregate([
          { $match: { userId: category.userId, category: category.name, status: { $ne: 'cancelled' } } },
          { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
        ]);
        if (expenseStats[0]) {
          expenseTotal = expenseStats[0].total;
          expenseCount = expenseStats[0].count;
        }
      }
      
      return {
        ...category.toObject(),
        incomeTotal,
        incomeCount,
        expenseTotal,
        expenseCount,
        totalTransactions: incomeCount + expenseCount,
        budgetUsage: category.budgetLimit ? (expenseTotal / category.budgetLimit) * 100 : null,
      };
    })
  );
  
  return categoriesWithStats;
};

// Static method to create default categories for new user
categorySchema.statics.createDefaultCategories = async function(userId: string) {
  const defaultCategories = [
    // Income categories
    { name: 'Salary', type: 'income', icon: '💰', color: '#10B981', description: 'Regular salary income' },
    { name: 'Freelance', type: 'income', icon: '💼', color: '#3B82F6', description: 'Freelance projects' },
    { name: 'Investments', type: 'income', icon: '📈', color: '#8B5CF6', description: 'Investment returns' },
    { name: 'Other Income', type: 'income', icon: '💵', color: '#06B6D4', description: 'Miscellaneous income' },
    
    // Expense categories
    { name: 'Housing', type: 'expense', icon: '🏠', color: '#EF4444', description: 'Rent, mortgage, utilities' },
    { name: 'Transportation', type: 'expense', icon: '🚗', color: '#F59E0B', description: 'Car, gas, public transport' },
    { name: 'Food & Dining', type: 'expense', icon: '🍽️', color: '#84CC16', description: 'Groceries, restaurants' },
    { name: 'Shopping', type: 'expense', icon: '🛍️', color: '#EC4899', description: 'Clothing, electronics, etc.' },
    { name: 'Entertainment', type: 'expense', icon: '🎬', color: '#14B8A6', description: 'Movies, games, hobbies' },
    { name: 'Healthcare', type: 'expense', icon: '🏥', color: '#F97316', description: 'Medical expenses' },
    { name: 'Education', type: 'expense', icon: '📚', color: '#6366F1', description: 'Courses, books, training' },
    { name: 'Insurance', type: 'expense', icon: '🛡️', color: '#0EA5E9', description: 'All insurance premiums' },
    { name: 'Utilities', type: 'expense', icon: '⚡', color: '#FBBF24', description: 'Electricity, water, internet' },
    { name: 'Other Expenses', type: 'expense', icon: '📌', color: '#94A3B8', description: 'Miscellaneous expenses' },
  ];
  
  const categories = defaultCategories.map((cat, index) => ({
    ...cat,
    userId,
    isDefault: true,
    isActive: true,
    order: index,
  }));
  
  return this.insertMany(categories);
};

const Category = mongoose.models.Category || mongoose.model<ICategory>('Category', categorySchema);

export default Category;
