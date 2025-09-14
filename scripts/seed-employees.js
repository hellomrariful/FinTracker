const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// Simple employee schema (matching the actual model)
const employeeSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  name: String,
  email: String,
  role: String,
  department: String,
  status: String,
  hireDate: Date,
}, { timestamps: true });

const Employee = mongoose.models.Employee || mongoose.model('Employee', employeeSchema);

async function seedEmployees() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get the demo user ID (you'll need to update this with actual user ID)
    // For now, we'll create employees for the demo user
    const demoUserId = new mongoose.Types.ObjectId('6750e8b8e0b8c5a4d4e5f6a7'); // Example ID
    
    // Check if employees already exist
    const existingEmployees = await Employee.find({ userId: demoUserId });
    if (existingEmployees.length > 0) {
      console.log('Employees already exist for this user');
      return;
    }

    // Create default employees
    const defaultEmployees = [
      {
        userId: demoUserId,
        name: 'John Doe',
        email: 'john.doe@company.com',
        role: 'Software Engineer',
        department: 'Engineering',
        status: 'active',
        hireDate: new Date('2023-01-15'),
      },
      {
        userId: demoUserId,
        name: 'Jane Smith',
        email: 'jane.smith@company.com',
        role: 'Product Manager',
        department: 'Product',
        status: 'active',
        hireDate: new Date('2022-06-01'),
      },
      {
        userId: demoUserId,
        name: 'Mike Johnson',
        email: 'mike.johnson@company.com',
        role: 'Sales Representative',
        department: 'Sales',
        status: 'active',
        hireDate: new Date('2023-03-20'),
      },
    ];

    const result = await Employee.insertMany(defaultEmployees);
    console.log(`Created ${result.length} employees successfully`);

  } catch (error) {
    console.error('Error seeding employees:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seed function
seedEmployees();