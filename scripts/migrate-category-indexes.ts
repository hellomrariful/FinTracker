#!/usr/bin/env node
import { connectDB, disconnectDB } from '@/lib/db/mongoose';
import Category from '@/lib/models/Category';

/**
 * Migrate category indexes from userId+name to userId+name+type
 * Run with: npx tsx scripts/migrate-category-indexes.ts
 */
async function migrateCategoryIndexes() {
  console.log('\n📇 Category Index Migration\n');
  console.log('━'.repeat(50));
  
  try {
    // Connect to database
    await connectDB();
    console.log('✅ Connected to MongoDB\n');

    // Get existing indexes
    const existingIndexes = await Category.collection.listIndexes().toArray();
    console.log('📋 Existing indexes:');
    existingIndexes.forEach(index => {
      console.log(`  - ${index.name}: ${JSON.stringify(index.key)}`);
    });

    // Drop the old unique index on userId+name if it exists
    const oldIndex = existingIndexes.find(
      idx => idx.key?.userId === 1 && idx.key?.name === 1 && idx.unique === true
    );
    
    if (oldIndex) {
      console.log(`\n🗑️  Dropping old index: ${oldIndex.name}`);
      await Category.collection.dropIndex(oldIndex.name);
      console.log('✅ Old index dropped successfully');
    } else {
      console.log('\n⚠️  Old index not found, skipping drop');
    }

    // Create new unique index with collation for case-insensitive comparison
    console.log('\n🔨 Creating new index: userId_1_name_1_type_1');
    await Category.collection.createIndex(
      { userId: 1, name: 1, type: 1 },
      { 
        unique: true, 
        collation: { locale: 'en', strength: 2 },
        name: 'userId_1_name_1_type_1_unique'
      }
    );
    console.log('✅ New index created successfully');

    // Verify the new indexes
    const newIndexes = await Category.collection.listIndexes().toArray();
    console.log('\n📋 Updated indexes:');
    newIndexes.forEach(index => {
      console.log(`  - ${index.name}: ${JSON.stringify(index.key)}`);
    });

    console.log('\n✅ Category index migration completed successfully!\n');

  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await disconnectDB();
    process.exit(0);
  }
}

// Run if this is the main module
if (require.main === module) {
  migrateCategoryIndexes();
}

export default migrateCategoryIndexes;