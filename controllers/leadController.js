const Lead = require('../models/leadModel');

// @desc    Get all leads
// @route   GET /api/leads
// @access  Public (for now)
const getLeads = async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json({ success: true, leads });
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Create a lead
// @route   POST /api/leads
// @access  Public
const createLead = async (req, res) => {
  try {
    const leadData = {
      ...req.body,
      createdBy: req.user ? req.user.name : 'System',
      updatedBy: req.user ? req.user.name : 'System',
    };
    const lead = await Lead.create(leadData);
    res.status(201).json({ success: true, lead });
  } catch (error) {
    console.error('Error creating lead:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Update a lead
// @route   PUT /api/leads/:id
// @access  Public
const updateLead = async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      updatedBy: req.user ? req.user.name : 'System',
    };
    const lead = await Lead.findByIdAndUpdate(req.params.id, updateData, {
      returnDocument: 'after',
      runValidators: true,
    });

    if (!lead) {
      return res.status(404).json({ success: false, error: 'Lead not found' });
    }

    res.json({ success: true, lead });
  } catch (error) {
    console.error('Error updating lead:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Delete a lead
// @route   DELETE /api/leads/:id
// @access  Public
const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);

    if (!lead) {
      return res.status(404).json({ success: false, error: 'Lead not found' });
    }

    res.json({ success: true, message: 'Lead removed' });
  } catch (error) {
    console.error('Error deleting lead:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Add a remark to a lead
// @route   POST /api/leads/:id/remarks
// @access  Public
const addRemark = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, error: 'Remark text is required' });
    }

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, error: 'Lead not found' });
    }

    const addedBy = req.user ? req.user.name : (req.headers['x-user-name'] || req.body.addedBy || 'System');
    const newRemark = {
      text: text.trim(),
      addedBy,
      createdAt: new Date()
    };

    if (!lead.remarks) {
      lead.remarks = [];
    }

    lead.remarks.push(newRemark);
    await lead.save();

    res.status(201).json({ success: true, lead, remark: newRemark });
  } catch (error) {
    console.error('Error adding remark:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Delete a remark from a lead
// @route   DELETE /api/leads/:id/remarks/:remarkId
// @access  Public
const deleteRemark = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, error: 'Lead not found' });
    }

    lead.remarks = (lead.remarks || []).filter(
      r => r._id && r._id.toString() !== req.params.remarkId
    );
    await lead.save();

    res.json({ success: true, lead });
  } catch (error) {
    console.error('Error deleting remark:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

module.exports = {
  getLeads,
  createLead,
  updateLead,
  deleteLead,
  addRemark,
  deleteRemark,
};
