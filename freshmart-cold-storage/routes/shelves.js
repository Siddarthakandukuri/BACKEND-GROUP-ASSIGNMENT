// Shelf CRUD (Part 3: REST endpoints)
// Validation comes from Part 4, search from Part 4, sorting from Part 5.
const express = require('express');
const q = require('../db/queries');
const validateId = require('../middleware/validateId');
const validateShelf = require('../middleware/validateShelf');
const { buildFilters } = require('../utils/search');
const { parseSort } = require('../utils/sort');

const router = express.Router();
router.param('id', validateId);

// GET /shelves   (optional: ?temperature=-18 ?q=A1 ?sort=name&order=asc|desc)
router.get('/', (req, res) => {
  const filters = buildFilters(req.query);
  if (filters.error) return res.status(400).json({ error: filters.error });

  const sorting = parseSort(req.query);
  if (sorting.error) return res.status(400).json({ error: sorting.error });

  const shelves = q.getShelves({ where: filters.where, params: filters.params, orderBy: sorting.orderBy });
  res.status(200).json(shelves);
});

// GET /shelves/:id
router.get('/:id', (req, res) => {
  const shelf = q.getShelfById(req.params.id);
  if (!shelf) return res.status(404).json({ error: 'Shelf not found' });
  res.status(200).json(shelf);
});

// POST /shelves  { name, temperature }
router.post('/', validateShelf, (req, res) => {
  const { name, temperature } = req.body;
  const shelf = q.addShelf(name.trim(), temperature);
  res.status(201).json(shelf);
});

// PUT /shelves/:id  { name, temperature }
router.put('/:id', validateShelf, (req, res) => {
  const { name, temperature } = req.body;
  const shelf = q.updateShelf(req.params.id, name.trim(), temperature);
  if (!shelf) return res.status(404).json({ error: 'Shelf not found' });
  res.status(200).json(shelf);
});

// DELETE /shelves/:id
router.delete('/:id', (req, res) => {
  if (!q.getShelfById(req.params.id)) {
    return res.status(404).json({ error: 'Shelf not found' });
  }
  if (q.shelfHasLeases(req.params.id)) {
    return res.status(409).json({ error: 'Shelf has leases and cannot be deleted' });
  }
  q.deleteShelf(req.params.id);
  res.status(204).send();
});

module.exports = router;
