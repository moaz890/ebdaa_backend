const SiteContent = require('../models/SiteContent');
const { DEFAULT_SITE_CONTENT } = require('../data/contentDefaults');

const SITE_CONTENT_ID = 'site';

/**
 * Idempotent seed — upserts the singleton site content document.
 * Safe to run multiple times; resets content to DEFAULT_SITE_CONTENT.
 * @returns {Promise<import('mongoose').Document>}
 */
async function seedContent() {
  const { _id, ...content } = DEFAULT_SITE_CONTENT;

  const doc = await SiteContent.findOneAndUpdate(
    { _id: SITE_CONTENT_ID },
    { $set: content },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
  );

  return doc;
}

module.exports = { seedContent, SITE_CONTENT_ID };
