// Search by query parameters (Part 4: Validation and search)
//   GET /shelves?temperature=-18      exact temperature
//   GET /shelves?minTemp=-20&maxTemp=-10   temperature range
//   GET /shelves?q=A1                 name contains text
// Returns { where, params } for the SQL query, or { error } for a bad value.

function toNumber(value) {
  if (typeof value !== 'string' || value.trim() === '') return NaN;
  return Number(value);
}

function buildFilters(query) {
  const clauses = [];
  const params = [];

  const numeric = [
    ['temperature', '=', 'temperature'],
    ['minTemp', '>=', 'minTemp'],
    ['maxTemp', '<=', 'maxTemp'],
  ];
  for (const [key, op] of numeric) {
    if (query[key] === undefined) continue;
    const n = toNumber(query[key]);
    if (!Number.isFinite(n)) return { error: `${key} must be a number` };
    clauses.push(`temperature ${op} ?`);
    params.push(n);
  }

  if (query.q !== undefined) {
    if (typeof query.q !== 'string') return { error: 'q must be text' };
    clauses.push('name LIKE ?');
    params.push(`%${query.q}%`);
  }

  return { where: clauses.length ? `WHERE ${clauses.join(' AND ')}` : '', params };
}

module.exports = { buildFilters };
