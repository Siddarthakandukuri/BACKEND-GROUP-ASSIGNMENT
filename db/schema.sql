-- 3 related tables: vendors, shelves, leases (Part 2: Database)
CREATE TABLE IF NOT EXISTS vendors (
  id    INTEGER PRIMARY KEY AUTOINCREMENT,
  name  TEXT NOT NULL,
  phone TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS shelves (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT NOT NULL,
  temperature REAL NOT NULL            -- degrees Celsius, e.g. -18
);

CREATE TABLE IF NOT EXISTS leases (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  vendor_id  INTEGER NOT NULL REFERENCES vendors(id),
  shelf_id   INTEGER NOT NULL REFERENCES shelves(id),
  start_date TEXT NOT NULL,            -- YYYY-MM-DD
  end_date   TEXT NOT NULL             -- YYYY-MM-DD
);
