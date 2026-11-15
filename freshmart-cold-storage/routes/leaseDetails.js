// JOIN endpoint (Part 3: REST endpoints)
// GET /leases/details -> every lease with the vendor name and the shelf name
const express = require('express');
const q = require('../db/queries');

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json(q.getLeaseDetails());
});

module.exports = router;
