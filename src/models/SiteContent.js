const mongoose = require('mongoose');

const trustBadgeSchema = new mongoose.Schema(
  {
    icon: { type: String, required: true },
    label: { type: String, required: true },
  },
  { _id: false }
);

const heroSchema = new mongoose.Schema(
  {
    badge: { type: String, required: true },
    titleLine1: { type: String, required: true },
    titleLine2: { type: String, required: true },
    subtitle: { type: String, required: true },
    ctaText: { type: String, required: true },
    imageUrl: { type: String, required: true },
    trustBadges: {
      type: [trustBadgeSchema],
      validate: {
        validator: (v) => v.length === 3,
        message: 'trustBadges must contain exactly 3 items',
      },
    },
  },
  { _id: false }
);

const leadFormSectionSchema = new mongoose.Schema(
  {
    badge: { type: String, required: true },
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    consentText: { type: String, required: true },
  },
  { _id: false }
);

const formLabelsSchema = new mongoose.Schema(
  {
    fullName: String,
    phone: String,
    ageGroup: String,
    residency: String,
    monthlySalary: String,
    monthlyObligations: String,
    realEstateLoan: String,
    workSector: String,
    serviceDuration: String,
    nextButton: String,
    backButton: String,
    submitButton: String,
    ageQualified: String,
    ageNotQualified: String,
    citizen: String,
    resident: String,
    loanYes: String,
    loanNo: String,
    sectorGovernment: String,
    sectorPrivateCompany: String,
    sectorPrivateEstablishment: String,
    sectorRetired: String,
    durationLess: String,
    durationMore: String,
  },
  { _id: false }
);

const featureItemSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    heading: { type: String, required: true },
    paragraph: { type: String, required: true },
    imageUrl: { type: String, required: true },
  },
  { _id: false }
);

const shopPromoSchema = new mongoose.Schema(
  {
    imageUrl: { type: String, required: true },
    imageAlt: { type: String, required: true },
    heading: { type: String, required: true },
    subtextBefore: { type: String, required: true },
    subtextHighlight: { type: String, required: true },
    subtextAfter: { type: String, required: true },
    storeUrl: { type: String, required: true },
    ctaText: { type: String, required: true },
  },
  { _id: false }
);

const featuresSchema = new mongoose.Schema(
  {
    badge: { type: String, required: true },
    title: { type: String, required: true },
    titleHighlight: { type: String, required: true },
    subtitle: { type: String, required: true },
    items: {
      type: [featureItemSchema],
      validate: {
        validator: (v) => v.length === 4,
        message: 'features.items must contain exactly 4 items',
      },
    },
    shopPromo: { type: shopPromoSchema, required: true },
  },
  { _id: false }
);

const testimonialSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    text: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    monthsAgo: { type: Number, min: 0, required: true },
    order: { type: Number, min: 0, required: true },
    avatarUrl: { type: String, required: false, default: '' },
  },
  { _id: false }
);

const faqSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    q: { type: String, required: true },
    a: { type: String, required: true },
    order: { type: Number, min: 0, required: true },
  },
  { _id: false }
);

const footerSchema = new mongoose.Schema(
  {
    whatsapp: { type: String, required: true },
    email: { type: String, required: true },
    tiktok: { type: String, required: true },
    snapchat: { type: String, required: true },
    crNumber: { type: String, required: true },
    taxNumber: { type: String, required: true },
    businessCenterNumber: { type: String, required: true },
    mapsEmbedUrl: { type: String, required: true },
    mapsExternalUrl: { type: String, required: true },
    copyrightText: { type: String, required: true },
  },
  { _id: false }
);

const seoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    ogTitle: { type: String, required: true },
    ogDescription: { type: String, required: true },
  },
  { _id: false }
);

const successPageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    whatsapp: { type: String, required: true },
    whatsappMessage: { type: String, required: true },
  },
  { _id: false }
);

const siteContentSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: 'site',
    },
    hero: { type: heroSchema, required: true },
    leadFormSection: { type: leadFormSectionSchema, required: true },
    formLabels: { type: formLabelsSchema, required: true },
    features: { type: featuresSchema, required: true },
    testimonials: {
      type: [testimonialSchema],
      validate: {
        validator: (v) => v.length <= 20,
        message: 'testimonials cannot exceed 20 items',
      },
    },
    faqs: {
      type: [faqSchema],
      validate: {
        validator: (v) => v.length <= 30,
        message: 'faqs cannot exceed 30 items',
      },
    },
    footer: { type: footerSchema, required: true },
    logoUrl: { type: String, required: true },
    seo: { type: seoSchema, required: true },
    successPage: { type: successPageSchema, required: true },
  },
  {
    timestamps: { createdAt: false, updatedAt: true },
    collection: 'sitecontents',
  }
);

module.exports = mongoose.model('SiteContent', siteContentSchema);
