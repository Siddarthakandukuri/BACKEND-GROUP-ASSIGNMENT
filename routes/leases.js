// Lease routes (Part 1: Server and routes)
// A shelf can only be leased to ONE vendor at a time. This is what stops
// "another vendor's goods on my shelf": overlapping leases are rejected with 409.
const express = require('express');
const q = require('../db/queries');
const validateId = require('../middleware/validateId');

const router = express.Router();
router.param('id', validateId);

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const isDate = (s) => typeof s === 'string' && DATE_RE.test(s) && !Number.isNaN(Date.parse(s));

// GET /leases
router.get('/', (req, res) => {
  res.status(200).json(q.getLeases());
});

// GET /leases/:id
router.get('/:id', (req, res) => {
  const lease = q.getLeaseById(req.params.id);
  if (!lease) return res.status(404).json({ error: 'Lease not found' });
  res.status(200).json(lease);
});

// POST /leases  { vendor_id, shelf_id, start_date, end_date }  (dates: YYYY-MM-DD)
router.post('/', (req, res) => {
  const { vendor_id, shelf_id, start_date, end_date } = req.body || {};

  if (!Number.isInteger(vendor_id) || !Number.isInteger(shelf_id)) {
    return res.status(400).json({ error: 'vendor_id and shelf_id must be integers' });
  }
  if (!isDate(start_date) || !isDate(end_date)) {
    return res.status(400).json({ error: 'start_date and end_date must be dates in YYYY-MM-DD format' });
  }
  if (end_date < start_date) {
    return res.status(400).json({ error: 'end_date cannot be before start_date' });
  }
  if (!q.getVendorById(vendor_id)) return res.status(404).json({ error: 'Vendor not found' });
  if (!q.getShelfById(shelf_id)) return res.status(404).json({ error: 'Shelf not found' });

  if (q.findOverlappingLease(shelf_id, start_date, end_date)) {
    return res.status(409).json({ error: 'Shelf is already leased to a vendor for those dates' });
  }

  const lease = q.addLease(vendor_id, shelf_id, start_date, end_date);
  res.status(201).json(lease);
});

// DELETE /leases/:id
router.delete('/:id', (req, res) => {
  const removed = q.deleteLease(req.params.id);
  if (!removed) return res.status(404).json({ error: 'Lease not found' });
  res.status(204).send();
});

module.exports = router;
