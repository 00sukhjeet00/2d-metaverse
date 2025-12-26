const errorMiddleware = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Handle Mongoose Validation Error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  }

  // Handle Mongoose Duplicate Key Error
  if (err.code === 11000) {
    statusCode = 400;
    message = "Duplicate key error: value already exists";
  }

  res.status(statusCode).json({
    error: message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = errorMiddleware;
