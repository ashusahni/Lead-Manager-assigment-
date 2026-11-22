const prisma = require('../db');

/**
 * Get all leads with search, filtering, sorting, and pagination
 */
const getLeads = async (req, res, next) => {
  try {
    const {
      search = '',
      status,
      source,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    // Build Prisma where filter
    const where = {};

    // User scope (if authenticated)
    if (req.user) {
      where.userId = req.user.id;
    }

    // Status filter
    if (status && status !== 'All') {
      where.status = status;
    }

    // Source filter
    if (source && source !== 'All') {
      where.source = source;
    }

    // Search filter across name, email, and company
    if (search.trim()) {
      const searchTerm = search.trim();
      where.OR = [
        { name: { contains: searchTerm } },
        { email: { contains: searchTerm } },
        { company: { contains: searchTerm } },
      ];
    }

    // Allowed sort columns
    const allowedSortFields = ['createdAt', 'name', 'company', 'status', 'updatedAt'];
    const orderField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const orderDirection = sortOrder.toLowerCase() === 'asc' ? 'asc' : 'desc';

    // Execute query with pagination & total count
    const [leads, totalCount] = await Promise.all([
      prisma.lead.findMany({
        where,
        orderBy: { [orderField]: orderDirection },
        skip: limitNum > 0 ? skip : undefined,
        take: limitNum > 0 ? limitNum : undefined,
      }),
      prisma.lead.count({ where }),
    ]);

    const totalPages = limitNum > 0 ? Math.ceil(totalCount / limitNum) : 1;

    res.json({
      success: true,
      data: {
        leads,
        pagination: {
          total: totalCount,
          page: pageNum,
          limit: limitNum,
          totalPages,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get lead summary metrics / statistics
 */
const getLeadStats = async (req, res, next) => {
  try {
    const where = {};
    if (req.user) {
      where.userId = req.user.id;
    }

    const [total, newCount, contactedCount, qualifiedCount, lostCount] = await Promise.all([
      prisma.lead.count({ where }),
      prisma.lead.count({ where: { ...where, status: 'New' } }),
      prisma.lead.count({ where: { ...where, status: 'Contacted' } }),
      prisma.lead.count({ where: { ...where, status: 'Qualified' } }),
      prisma.lead.count({ where: { ...where, status: 'Lost' } }),
    ]);

    const conversionRate = total > 0 ? Math.round((qualifiedCount / total) * 100) : 0;

    res.json({
      success: true,
      data: {
        total,
        byStatus: {
          New: newCount,
          Contacted: contactedCount,
          Qualified: qualifiedCount,
          Lost: lostCount,
        },
        conversionRate,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single lead by ID
 */
const getLeadById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const lead = await prisma.lead.findUnique({
      where: { id },
    });

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found.',
      });
    }

    // Check ownership if authenticated
    if (req.user && lead.userId && lead.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view this lead.',
      });
    }

    res.json({
      success: true,
      data: { lead },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new lead
 */
const createLead = async (req, res, next) => {
  try {
    const { name, email, phone, company, source, status, notes } = req.body;

    const lead = await prisma.lead.create({
      data: {
        name,
        email: email.toLowerCase(),
        phone,
        company,
        source,
        status: status || 'New',
        notes: notes || null,
        userId: req.user ? req.user.id : null,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Lead created successfully',
      data: { lead },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update an existing lead
 */
const updateLead = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existingLead = await prisma.lead.findUnique({
      where: { id },
    });

    if (!existingLead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found.',
      });
    }

    // Check ownership if authenticated
    if (req.user && existingLead.userId && existingLead.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to modify this lead.',
      });
    }

    const { name, email, phone, company, source, status, notes } = req.body;

    const updatedLead = await prisma.lead.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(email && { email: email.toLowerCase() }),
        ...(phone && { phone }),
        ...(company && { company }),
        ...(source && { source }),
        ...(status && { status }),
        ...(notes !== undefined && { notes }),
      },
    });

    res.json({
      success: true,
      message: 'Lead updated successfully',
      data: { lead: updatedLead },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a lead
 */
const deleteLead = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existingLead = await prisma.lead.findUnique({
      where: { id },
    });

    if (!existingLead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found.',
      });
    }

    // Check ownership if authenticated
    if (req.user && existingLead.userId && existingLead.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this lead.',
      });
    }

    await prisma.lead.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Lead deleted successfully',
      data: { id },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLeads,
  getLeadStats,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
};
