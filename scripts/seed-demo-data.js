const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;
const DEMO_EMAIL = 'info.fintracker@gmail.com';
const DEMO_PASSWORD = 'demo1234';

// Realistic performance marketing business data
const demoData = {
    // Income sources for a digital marketing agency
    incomeCategories: [
        { name: 'Facebook Ads Management', type: 'income', icon: '📱', color: '#1877F2' },
        { name: 'Google Ads Management', type: 'income', icon: '🔍', color: '#4285F4' },
        { name: 'SEO Services', type: 'income', icon: '📈', color: '#34A853' },
        { name: 'Content Marketing', type: 'income', icon: '✍️', color: '#FF6B35' },
        { name: 'Email Marketing', type: 'income', icon: '📧', color: '#EA4335' },
        { name: 'Consulting', type: 'income', icon: '💼', color: '#9333EA' },
        { name: 'Course Sales', type: 'income', icon: '🎓', color: '#F59E0B' },
        { name: 'Affiliate Commissions', type: 'income', icon: '🤝', color: '#10B981' },
    ],

    // Expense categories for digital business
    expenseCategories: [
        { name: 'Ad Spend - Facebook', type: 'expense', icon: '💰', color: '#1877F2' },
        { name: 'Ad Spend - Google', type: 'expense', icon: '💸', color: '#4285F4' },
        { name: 'Software & Tools', type: 'expense', icon: '🛠️', color: '#6366F1' },
        { name: 'Team Salaries', type: 'expense', icon: '👥', color: '#EF4444' },
        { name: 'Freelancers', type: 'expense', icon: '🎯', color: '#F59E0B' },
        { name: 'Office & Equipment', type: 'expense', icon: '🏢', color: '#8B5CF6' },
        { name: 'Education & Training', type: 'expense', icon: '📚', color: '#10B981' },
        { name: 'Business Travel', type: 'expense', icon: '✈️', color: '#06B6D4' },
    ],

    // Team members for a digital agency
    employees: [
        {
            name: 'Sarah Chen',
            email: 'sarah@agency.com',
            role: 'Performance Marketing Manager',
            department: 'Marketing',
            salary: 75000,
            avatar: null
        },
        {
            name: 'Marcus Rodriguez',
            email: 'marcus@agency.com',
            role: 'Facebook Ads Specialist',
            department: 'Marketing',
            salary: 65000,
            avatar: null
        },
        {
            name: 'Emily Watson',
            email: 'emily@agency.com',
            role: 'Google Ads Manager',
            department: 'Marketing',
            salary: 70000,
            avatar: null
        },
        {
            name: 'David Kim',
            email: 'david@agency.com',
            role: 'Content Marketing Lead',
            department: 'Content',
            salary: 68000,
            avatar: null
        },
        {
            name: 'Lisa Thompson',
            email: 'lisa@agency.com',
            role: 'SEO Specialist',
            department: 'Marketing',
            salary: 62000,
            avatar: null
        }
    ],

    // Realistic income data for last 6 months
    incomeData: [
        // January 2024
        { source: 'TechStart Inc', category: 'Facebook Ads Management', amount: 8500, date: '2024-01-15', description: 'Monthly Facebook ads management retainer' },
        { source: 'EcomBrand LLC', category: 'Google Ads Management', amount: 12000, date: '2024-01-20', description: 'Google Ads management + performance bonus' },
        { source: 'HealthTech Co', category: 'SEO Services', amount: 6500, date: '2024-01-25', description: 'SEO audit and optimization' },
        { source: 'Course Platform', category: 'Course Sales', amount: 3200, date: '2024-01-30', description: 'Digital marketing course sales' },

        // February 2024
        { source: 'TechStart Inc', category: 'Facebook Ads Management', amount: 8500, date: '2024-02-15', description: 'Monthly Facebook ads management retainer' },
        { source: 'EcomBrand LLC', category: 'Google Ads Management', amount: 15000, date: '2024-02-20', description: 'Google Ads management + Q1 bonus' },
        { source: 'FitnessBrand', category: 'Content Marketing', amount: 4500, date: '2024-02-22', description: 'Content strategy and creation' },
        { source: 'Affiliate Network', category: 'Affiliate Commissions', amount: 2800, date: '2024-02-28', description: 'Q1 affiliate commissions' },

        // March 2024
        { source: 'TechStart Inc', category: 'Facebook Ads Management', amount: 9500, date: '2024-03-15', description: 'Facebook ads management + scale bonus' },
        { source: 'EcomBrand LLC', category: 'Google Ads Management', amount: 13500, date: '2024-03-20', description: 'Google Ads management retainer' },
        { source: 'StartupXYZ', category: 'Consulting', amount: 7500, date: '2024-03-25', description: 'Marketing strategy consulting' },
        { source: 'HealthTech Co', category: 'Email Marketing', amount: 3500, date: '2024-03-28', description: 'Email campaign setup and management' },

        // April 2024
        { source: 'TechStart Inc', category: 'Facebook Ads Management', amount: 11000, date: '2024-04-15', description: 'Facebook ads management + performance bonus' },
        { source: 'EcomBrand LLC', category: 'Google Ads Management', amount: 16000, date: '2024-04-20', description: 'Google Ads management + scale bonus' },
        { source: 'FashionBrand', category: 'Facebook Ads Management', amount: 9000, date: '2024-04-22', description: 'New client onboarding + first month' },
        { source: 'Course Platform', category: 'Course Sales', amount: 4100, date: '2024-04-30', description: 'Advanced marketing course sales' },

        // May 2024
        { source: 'TechStart Inc', category: 'Facebook Ads Management', amount: 10500, date: '2024-05-15', description: 'Monthly Facebook ads management' },
        { source: 'EcomBrand LLC', category: 'Google Ads Management', amount: 14500, date: '2024-05-20', description: 'Google Ads management retainer' },
        { source: 'FashionBrand', category: 'Facebook Ads Management', amount: 9500, date: '2024-05-22', description: 'Facebook ads management + optimization' },
        { source: 'B2B SaaS Co', category: 'Google Ads Management', amount: 8500, date: '2024-05-25', description: 'New B2B client - Google Ads setup' },
        { source: 'Consulting Client', category: 'Consulting', amount: 5500, date: '2024-05-28', description: 'Marketing audit and strategy' },

        // June 2024
        { source: 'TechStart Inc', category: 'Facebook Ads Management', amount: 12500, date: '2024-06-15', description: 'Facebook ads + Instagram campaigns' },
        { source: 'EcomBrand LLC', category: 'Google Ads Management', amount: 18000, date: '2024-06-20', description: 'Google Ads + Shopping campaigns' },
        { source: 'FashionBrand', category: 'Facebook Ads Management', amount: 10000, date: '2024-06-22', description: 'Facebook ads management retainer' },
        { source: 'B2B SaaS Co', category: 'Google Ads Management', amount: 9500, date: '2024-06-25', description: 'Google Ads management + LinkedIn' },
        { source: 'Affiliate Network', category: 'Affiliate Commissions', amount: 3500, date: '2024-06-28', description: 'Q2 affiliate commissions' },
        { source: 'Course Platform', category: 'Course Sales', amount: 5200, date: '2024-06-30', description: 'Masterclass sales + bonuses' },
    ],

    // Realistic expense data
    expenseData: [
        // January 2024
        { vendor: 'Facebook Business', category: 'Ad Spend - Facebook', amount: 25000, date: '2024-01-31', description: 'Client ad spend - January' },
        { vendor: 'Google Ads', category: 'Ad Spend - Google', amount: 35000, date: '2024-01-31', description: 'Client ad spend - January' },
        { vendor: 'Slack', category: 'Software & Tools', amount: 150, date: '2024-01-05', description: 'Team communication - monthly' },
        { vendor: 'Asana', category: 'Software & Tools', amount: 99, date: '2024-01-05', description: 'Project management - monthly' },
        { vendor: 'Canva Pro', category: 'Software & Tools', amount: 119, date: '2024-01-05', description: 'Design tools - monthly' },
        { vendor: 'Payroll', category: 'Team Salaries', amount: 27500, date: '2024-01-31', description: 'January team salaries' },

        // February 2024
        { vendor: 'Facebook Business', category: 'Ad Spend - Facebook', amount: 28000, date: '2024-02-29', description: 'Client ad spend - February' },
        { vendor: 'Google Ads', category: 'Ad Spend - Google', amount: 42000, date: '2024-02-29', description: 'Client ad spend - February' },
        { vendor: 'Freelancer - Designer', category: 'Freelancers', amount: 2500, date: '2024-02-15', description: 'Creative assets for campaigns' },
        { vendor: 'Payroll', category: 'Team Salaries', amount: 27500, date: '2024-02-29', description: 'February team salaries' },
        { vendor: 'Office Supplies', category: 'Office & Equipment', amount: 450, date: '2024-02-10', description: 'Office supplies and equipment' },

        // March 2024
        { vendor: 'Facebook Business', category: 'Ad Spend - Facebook', amount: 32000, date: '2024-03-31', description: 'Client ad spend - March' },
        { vendor: 'Google Ads', category: 'Ad Spend - Google', amount: 45000, date: '2024-03-31', description: 'Client ad spend - March' },
        { vendor: 'Freelancer - Copywriter', category: 'Freelancers', amount: 1800, date: '2024-03-20', description: 'Ad copy and landing pages' },
        { vendor: 'Payroll', category: 'Team Salaries', amount: 27500, date: '2024-03-31', description: 'March team salaries' },
        { vendor: 'Marketing Conference', category: 'Education & Training', amount: 1200, date: '2024-03-25', description: 'Team training and networking' },

        // April 2024
        { vendor: 'Facebook Business', category: 'Ad Spend - Facebook', amount: 38000, date: '2024-04-30', description: 'Client ad spend - April' },
        { vendor: 'Google Ads', category: 'Ad Spend - Google', amount: 52000, date: '2024-04-30', description: 'Client ad spend - April' },
        { vendor: 'Payroll', category: 'Team Salaries', amount: 27500, date: '2024-04-30', description: 'April team salaries' },
        { vendor: 'New Laptop', category: 'Office & Equipment', amount: 2500, date: '2024-04-15', description: 'MacBook Pro for new team member' },
        { vendor: 'Freelancer - Video Editor', category: 'Freelancers', amount: 3200, date: '2024-04-25', description: 'Video ads production' },

        // May 2024
        { vendor: 'Facebook Business', category: 'Ad Spend - Facebook', amount: 35000, date: '2024-05-31', description: 'Client ad spend - May' },
        { vendor: 'Google Ads', category: 'Ad Spend - Google', amount: 48000, date: '2024-05-31', description: 'Client ad spend - May' },
        { vendor: 'Payroll', category: 'Team Salaries', amount: 27500, date: '2024-05-31', description: 'May team salaries' },
        { vendor: 'Business Travel', category: 'Business Travel', amount: 1800, date: '2024-05-20', description: 'Client meeting and conference' },
        { vendor: 'SEMrush', category: 'Software & Tools', amount: 199, date: '2024-05-05', description: 'SEO and competitor analysis' },

        // June 2024
        { vendor: 'Facebook Business', category: 'Ad Spend - Facebook', amount: 42000, date: '2024-06-30', description: 'Client ad spend - June' },
        { vendor: 'Google Ads', category: 'Ad Spend - Google', amount: 55000, date: '2024-06-30', description: 'Client ad spend - June' },
        { vendor: 'Payroll', category: 'Team Salaries', amount: 27500, date: '2024-06-30', description: 'June team salaries' },
        { vendor: 'Freelancer - Designer', category: 'Freelancers', amount: 2800, date: '2024-06-15', description: 'Summer campaign creatives' },
        { vendor: 'Office Rent', category: 'Office & Equipment', amount: 3500, date: '2024-06-01', description: 'Monthly office rent' },
    ],

    // Business goals for a digital agency
    goals: [
        {
            title: 'Reach $100K Monthly Revenue',
            description: 'Scale our agency to consistently generate $100K+ in monthly recurring revenue',
            targetAmount: 100000,
            currentAmount: 67500,
            targetDate: new Date('2024-12-31'),
            category: 'Revenue',
            priority: 'high',
            status: 'active'
        },
        {
            title: 'Reduce Client Acquisition Cost',
            description: 'Lower our CAC from $2000 to $1200 through referrals and content marketing',
            targetAmount: 1200,
            currentAmount: 1800,
            targetDate: new Date('2024-09-30'),
            category: 'Marketing',
            priority: 'medium',
            status: 'active'
        },
        {
            title: 'Build Emergency Fund',
            description: 'Save 6 months of operating expenses as emergency fund',
            targetAmount: 180000,
            currentAmount: 45000,
            targetDate: new Date('2025-06-30'),
            category: 'Savings',
            priority: 'high',
            status: 'active'
        }
    ],

    // Budget allocations
    budgets: [
        {
            name: 'Client Ad Spend',
            category: 'Ad Spend - Facebook',
            amount: 40000,
            period: 'monthly',
            startDate: new Date('2024-01-01'),
            endDate: new Date('2024-12-31'),
            isActive: true
        },
        {
            name: 'Google Ads Budget',
            category: 'Ad Spend - Google',
            amount: 50000,
            period: 'monthly',
            startDate: new Date('2024-01-01'),
            endDate: new Date('2024-12-31'),
            isActive: true
        },
        {
            name: 'Team & Operations',
            category: 'Team Salaries',
            amount: 30000,
            period: 'monthly',
            startDate: new Date('2024-01-01'),
            endDate: new Date('2024-12-31'),
            isActive: true
        },
        {
            name: 'Tools & Software',
            category: 'Software & Tools',
            amount: 2000,
            period: 'monthly',
            startDate: new Date('2024-01-01'),
            endDate: new Date('2024-12-31'),
            isActive: true
        }
    ]
};

