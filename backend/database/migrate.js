const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const dbPath = path.join(__dirname, '../../db/invigleye.db');
const backupPath = path.join(__dirname, '../../db/invigleye_backup.db');

console.log('🔄 Starting database migration...\n');

// Step 1: Backup existing database if it exists
if (fs.existsSync(dbPath)) {
  console.log('📦 Creating backup of existing database...');
  fs.copyFileSync(dbPath, backupPath);
  console.log(`✅ Backup created at: ${backupPath}\n`);
}

// Step 2: Check if we need to add new columns
try {
  const db = new Database(dbPath);
  
  // Get current table schema
  const tableInfo = db.prepare("PRAGMA table_info(exams)").all();
  const existingColumns = tableInfo.map(col => col.name);
  
  console.log('📊 Current exams table columns:', existingColumns.join(', '));
  
  // Check which columns need to be added
  const requiredColumns = {
    'department': 'TEXT',
    'end_time': 'TEXT',
    'section': 'TEXT',
    'invigilator_email': 'TEXT'
  };
  
  let needsMigration = false;
  const missingColumns = [];
  
  for (const [column, type] of Object.entries(requiredColumns)) {
    if (!existingColumns.includes(column)) {
      needsMigration = true;
      missingColumns.push(column);
    }
  }
  
  // Handle column rename from invigilator_name to invigilator_email
  if (existingColumns.includes('invigilator_name') && !existingColumns.includes('invigilator_email')) {
    console.log('\n🔄 Renaming column invigilator_name to invigilator_email...');
    try {
      db.exec(`ALTER TABLE exams ADD COLUMN invigilator_email TEXT`);
      db.exec(`UPDATE exams SET invigilator_email = invigilator_name WHERE invigilator_name IS NOT NULL`);
      console.log('✅ Column renamed and data migrated successfully');
      needsMigration = true;
    } catch (error) {
      console.error('❌ Error renaming column:', error.message);
    }
  }
  
  if (needsMigration) {
    console.log('\n⚠️  Missing columns detected:', missingColumns.join(', '));
    console.log('🔧 Adding missing columns...\n');
    
    // Add missing columns
    for (const [column, type] of Object.entries(requiredColumns)) {
      if (!existingColumns.includes(column)) {
        try {
          db.exec(`ALTER TABLE exams ADD COLUMN ${column} ${type}`);
          console.log(`✅ Added column: ${column}`);
        } catch (error) {
          console.error(`❌ Error adding column ${column}:`, error.message);
        }
      }
    }
    
    console.log('\n✅ Migration completed successfully!');
  } else {
    console.log('\n✅ Database schema is up to date. No migration needed.');
  }
  
  db.close();
  
} catch (error) {
  console.error('\n❌ Migration error:', error.message);
  console.log('\n💡 If the exams table doesn\'t exist, it will be created when you start the server.');
}

console.log('\n🎉 Migration process finished!');
console.log('\n📝 Note: If you encounter any issues, restore the backup from:');
console.log(`   ${backupPath}\n`);

