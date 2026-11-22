const express = require('express');
const router = express.Router();
const leadController = require('../controllers/leadController');
const { optionalAuth } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createLeadSchema, updateLeadSchema } = require('../validations/leadValidation');

// Dashboard statistics
router.get('/stats', optionalAuth, leadController.getLeadStats);

// Lead CRUD
router.get('/', optionalAuth, leadController.getLeads);
router.get('/:id', optionalAuth, leadController.getLeadById);
router.post('/', optionalAuth, validate(createLeadSchema), leadController.createLead);
router.put('/:id', optionalAuth, validate(updateLeadSchema), leadController.updateLead);
router.delete('/:id', optionalAuth, leadController.deleteLead);

module.exports = router;
