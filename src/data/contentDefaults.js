/**
 * Default site content — mirrors current hardcoded landing page values.
 * Used for DB seeding and API fallback when CMS document is missing.
 * Keep in sync with frontend/src/lib/contentDefaults.ts
 */
const DEFAULT_SITE_CONTENT = {
  _id: 'site',
  hero: {
    badge: 'الابداع للإتصالات',
    titleLine1: 'الابداع للاتصالات',
    titleLine2: 'لبيع الهواتف الذكية ومستلزماتها',
    subtitle:
      'شركة سعودية متميزة في مجال الاتصالات مقرها الرياض — جميع طرق الدفع متوفرة ونقدم خدمة التقسيط إلى 60 شهر',
    ctaText: 'تحقق من اهليتك',
    imageUrl: '/assests/hero.webp',
    trustBadges: [
      { icon: '🇸🇦', label: 'متاح للمواطنين والمقيمين' },
      { icon: '⚡', label: 'تواصل سريع خلال 24 ساعة' },
      { icon: '✅', label: 'التسجيل مجاني تماماً' },
    ],
  },
  leadFormSection: {
    badge: 'سجّل اهتمامك',
    title: 'أدخل بياناتك وسنتواصل معك',
    subtitle: 'سجّل معلوماتك الآن وسيتواصل معك أحد ممثلي الابداع خلال 24 ساعة',
    consentText: 'بإرسال هذا النموذج، أنت توافق على التواصل معك من قِبل فريق الابداع للإتصالات',
  },
  formLabels: {
    fullName: 'الاسم الثلاثي',
    phone: 'رقم الجوال',
    ageGroup: 'الفئة العمرية',
    residency: 'الحالة',
    monthlySalary: 'الراتب الشهري',
    monthlyObligations: 'الالتزامات الشهرية',
    realEstateLoan: 'قرض عقاري',
    workSector: 'تحديد نوع قطاع العمل؟',
    serviceDuration: 'مدة الخدمة',
    nextButton: 'التالي',
    backButton: 'السابق',
    submitButton: 'تحقق من اهليتك',
    ageQualified: '20 سنة أو أكثر',
    ageNotQualified: 'أقل من 20 سنة',
    citizen: 'مواطن 🇸🇦',
    resident: 'مقيم 🏠',
    loanYes: 'نعم',
    loanNo: 'لا',
    sectorGovernment: 'قطاع حكومي',
    sectorPrivateCompany: 'قطاع خاص - شركات',
    sectorPrivateEstablishment: 'قطاع خاص - مؤسسات',
    sectorRetired: 'متقاعد',
    durationLess: 'اقل من ٣ شهور',
    durationMore: 'اكثر من ٣ شهور',
  },
  features: {
    badge: 'مميزاتنا',
    title: 'ليش تختار',
    titleHighlight: 'الابداع؟',
    subtitle: 'نقدم لك أفضل تجربة شراء بأسهل شروط التقسيط في السوق',
    items: [
      {
        id: '1',
        heading: 'تقدر تقسط إلى 36 شهر',
        paragraph: 'قسط المنتجات اللي تبغاه بتقسيط يبدأ من ٦ شهور حتى ٣٦ شهر ..',
        imageUrl: '/assests/feature-1.jpg.webp',
      },
      {
        id: '2',
        heading: 'ما نطلب احد يكفلك',
        paragraph: 'خدمة التقسيط عندنا أنت فيها كفيل نفسك !',
        imageUrl: '/assests/feature-2.jpg.webp',
      },
      {
        id: '3',
        heading: 'أول قسط بعد 3 شهور',
        paragraph: 'قسّط على راحتك بدون ما تشيل هم ميزانيتك!',
        imageUrl: '/assests/feature-3.jpg.webp',
      },
      {
        id: '4',
        heading: 'استلام مباشر',
        paragraph: 'بدون انتظار ولا شغلة بالجهازك تستلمه مباشرة !',
        imageUrl: '/assests/feature-4.jpg.webp',
      },
    ],
    shopPromo: {
      imageUrl: '/assests/shopping.webp',
      imageAlt: 'تسوق من متجر الابداع الإلكتروني',
      heading: 'طالب ، مقيم ، أو مستفيد من الضمان الاجتماعي ؟',
      subtextBefore: 'تقدر',
      subtextHighlight: 'تقسّط بسهولة',
      subtextAfter: 'من متجرنا الإلكتروني عن طريق',
      storeUrl: 'https://alabidaestore.com',
      ctaText: 'تسوق من متجرنا الان',
    },
  },
  testimonials: [
    {
      id: 't1',
      name: 'خالد الاحمد',
      text: 'اشتريت جوالين من محلهم في الرياض وعطوني بكج حماية هدية اشكر الموظفين وخاصة الموظف زيد',
      rating: 5,
      monthsAgo: 2,
      order: 0,
    },
    {
      id: 't2',
      name: 'ندي الحربي',
      text: 'ان شاء الله مو اخر تعامل وصلني الجوال وراضية فيه 100% لا تتعدونهم وثقة',
      rating: 5,
      monthsAgo: 4,
      order: 1,
    },
    {
      id: 't3',
      name: 'Abdulaziz Mohamad',
      text: 'ما ندمت اني تعاملت معهم سرعة في الخدمة وسرعة في التوصيل والاسعار رهيبة',
      rating: 5,
      monthsAgo: 5,
      order: 2,
    },
    {
      id: 't4',
      name: 'عبدالله السهلي',
      text: 'تجربة رائعة امانة ومصداقية وفعلا ما طولو بالتوصيل وانا بالمنطقة الغربية يعطيكم العافية',
      rating: 5,
      monthsAgo: 7,
      order: 3,
    },
    {
      id: 't5',
      name: 'سعود المطيري',
      text: 'افضل محل شريت منه جوالات عميل عندهم الله يبارك لهم من 4 سنوات تعاملهم راقي واسعارهم ممتازة',
      rating: 5,
      monthsAgo: 9,
      order: 4,
    },
  ],
  faqs: [
    {
      id: 'f1',
      q: 'ما هي طرق الدفع المتاحة؟',
      a: 'نوفر عدة طرق دفع آمنة ومريحة تشمل مدى ، فيزا ، آبل باي ، تمارا وتابي.',
      order: 0,
    },
    {
      id: 'f2',
      q: 'كم تستغرق عملية التوصيل؟',
      a: 'مدة التوصيل تختلف حسب المنطقة والمدينة. عادة ما تستغرق ساعتين في الرياض والخرج، وثلاث أيام عمل للمناطق الأخرى. سنقوم بإرسال رسالة تحتوي على تفاصيل الشحنة ورقم التتبع.',
      order: 1,
    },
    {
      id: 'f3',
      q: 'كيف يمكنني تتبع طلبي؟',
      a: "بعد تأكيد الطلب وشحنه، ستنتلقى رسالة نصية وبريد إلكتروني يحتوي على رقم التتبع. يمكنك استخدام هذا الرقم لتتبع طلبك على موقع شركة الشحن أو من خلال صفحة 'طلباتي' في حسابك.",
      order: 2,
    },
    {
      id: 'f4',
      q: 'هل الأجهزة مضمونة؟',
      a: 'نعم، جميع منتجاتنا أصلية 100% ومعها ضمان من الوكيل الرسمي لمدة سنتين.',
      order: 3,
    },
    {
      id: 'f5',
      q: 'عن الابداع للاتصالات؟',
      a: 'الابداع للاتصالات علامة تجارية سعودية مسجلة برقم تجاري وضريبي ومسجلة كعلامة تجارية لدى الهيئة السعودية للملكية الفكرية. تقدم خدمات بيع الأجهزة الإلكترونية والهواتف ومستلزماتها، مقرها الرياض وتوفر جميع طرق الدفع.',
      order: 4,
    },
  ],
  footer: {
    whatsapp: '966920017816',
    email: 'info@alabidaestore.com',
    tiktok: 'https://www.tiktok.com/@alebddastore',
    snapchat: 'https://snapchat.com/t/23ycS0gY',
    crNumber: '7052925224',
    taxNumber: '311773610700003',
    businessCenterNumber: '0000101502',
    mapsEmbedUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3624.4!2d46.8164417!3d24.7257584!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2fa9b9bdb16999%3A0xd705c2175a768992!2z2KrZgtiz2YrYt9-EINis2YjYp9mE2KfYqiDYp9mE2KfYqNivYYum2Llg2YTZhNin2KrYqNmE2KfYqA!5e0!3m2!1sar!2ssa!4v1700000000000',
    mapsExternalUrl: 'https://maps.app.goo.gl/YeoRtcFLKXo6Dm4i9',
    copyrightText: 'الابداع للاتصالات — جميع الحقوق محفوظة',
  },
  logoUrl: '/assests/logo.webp',
  seo: {
    title: 'الابداع للاتصالات | بيع الهواتف الذكية ومستلزماتها وتقسيط حتى 60 شهر',
    description:
      'شركة سعودية متميزة في مجال الاتصالات مقرها الرياض. جميع طرق الدفع متوفرة ونقدم خدمة التقسيط إلى 60 شهر.',
    ogTitle: 'الابداع للاتصالات | بيع الهواتف الذكية ومستلزماتها',
    ogDescription:
      'شركة سعودية متميزة في مجال الاتصالات مقرها الرياض جميع طرق الدفع متوفرة ونقدم خدمة التقسيط الى 60 شهر',
  },
  successPage: {
    title: 'تم استلام طلبك! 🎉',
    subtitle:
      'شكراً لتسجيلك مع الابداع للإتصالات. سيتواصل معك أحد ممثلينا خلال 24 ساعة.',
    whatsappMessage:
      'مرحباً، أنا مهتم بعروض الابداع للإتصالات وأودّ الاستفسار عن المزيد من التفاصيل.',
  },
};

module.exports = { DEFAULT_SITE_CONTENT };
