/**
 * seed-content.js
 * Populates the singleton SiteContent document from contentDefaults.
 * Usage: npm run seed:content
 *        or: node src/scripts/seed-content.js
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const { seedContent } = require('../lib/seedContent');

async function run() {
  const uri = process.env.MONGO_URI;

  if (!uri || uri.includes('<username>')) {
    console.error('❌ MONGO_URI is not set in .env — update it before seeding.');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB');

    const doc = await seedContent();

    console.log('✅ Site content seeded successfully!');
    console.log(`   Document ID : ${doc._id}`);
    console.log(`   Hero title  : ${doc.hero.titleLine1}`);
    console.log(`   Testimonials: ${doc.testimonials.length}`);
    console.log(`   FAQs        : ${doc.faqs.length}`);
    console.log(`   Updated at  : ${doc.updatedAt?.toISOString() ?? 'n/a'}`);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

run();
