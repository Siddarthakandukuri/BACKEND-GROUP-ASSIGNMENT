// Sample data: run with `npm run seed` (Part 2: Database)
const db = require('./database');

const count = db.prepare('SELECT COUNT(*) AS n FROM shelves').get().n;
if (count > 0) {
  console.log('Database already has data - skipping seed.');
  process.exit(0);
}

const insertVendor = db.prepare('INSERT INTO vendors (name, phone) VALUES (?, ?)');
const insertShelf = db.prepare('INSERT INTO shelves (name, temperature) VALUES (?, ?)');
const insertLease = db.prepare(
  'INSERT INTO leases (vendor_id, shelf_id, start_date, end_date) VALUES (?, ?, ?, ?)'
);

db.transaction(() => {
  insertVendor.run('Ravi Fish Traders', '9876500001');
  insertVendor.run('Green Peas Co', '9876500002');
  insertVendor.run('Ice Cream Hub', '9876500003');

  insertShelf.run('Shelf A1', -18);
  insertShelf.run('Shelf B2', -25);
  insertShelf.run('Shelf C3', -10);
  insertShelf.run('Shelf D4', -18);

  insertLease.run(1, 1, '2026-11-01', '2026-11-30');
  insertLease.run(2, 2, '2026-11-01', '2026-12-15');
  insertLease.run(3, 3, '2026-11-10', '2026-12-10');
})();

console.log('Seeded 3 vendors, 4 shelves, 3 leases.');
