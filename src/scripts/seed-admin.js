/**
 * seed-admin.js
 * Run once to create the first admin account.
 * Usage: pnpm seed
 *        or: node src/scripts/seed-admin.js
 *
 * Credentials are read from .env:
 *   ADMIN_USERNAME=admin
 *   ADMIN_PASSWORD=changeme123
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

async function seed() {
  const uri = process.env.MONGO_URI;
  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'changeme123';

  if (!uri || uri.includes('<username>')) {
    console.error('❌ MONGO_URI is not set in .env — update it before seeding.');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB');

    const existing = await Admin.findOne({ username });
    if (existing) {
      console.log(`ℹ️  Admin "${username}" already exists — nothing to do.`);
      process.exit(0);
    }

    const admin = new Admin({ username });
    await admin.setPassword(password);
    await admin.save();

    console.log(`✅ Admin created successfully!`);
    console.log(`   Username : ${username}`);
    console.log(`   Password : ${password}`);
    console.log(`\n⚠️  Change the password in .env before deploying to production!`);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
