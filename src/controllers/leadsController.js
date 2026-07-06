const Lead = require('../models/Lead');

// ─── POST /api/leads ──────────────────────────────────────────────────────────
/**
 * Public endpoint — submit a new lead from the landing page form.
 */
async function createLead(req, res) {
  try {
    const {
      fullName,
      phone,
      isQualified,
      state,
      monthlySalary,
      monthlyObligations,
      hasRealEstateLoan,
      workSector,
      serviceDuration,
    } = req.body;

    const lead = await Lead.create({
      fullName,
      phone,
      isQualified,
      state,
      monthlySalary,
      monthlyObligations,
      hasRealEstateLoan,
      workSector,
      serviceDuration,
    });

    res.status(201).json({
      success: true,
      message: 'تم إرسال طلبك بنجاح! سيتواصل معك فريقنا قريباً.',
      data: { _id: lead._id },
    });
  } catch (err) {
    // Mongoose validation error
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map((e) => ({
        field: e.path,
        message: e.message,
      }));
      return res.status(422).json({ success: false, message: 'بيانات غير صحيحة', errors });
    }
    console.error('[leads/create]', err);
    res.status(500).json({ success: false, message: 'خطأ في الخادم' });
  }
}

// ─── GET /api/leads ───────────────────────────────────────────────────────────
/**
 * Protected — paginated list of leads with optional status filter.
 * Query params: ?page=1&limit=20&status=new
 */
async function getLeads(req, res) {
  try {
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 20);
    const skip  = (page - 1) * limit;

    const filter = {};
    if (req.query.status && ['new', 'contacted', 'closed'].includes(req.query.status)) {
      filter.status = req.query.status;
    }

    const [leads, total] = await Promise.all([
      Lead.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Lead.countDocuments(filter),
    ]);

    // Stats — always counts across all leads (not just the current filter)
    const [newCount, contactedCount, closedCount, newToday] = await Promise.all([
      Lead.countDocuments({ status: 'new' }),
      Lead.countDocuments({ status: 'contacted' }),
      Lead.countDocuments({ status: 'closed' }),
      Lead.countDocuments({
        status: 'new',
        createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      }),
    ]);

    res.json({
      success: true,
      data: {
        leads,
        total,
        page,
        totalPages: Math.ceil(total / limit),
        stats: {
          total: newCount + contactedCount + closedCount,
          newToday,
          contacted: contactedCount,
          closed: closedCount,
        },
      },
    });
  } catch (err) {
    console.error('[leads/getAll]', err);
    res.status(500).json({ success: false, message: 'خطأ في الخادم' });
  }
}

// ─── PATCH /api/leads/:id ─────────────────────────────────────────────────────
/**
 * Protected — update lead status: new → contacted → closed
 */
async function updateLead(req, res) {
  try {
    const { status } = req.body;
    const validStatuses = ['new', 'contacted', 'closed'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `الحالة يجب أن تكون: ${validStatuses.join(' / ')}`,
      });
    }

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: false }
    );

    if (!lead) {
      return res.status(404).json({ success: false, message: 'العميل غير موجود' });
    }

    res.json({ success: true, data: lead, message: 'تم تحديث الحالة' });
  } catch (err) {
    console.error('[leads/update]', err);
    res.status(500).json({ success: false, message: 'خطأ في الخادم' });
  }
}

// ─── DELETE /api/leads/:id ────────────────────────────────────────────────────
/**
 * Protected — permanently delete a lead.
 */
async function deleteLead(req, res) {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);

    if (!lead) {
      return res.status(404).json({ success: false, message: 'العميل غير موجود' });
    }

    res.json({ success: true, message: 'تم حذف العميل بنجاح' });
  } catch (err) {
    console.error('[leads/delete]', err);
    res.status(500).json({ success: false, message: 'خطأ في الخادم' });
  }
}

module.exports = { createLead, getLeads, updateLead, deleteLead };
