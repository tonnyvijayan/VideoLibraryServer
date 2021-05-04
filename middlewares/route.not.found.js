const routeNotFound = (req, res) => {
  res.json({ success: false, mesaage: "route not found" });
};

module.exports = routeNotFound;
