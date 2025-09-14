import 'dotenv/config';

async function seedEmployees() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  // You'll need to replace this with a valid auth token
  // You can get this from your browser's dev tools after logging in
  const authToken = process.env.AUTH_TOKEN || '';
  
  if (!authToken) {
    console.error('Please set AUTH_TOKEN environment variable');
    console.log('To get your auth token:');
    console.log('1. Login to the app in your browser');
    console.log('2. Open browser dev tools (F12)');
    console.log('3. Go to Application/Storage -> Cookies');
    console.log('4. Find the auth token cookie value');
    console.log('5. Run: AUTH_TOKEN="your-token-here" pnpm tsx scripts/seed-employees.ts');
    process.exit(1);
  }

  try {
    const response = await fetch(`${baseUrl}/api/employees/seed`, {
      method: 'POST',
      headers: {
        'Cookie': `authToken=${authToken}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    if (response.ok && data.success) {
      console.log('✅ Success:', data.message);
      if (data.data) {
        console.log('Created employees:');
        data.data.forEach((emp: any) => {
          console.log(`  - ${emp.name} (${emp.role})`);
        });
      }
    } else {
      console.log('ℹ️', data.message || 'Employees may already exist');
    }
  } catch (error) {
    console.error('❌ Error seeding employees:', error);
  }
}

seedEmployees();