async function seedDemoData() {
    const client = new MongoClient(MONGODB_URI);

    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db();

        // Create demo user
        const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, 12);
        const demoUser = {
            email: DEMO_EMAIL,
            password: hashedPassword,
            name: 'Demo User',
            role: 'owner',
            isVerified: true,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        // Insert or update demo user
        const userResult = await db.collection('users').findOneAndUpdate(
            { email: DEMO_EMAIL },
            { $set: demoUser },
            { upsert: true, returnDocument: 'after' }
        );

        const userId = userResult._id;
        console.log('Demo user created/updated:', userId);

        // Clear existing demo data
        await Promise.all([
            db.collection('categories').deleteMany({ userId }),
            db.collection('employees').deleteMany({ userId }),
            db.collection('incomes').deleteMany({ userId }),
            db.collection('expenses').deleteMany({ userId }),
            db.collection('goals').deleteMany({ userId }),
            db.collection('budgets').deleteMany({ userId })
        ]);

        // Insert categories
        const allCategories = [...demoData.incomeCategories, ...demoData.expenseCategories];
        const categoriesWithUserId = allCategories.map(cat => ({
            ...cat,
            userId,
            createdAt: new Date(),
            updatedAt: new Date()
        }));

        const categoryResult = await db.collection('categories').insertMany(categoriesWithUserId);
        console.log(`Inserted ${categoryResult.insertedCount} categories`);

        // Insert employees
        const employeesWithUserId = demoData.employees.map(emp => ({
            ...emp,
            userId,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        }));

        const employeeResult = await db.collection('employees').insertMany(employeesWithUserId);
        const employeeIds = Object.values(employeeResult.insertedIds);
        console.log(`Inserted ${employeeResult.insertedCount} employees`);

        // Insert income data
        const incomeWithUserId = demoData.incomeData.map((income, index) => ({
            ...income,
            userId,
            employeeId: employeeIds[index % employeeIds.length], // Rotate through employees
            status: 'completed',
            createdAt: new Date(income.date),
            updatedAt: new Date()
        }));

        const incomeResult = await db.collection('incomes').insertMany(incomeWithUserId);
        console.log(`Inserted ${incomeResult.insertedCount} income records`);

        // Insert expense data
        const expensesWithUserId = demoData.expenseData.map((expense, index) => ({
            ...expense,
            userId,
            employeeId: employeeIds[index % employeeIds.length], // Rotate through employees
            status: 'approved',
            createdAt: new Date(expense.date),
            updatedAt: new Date()
        }));

        const expenseResult = await db.collection('expenses').insertMany(expensesWithUserId);
        console.log(`Inserted ${expenseResult.insertedCount} expense records`);

        // Insert goals
        const goalsWithUserId = demoData.goals.map(goal => ({
            ...goal,
            userId,
            createdAt: new Date(),
            updatedAt: new Date()
        }));

        const goalResult = await db.collection('goals').insertMany(goalsWithUserId);
        console.log(`Inserted ${goalResult.insertedCount} goals`);

        // Insert budgets
        const budgetsWithUserId = demoData.budgets.map(budget => ({
            ...budget,
            userId,
            createdAt: new Date(),
            updatedAt: new Date()
        }));

        const budgetResult = await db.collection('budgets').insertMany(budgetsWithUserId);
        console.log(`Inserted ${budgetResult.insertedCount} budgets`);

        console.log('✅ Demo data seeded successfully!');
        console.log(`Demo account: ${DEMO_EMAIL} / ${DEMO_PASSWORD}`);

    } catch (error) {
        console.error('Error seeding demo data:', error);
    } finally {
        await client.close();
    }
}

// Run the seeding
if (require.main === module) {
    seedDemoData();
}

module.exports = { seedDemoData };