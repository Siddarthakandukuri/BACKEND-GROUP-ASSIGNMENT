// All SQL queries live here (Part 2: Database).
const db = require('./database');

// ---------- Vendors ----------
const getVendors = () => db.prepare('SELECT * FROM vendors').all();
const getVendorById = (id) => db.prepare('SELECT * FROM vendors WHERE id = ?').get(id);
const addVendor = (name, phone) => {
  const info = db.prepare('INSERT INTO vendors (name, phone) VALUES (?, ?)').run(name, phone);
  return getVendorById(info.lastInsertRowid);
};
const deleteVendor = (id) => db.prepare('DELETE FROM vendors WHERE id = ?').run(id).changes > 0;

// ---------- Shelves ----------
// `where` and `orderBy` are SQL fragments produced ONLY by utils/search.js and utils/sort.js
// (whitelisted fields; user values are passed through `params`), so they are safe from SQL injection.
const getShelves = ({ where = '', params = [], orderBy = '' } = {}) =>
  db.prepare(`SELECT * FROM shelves ${where} ${orderBy}`).all(...params);
const getShelfById = (id) => db.prepare('SELECT * FROM shelves WHERE id = ?').get(id);
const addShelf = (name, temperature) => {
  const info = db.prepare('INSERT INTO shelves (name, temperature) VALUES (?, ?)').run(name, temperature);
  return getShelfById(info.lastInsertRowid);
};
const updateShelf = (id, name, temperature) => {
  const info = db.prepare('UPDATE shelves SET name = ?, temperature = ? WHERE id = ?').run(name, temperature, id);
  return info.changes > 0 ? getShelfById(id) : null;
};
const deleteShelf = (id) => db.prepare('DELETE FROM shelves WHERE id = ?').run(id).changes > 0;
const shelfHasLeases = (shelfId) =>
  !!db.prepare('SELECT 1 FROM leases WHERE shelf_id = ? LIMIT 1').get(shelfId);

// ---------- Leases ----------
const getLeases = () => db.prepare('SELECT * FROM leases').all();
const getLeaseById = (id) => db.prepare('SELECT * FROM leases WHERE id = ?').get(id);
const addLease = (vendorId, shelfId, start, end) => {
  const info = db
    .prepare('INSERT INTO leases (vendor_id, shelf_id, start_date, end_date) VALUES (?, ?, ?, ?)')
    .run(vendorId, shelfId, start, end);
  return getLeaseById(info.lastInsertRowid);
};
const deleteLease = (id) => db.prepare('DELETE FROM leases WHERE id = ?').run(id).changes > 0;

// Is this shelf already leased to someone during [start, end]?
const findOverlappingLease = (shelfId, start, end) =>
  db
    .prepare('SELECT * FROM leases WHERE shelf_id = ? AND start_date <= ? AND end_date >= ?')
    .get(shelfId, end, start);

// JOIN query: leases with vendor name and shelf name
const getLeaseDetails = () =>
  db
    .prepare(
      `SELECT leases.id,
              vendors.name AS vendor_name,
              shelves.name AS shelf_name,
              leases.start_date,
              leases.end_date
         FROM leases
         JOIN vendors ON vendors.id = leases.vendor_id
         JOIN shelves ON shelves.id = leases.shelf_id
        ORDER BY leases.id`
    )
    .all();

module.exports = {
  getVendors, getVendorById, addVendor, deleteVendor,
  getShelves, getShelfById, addShelf, updateShelf, deleteShelf, shelfHasLeases,
  getLeases, getLeaseById, addLease, deleteLease, findOverlappingLease,
  getLeaseDetails,
};
