// Migration script to update Project members from string array to object array
// Run this with: node scripts/migrate-project-members.js

const mongoose = require('mongoose');
require('dotenv').config();

async function migrateProjectMembers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const projectsCollection = db.collection('projects');

    // Find all projects with old member format (string array)
    const projects = await projectsCollection.find({}).toArray();
    
    let migratedCount = 0;
    let skippedCount = 0;

    for (const project of projects) {
      // Check if members need migration
      if (project.members && project.members.length > 0) {
        const firstMember = project.members[0];
        
        // If it's a string, migrate to new format
        if (typeof firstMember === 'string') {
          const newMembers = project.members.map(memberId => ({
            userId: memberId,
            role: 'member',
            joinedAt: project.createdAt || new Date()
          }));

          await projectsCollection.updateOne(
            { _id: project._id },
            { $set: { members: newMembers } }
          );

          console.log(`✅ Migrated project: ${project.name} (${project.members.length} members)`);
          migratedCount++;
        } else {
          console.log(`⏭️  Skipped project: ${project.name} (already migrated)`);
          skippedCount++;
        }
      } else {
        console.log(`⏭️  Skipped project: ${project.name} (no members)`);
        skippedCount++;
      }
    }

    console.log('\n📊 Migration Summary:');
    console.log(`   Total projects: ${projects.length}`);
    console.log(`   Migrated: ${migratedCount}`);
    console.log(`   Skipped: ${skippedCount}`);
    console.log('\n✅ Migration completed successfully!');

    await mongoose.connection.close();
    console.log('✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  }
}

migrateProjectMembers();
