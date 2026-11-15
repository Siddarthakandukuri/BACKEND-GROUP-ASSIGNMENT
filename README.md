# FreshMart Cold Storage

BDF Group Assignment · Group JP-GAI2A-G11 · Theme 26: Freezer shelves

> "Freezer shelves are rented to vendors by phone. A vendor found another vendor's goods on their shelf."

This API keeps one clear record of which vendor has which shelf and when. A shelf cannot be leased to two vendors for overlapping dates, so goods can't end up on the wrong shelf.

**Stack:** Node.js, Express, SQLite (`better-sqlite3`)

## How to run

```bash
npm install
npm run seed     # optional: adds sample vendors, shelves and leases
npm start        # http://localhost:3000
npm test         # runs the 3 twist tests automatically
```

Set `PORT` to use a different port. The database file is created at `db/freshmart.db`.

## Database (3 related tables)

| Table | Columns |
|---|---|
| vendors | id, name, phone |
| shelves | id, name, temperature |
| leases | id, vendor_id → vendors, shelf_id → shelves, start_date, end_date |

## Endpoints

| Method | URL | Success | Notes |
|---|---|---|---|
| GET | /shelves | 200 | Supports search and sort (below) |
| GET | /shelves/:id | 200 | 404 if not found, 400 if id is not a number |
| POST | /shelves | 201 | Body `{ "name": "Shelf A1", "temperature": -18 }` |
| PUT | /shelves/:id | 200 | Same body as POST, 404 if not found |
| DELETE | /shelves/:id | 204 | 404 if not found, 409 if the shelf has leases |
| GET | /leases/details | 200 | **Join:** leases with `vendor_name` and `shelf_name` |
| GET, POST, DELETE | /leases | 200 / 201 / 204 | 409 if the shelf is already leased for those dates |
| GET, POST, DELETE | /vendors | 200 / 201 / 204 | |

### Validation (POST and PUT /shelves)
- `name`: required, text, 1 to 50 characters
- `temperature`: required, a number from -60 to 0
- Errors return `400` with `{ "error": "clear message" }`

### Search (query parameters)
- `GET /shelves?temperature=-18` exact temperature
- `GET /shelves?minTemp=-25&maxTemp=-15` temperature range
- `GET /shelves?q=A1` name contains text

### Twist: Sorted lists
`GET /shelves?sort=name&order=asc|desc` (sort fields: `id`, `name`, `temperature`; order defaults to `asc`)

| Test | Request | Result |
|---|---|---|
| 1 | `sort=name&order=asc` | 200, A to Z |
| 2 | `sort=name&order=desc` | 200, Z to A |
| 3 | `sort=colour` | 400, `Cannot sort by that field` |

## Postman
Import `postman/FreshMart.postman_collection.json`, make sure the server is running (after `npm run seed`), and run the collection. Every request has a status code check.

## Project structure
```
app.js, server.js          Express setup and start
routes/                    vendors, shelves, leases, leaseDetails (join)
db/                        schema.sql, database.js, queries.js, seed.js
middleware/                validateId, validateShelf
utils/                     search.js, sort.js (twist)
tests/                     twist.test.js
postman/                   Postman collection
```

## Team
| Member | Part |
|---|---|
| K. Siddartha | 1 Server and routes, 2 Database |
| K. Jashwanth | 3 REST endpoints |
| B. Pranav | 4 Validation and search |
| A. Sriram | 5 Twist rule |
| K. Veekshith | 6 Postman and README |
