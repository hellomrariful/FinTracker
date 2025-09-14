#!/usr/bin/env node
import { connectDB, disconnectDB, createIndexes } from '@/lib/db/mongoose';
import { config } from '@/lib/config/env';

// Import models
import User from '@/lib/models/User';
import Category from '@/lib/models/Category';
import Income from '@/lib/models/Income';
import Expense from '@/lib/models/Expense';
import Asset from '@/lib/models/Asset';
import Employee from '@/lib/models/Employee';
import Budget from '@/lib/models/Budget';
import Goal from '@/lib/models/Goal';

/**
 * Seed data for development
 * Run with: npm run seed
 */
async function seedDatabase() {
  console.log('\n🌱 Starting database seeding...\n');
  
  // Check environment
  if (config.app.env === 'production' && !config.dev.seedDatabase) {
    console.error('❌ Cannot seed database in production unless SEED_DATABASE=true');
    process.exit(1);
  }

  try {
    // Connect to database
    await connectDB();
    console.log('✅ Connected to MongoDB\n');

    // Create indexes (skip if they already exist)
    try {
      await createIndexes();
      console.log('✅ Indexes created\n');
    } catch (indexError: any) {
      if (indexError.code === 86 || indexError.codeName === 'IndexKeySpecsConflict') {
        console.log('⚠️  Indexes already exist, skipping creation\n');
      } else {
        throw indexError;
      }
    }

    // Clear existing data (only in development)
    if (config.app.env === 'development') {
      console.log('🗑️  Clearing existing data...');
      await Promise.all([
        User.deleteMany({}),
        Category.deleteMany({}),
        Income.deleteMany({}),
        Expense.deleteMany({}),
        Asset.deleteMany({}),
        Employee.deleteMany({}),
        Budget.deleteMany({}),
        Goal.deleteMany({}),
      ]);
      console.log('✅ Database cleared\n');
    }

    // Create demo users
    console.log('👤 Creating demo users...');
    
    // Original demo user - pass plain password, let model hash it
    const demoUser = await User.create({
      email: 'demo@fintracker.com',
      password: 'demo123456',  // Plain password - will be hashed by model
      firstName: 'John',
      lastName: 'Doe',
      company: 'Acme Corporation',
      role: 'owner',
      isEmailVerified: true,
      isActive: true,
    });
    console.log(`✅ Demo user created: ${demoUser.email}`);
    
    // Test user with requested credentials
    const testUser = await User.create({
      email: 'demo@gmail.com',
      password: '12345678',  // Plain password - will be hashed by model
      firstName: 'Test',
      lastName: 'User',
      company: 'Test Company',
      role: 'owner',
      isEmailVerified: true,
      isActive: true,
    });
    console.log(`✅ Test user created: ${testUser.email}\n`);

    // Create categories
    console.log('📁 Creating categories...');
    const categories = await Category.create([
      // Income categories
      { userId: demoUser._id, name: 'Product Sales', type: 'income', color: '#10B981', icon: 'package' },
      { userId: demoUser._id, name: 'Service Revenue', type: 'income', color: '#3B82F6', icon: 'briefcase' },
      { userId: demoUser._id, name: 'Subscription', type: 'income', color: '#8B5CF6', icon: 'credit-card' },
      { userId: demoUser._id, name: 'Consulting', type: 'income', color: '#EC4899', icon: 'users' },
      
      // Expense categories
      { userId: demoUser._id, name: 'Software', type: 'expense', color: '#EF4444', icon: 'code' },
      { userId: demoUser._id, name: 'Marketing', type: 'expense', color: '#F59E0B', icon: 'megaphone' },
      { userId: demoUser._id, name: 'Operations', type: 'expense', color: '#6366F1', icon: 'settings' },
      { userId: demoUser._id, name: 'Office Supplies', type: 'expense', color: '#84CC16', icon: 'paperclip' },
      { userId: demoUser._id, name: 'Travel', type: 'expense', color: '#06B6D4', icon: 'plane' },
      { userId: demoUser._id, name: 'Salaries', type: 'expense', color: '#F97316', icon: 'dollar-sign' },
    ]);
    console.log(`✅ ${categories.length} categories created\n`);

    // Create employees
    console.log('👥 Creating employees...');
    const employees = await Employee.create([
      {
        userId: demoUser._id,
        name: 'Alice Johnson',
        email: 'alice@acme.com',
        role: 'Sales Manager',
        department: 'Sales',
        hireDate: new Date('2022-01-15'),
        annualSalary: 75000,
        performance: 85,
        status: 'active',
      },
      {
        userId: demoUser._id,
        name: 'Bob Smith',
        email: 'bob@acme.com',
        role: 'Developer',
        department: 'Engineering',
        hireDate: new Date('2021-06-01'),
        annualSalary: 95000,
        performance: 90,
        status: 'active',
      },
      {
        userId: demoUser._id,
        name: 'Carol Williams',
        email: 'carol@acme.com',
        role: 'Marketing Specialist',
        department: 'Marketing',
        hireDate: new Date('2023-03-20'),
        annualSalary: 65000,
        performance: 78,
        status: 'active',
      },
    ]);
    console.log(`✅ ${employees.length} employees created\n`);

    // Generate income transactions
    console.log('💰 Creating income transactions...');
    const incomeData = [];
    const incomeCategories = categories.filter(c => c.type === 'income');
    
    // Generate 3 months of income data
    for (let monthOffset = 2; monthOffset >= 0; monthOffset--) {
      const monthDate = new Date();
      monthDate.setMonth(monthDate.getMonth() - monthOffset);
      
      // 5-10 transactions per month
      const transactionCount = Math.floor(Math.random() * 6) + 5;
      
      for (let i = 0; i < transactionCount; i++) {
        const category = incomeCategories[Math.floor(Math.random() * incomeCategories.length)];
        const day = Math.floor(Math.random() * 28) + 1;
        
        incomeData.push({
          userId: demoUser._id,
          name: `${category.name} - ${monthDate.toLocaleDateString('en-US', { month: 'short' })} ${day}`,
          source: ['Client A', 'Client B', 'Client C', 'Platform X', 'Direct Sales'][Math.floor(Math.random() * 5)],
          category: category.name,
          amount: Math.floor(Math.random() * 50000) + 5000,
          date: new Date(monthDate.getFullYear(), monthDate.getMonth(), day),
          paymentMethod: ['Bank Transfer', 'PayPal', 'Stripe', 'Check'][Math.floor(Math.random() * 4)],
          employeeId: Math.random() > 0.5 ? employees[0]._id : undefined,
          status: 'completed',
        });
      }
    }
    
    const incomeTransactions = await Income.create(incomeData);
    console.log(`✅ ${incomeTransactions.length} income transactions created\n`);

    // Generate expense transactions
    console.log('💸 Creating expense transactions...');
    const expenseData = [];
    const expenseCategories = categories.filter(c => c.type === 'expense');
    
    // Generate 3 months of expense data
    for (let monthOffset = 2; monthOffset >= 0; monthOffset--) {
      const monthDate = new Date();
      monthDate.setMonth(monthDate.getMonth() - monthOffset);
      
      // 10-15 transactions per month
      const transactionCount = Math.floor(Math.random() * 6) + 10;
      
      for (let i = 0; i < transactionCount; i++) {
        const category = expenseCategories[Math.floor(Math.random() * expenseCategories.length)];
        const day = Math.floor(Math.random() * 28) + 1;
        const isReimbursable = Math.random() > 0.8;
        
        expenseData.push({
          userId: demoUser._id,
          name: `${category.name} expense - ${day}`,
          category: category.name,
          vendor: ['Vendor A', 'Vendor B', 'Supplier X', 'Service Y'][Math.floor(Math.random() * 4)],
          amount: Math.floor(Math.random() * 5000) + 100,
          date: new Date(monthDate.getFullYear(), monthDate.getMonth(), day),
          paymentMethod: ['Credit Card', 'Debit Card', 'Bank Transfer', 'Company Card'][Math.floor(Math.random() * 4)],
          employeeId: Math.random() > 0.5 ? employees[Math.floor(Math.random() * employees.length)]._id : undefined,
          status: isReimbursable ? 'reimbursement_pending' : 'completed',
          isReimbursable,
          reimbursementStatus: isReimbursable ? 'pending' : undefined,
          businessPurpose: category.name === 'Travel' ? 'Client meeting' : 'Business operations',
          taxDeductible: Math.random() > 0.3,
        });
      }
    }
    
    const expenseTransactions = await Expense.create(expenseData);
    console.log(`✅ ${expenseTransactions.length} expense transactions created\n`);

    // Create assets
    console.log('🏢 Creating assets...');
    const assets = await Asset.create([
      {
        userId: demoUser._id,
        name: 'MacBook Pro 16"',
        category: 'physical',
        subCategory: 'Computer Equipment',
        purchaseDate: new Date('2023-01-15'),
        purchasePrice: 3500,
        currentValue: 3200,
        depreciationRate: 20,
        usefulLife: 36,
        assignedTo: employees[1]._id,
        serialNumber: 'MBP2023-001',
        manufacturer: 'Apple',
        modelNumber: 'A2485',
        condition: 'excellent',
        status: 'active',
      },
      {
        userId: demoUser._id,
        name: 'Office Furniture Set',
        category: 'physical',
        subCategory: 'Furniture',
        purchaseDate: new Date('2022-06-01'),
        purchasePrice: 5000,
        currentValue: 4000,
        depreciationRate: 10,
        usefulLife: 60,
        location: 'Main Office',
        condition: 'good',
        status: 'active',
      },
      {
        userId: demoUser._id,
        name: 'Company Website',
        category: 'digital',
        subCategory: 'Software',
        purchaseDate: new Date('2021-01-01'),
        purchasePrice: 15000,
        currentValue: 15000,
        notes: 'Custom developed company website and CRM',
        status: 'active',
      },
    ]);
    console.log(`✅ ${assets.length} assets created\n`);

    // Create budgets
    console.log('📊 Creating budgets...');
    const currentMonth = new Date();
    const budgets = await Budget.create([
      {
        userId: demoUser._id,
        name: 'Q4 Marketing Budget',
        category: 'Marketing',
        period: 'quarterly',
        startDate: new Date(currentMonth.getFullYear(), 9, 1), // Q4 start
        endDate: new Date(currentMonth.getFullYear(), 11, 31), // Q4 end
        amount: 50000,
        spent: 12500,
        alertThreshold: 80,
        alertsEnabled: true,
      },
      {
        userId: demoUser._id,
        name: 'Monthly Software Budget',
        category: 'Software',
        period: 'monthly',
        startDate: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1),
        endDate: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0),
        amount: 5000,
        spent: 2300,
        alertThreshold: 90,
        alertsEnabled: true,
      },
    ]);
    console.log(`✅ ${budgets.length} budgets created\n`);

    // Create goals
    console.log('🎯 Creating goals...');
    const goals = await Goal.create([
      {
        userId: demoUser._id,
        name: 'Q4 Revenue Target',
        type: 'revenue',
        targetAmount: 250000,
        currentAmount: 125000,
        deadline: new Date(currentMonth.getFullYear(), 11, 31),
        priority: 'high',
        status: 'in_progress',
        description: 'Achieve $250K in revenue for Q4',
        autoTrack: true,
        trackingRules: {
          categories: ['Product Sales', 'Service Revenue', 'Subscription'],
        },
      },
      {
        userId: demoUser._id,
        name: 'Reduce Operating Expenses',
        type: 'expense',
        targetAmount: 30000,
        currentAmount: 35000,
        deadline: new Date(currentMonth.getFullYear() + 1, 2, 31),
        priority: 'medium',
        status: 'in_progress',
        description: 'Reduce monthly operating expenses to $30K',
        milestones: [
          {
            name: 'Cut software costs by 20%',
            targetAmount: 4000,
            targetDate: new Date(currentMonth.getFullYear() + 1, 0, 31),
            completed: false,
          },
        ],
      },
      {
        userId: demoUser._id,
        name: 'Emergency Fund',
        type: 'savings',
        targetAmount: 100000,
        currentAmount: 45000,
        deadline: new Date(currentMonth.getFullYear() + 1, 11, 31),
        priority: 'high',
        status: 'in_progress',
        description: 'Build emergency fund to $100K',
      },
    ]);
    console.log(`✅ ${goals.length} goals created\n`);

    // Summary
    console.log('═'.repeat(50));
    console.log('✅ DATABASE SEEDING COMPLETED');
    console.log('═'.repeat(50));
    console.log('\n📊 Summary:');
    console.log('  • Users:');
    console.log(`    - ${demoUser.email} (password: demo123456)`);
    console.log(`    - demo@gmail.com (password: 12345678)`);
    console.log(`  • Categories: ${categories.length}`);
    console.log(`  • Employees: ${employees.length}`);
    console.log(`  • Income Transactions: ${incomeTransactions.length}`);
    console.log(`  • Expense Transactions: ${expenseTransactions.length}`);
    console.log(`  • Assets: ${assets.length}`);
    console.log(`  • Budgets: ${budgets.length}`);
    console.log(`  • Goals: ${goals.length}`);
    console.log('\n🚀 You can now log in with the demo accounts!\n');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await disconnectDB();
    process.exit(0);
  }
}

// Run seeding if this is the main module
if (require.main === module) {
  seedDatabase();
}

export default seedDatabase;