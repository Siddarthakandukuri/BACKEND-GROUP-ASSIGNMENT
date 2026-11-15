// Express app setup (Part 1: Server and routes)
const express = require('express');

const vendorsRouter = require('./routes/vendors');
const shelvesRouter = require('./routes/shelves');
const leaseDetailsRouter = require('./routes/leaseDetails');
const leasesRouter = require('./routes/leases');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({ message: 'FreshMart Cold Storage API is running' });
});

app.use('/vendors', vendorsRouter);
app.use('/shelves', shelvesRouter);
// The join endpoint must be mounted BEFORE /leases so "/leases/details" is not read as an id
app.use('/leases/details', leaseDetailsRouter);
app.use('/leases', leasesRouter);

// Unknown route
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler (bad JSON body, unexpected errors)
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON in request body' });
  }
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;
