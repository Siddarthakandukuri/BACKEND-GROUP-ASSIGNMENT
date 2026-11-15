// Validation for adding (POST) and updating (PUT) a shelf (Part 4: Validation)
// Sends 400 with a clear message when the body is wrong.
const MIN_TEMP = -60; // coldest a freezer shelf can be
const MAX_TEMP = 0;   // warmest a freezer shelf can be

module.exports = function validateShelf(req, res, next) {
  const body = req.body || {};
  const { name, temperature } = body;

  if (typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ error: 'Shelf name is required and must be a non-empty text' });
  }
  if (name.trim().length > 50) {
    return res.status(400).json({ error: 'Shelf name must be 50 characters or fewer' });
  }
  if (typeof temperature !== 'number' || !Number.isFinite(temperature)) {
    return res.status(400).json({ error: 'Shelf temperature is required and must be a number' });
  }
  if (temperature < MIN_TEMP || temperature > MAX_TEMP) {
    return res.status(400).json({ error: `Shelf temperature must be between ${MIN_TEMP} and ${MAX_TEMP} degrees Celsius` });
  }
  next();
};
