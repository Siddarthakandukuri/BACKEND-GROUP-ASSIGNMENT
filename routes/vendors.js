// Vendor routes (Part 1: Server and routes)
const express = require('express');
const q = require('../db/queries');
const validateId = require('../middleware/validateId');

const router = express.Router();
router.param('id', validateId);

// GET /vendors
router.get('/', (req, res) => {
  res.status(200).json(q.getVendors());
});

// GET /vendors/:id
router.get('/:id', (req, res) => {
  const vendor = q.getVendorById(req.params.id);
  if (!vendor) return res.status(404).json({ error: 'Vendor not found' });
  res.status(200).json(vendor);
});

// POST /vendors  { name, phone }
router.post('/', (req, res) => {
  const { name, phone } = req.body || {};
  if (typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ error: 'Vendor name is required' });
  }
  if (typeof phone !== 'string' || phone.trim() === '') {
    return res.status(400).json({ error: 'Vendor phone is required' });
  }
  const vendor = q.addVendor(name.trim(), phone.trim());
  res.status(201).json(vendor);
});

// DELETE /vendors/:id
router.delete('/:id', (req, res) => {
  try {
    const removed = q.deleteVendor(req.params.id);
    if (!removed) return res.status(404).json({ error: 'Vendor not found' });
    res.status(204).send();
  } catch (err) {
    if (String(err.code).startsWith('SQLITE_CONSTRAINT')) {
      return res.status(409).json({ error: 'Vendor still has leases and cannot be deleted' });
    }
    throw err;
  }
});

module.exports = router;
