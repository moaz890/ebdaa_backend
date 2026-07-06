const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'الاسم الثلاثي مطلوب'],
      trim: true,
      minlength: [3, 'الاسم يجب أن يكون 3 أحرف على الأقل'],
      maxlength: [100, 'الاسم طويل جداً'],
    },
    phone: {
      type: String,
      required: [true, 'رقم الجوال مطلوب'],
      trim: true,
      match: [/^\d{9,10}$/, 'يرجى إدخال رقم جوال صحيح يتكون من 9 أو 10 أرقام'],
    },
    isQualified: {
      type: Boolean,
      required: [true, 'يرجى تحديد العمر'],
    },
    state: {
      type: String,
      enum: {
        values: ['citizen', 'resident'],
        message: 'الحالة يجب أن تكون مواطن أو مقيم',
      },
      required: [true, 'يرجى تحديد الحالة'],
    },
    monthlySalary: {
      type: Number,
      required: [true, 'الراتب الشهري مطلوب'],
      min: [0, 'الراتب الشهري يجب أن يكون رقماً موجباً'],
    },
    monthlyObligations: {
      type: Number,
      required: [true, 'الالتزامات الشهرية مطلوبة'],
      min: [0, 'الالتزامات الشهرية يجب أن تكون رقماً موجباً'],
    },
    hasRealEstateLoan: {
      type: Boolean,
      required: [true, 'يرجى تحديد وجود قرض عقاري'],
    },
    workSector: {
      type: String,
      enum: {
        values: ['government', 'private_company', 'private_establishment', 'retired'],
        message: 'يرجى تحديد قطاع العمل',
      },
      required: [true, 'يرجى تحديد قطاع العمل'],
    },
    serviceDuration: {
      type: String,
      enum: {
        values: ['less_than_3_months', 'more_than_3_months'],
        message: 'يرجى تحديد مدة الخدمة',
      },
      required: [true, 'يرجى تحديد مدة الخدمة'],
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'closed'],
      default: 'new',
    },
  },
  {
    timestamps: true,
  }
);

// Index for fast querying by status and date
leadSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Lead', leadSchema);
