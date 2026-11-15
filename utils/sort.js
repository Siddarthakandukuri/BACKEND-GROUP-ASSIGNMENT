// TWIST: Sorted lists (Part 5)
//   GET /shelves?sort=name&order=asc|desc
//   Unknown sort field -> 400 "Cannot sort by that field"
// Returns { orderBy } (SQL fragment, built only from the whitelist) or { error }.

// whitelist: field -> SQL column expression (name sorts case-insensitively so A..Z is correct)
const SORTABLE = {
  id: 'id',
  name: 'name COLLATE NOCASE',
  temperature: 'temperature',
};

function parseSort(query) {
  const { sort, order } = query;

  if (sort === undefined) return { orderBy: '' }; // no sorting asked

  if (typeof sort !== 'string' || !Object.prototype.hasOwnProperty.call(SORTABLE, sort)) {
    return { error: 'Cannot sort by that field' };
  }

  const direction = order === undefined ? 'asc' : order;
  if (typeof direction !== 'string' || !['asc', 'desc'].includes(direction.toLowerCase())) {
    return { error: 'Order must be asc or desc' };
  }

  return { orderBy: `ORDER BY ${SORTABLE[sort]} ${direction.toUpperCase()}` };
}

module.exports = { parseSort, SORTABLE };
