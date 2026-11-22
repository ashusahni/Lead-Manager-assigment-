const { z } = require('zod');

const VALID_STATUSES = ['New', 'Contacted', 'Qualified', 'Lost'];
const VALID_SOURCES = ['Website', 'Referral', 'LinkedIn', 'Cold Outreach', 'Event', 'Other'];

const createLeadSchema = z.object({
  name: z.string({ required_error: 'Name is required' }).trim().min(2, 'Name must be at least 2 characters'),
  email: z.string({ required_error: 'Email is required' }).trim().email('Invalid email address'),
  phone: z.string({ required_error: 'Phone number is required' }).trim().min(7, 'Phone number must be at least 7 characters'),
  company: z.string({ required_error: 'Company name is required' }).trim().min(1, 'Company name is required'),
  source: z.enum(VALID_SOURCES, {
    errorMap: () => ({ message: `Source must be one of: ${VALID_SOURCES.join(', ')}` }),
  }),
  status: z.enum(VALID_STATUSES, {
    errorMap: () => ({ message: `Status must be one of: ${VALID_STATUSES.join(', ')}` }),
  }).default('New'),
  notes: z.string().trim().optional().nullable(),
});

const updateLeadSchema = createLeadSchema.partial();

module.exports = {
  createLeadSchema,
  updateLeadSchema,
  VALID_STATUSES,
  VALID_SOURCES,
};
