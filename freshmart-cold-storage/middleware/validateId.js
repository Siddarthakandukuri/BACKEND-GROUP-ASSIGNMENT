// Checks the :id in the URL is a positive whole number (Part 4: Validation)
// Used with router.param('id', validateId)
module.exports = function validateId(req, res, next, value) {
  if (!/^[1-9]\d*$/.test(value)) {
    return res.status(400).json({ error: 'Id must be a positive whole number' });
  }
  next();
};
