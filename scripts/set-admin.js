// Script to set a user as admin
// Run this with: node scripts/set-admin.js

const mongoose = require('mongoose');
require('dotenv').config();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';

async function setAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Update user role to admin
    const result = await mongoose.connection.db.collection('users').updateOne(
      { email: ADMIN_EMAIL },
      { $set: { role: 'admin' } }
    );

    if (result.matchedCount === 0) {
      console.log(`❌ No user found with email: ${ADMIN_EMAIL}`);
      console.log('Please register a user first, then run this script again.');
    } else if (result.modifiedCount > 0) {
      console.log(`✅ Successfully set ${ADMIN_EMAIL} as admin`);
    } else {
      console.log(`ℹ️  User ${ADMIN_EMAIL} is already an admin`);
    }

    await mongoose.connection.close();
    console.log('✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

setAdmin();
