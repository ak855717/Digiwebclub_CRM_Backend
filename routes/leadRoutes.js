const express = require('express');
const router = express.Router();
const { getLeads, createLead, updateLead, deleteLead } = require('../controllers/leadController');
const { adminAuth, userAuth } = require('../middleware/auth');

router.route('/leads')
  .get(getLeads)
  .post(userAuth, createLead);

router.route('/leads/:id')
  .put(userAuth, updateLead)
  .delete(adminAuth, deleteLead);

module.exports = router;
