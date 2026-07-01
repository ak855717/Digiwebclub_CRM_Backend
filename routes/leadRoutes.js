const express = require('express');
const router = express.Router();
const { getLeads, createLead, updateLead, deleteLead, addRemark, deleteRemark } = require('../controllers/leadController');
const { adminAuth, userAuth } = require('../middleware/auth');

router.route('/leads')
  .get(getLeads)
  .post(userAuth, createLead);

router.route('/leads/:id')
  .put(userAuth, updateLead)
  .delete(adminAuth, deleteLead);

router.route('/leads/:id/remarks')
  .post(userAuth, addRemark);

router.route('/leads/:id/remarks/:remarkId')
  .delete(userAuth, deleteRemark);

module.exports = router;
