const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.json({
    success: false,
    message: "error occured",
    errorMessage: err.message,
  });
  next();
};

module.exports = errorHandler;
