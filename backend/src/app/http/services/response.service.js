const sendSuccess = (res, status = 200, message = "Success", data = null) => {
  const body = { success: true, message };
  if (data !== null) body.data = data;
  return res.status(status).json(body);
};

const sendError = (res, status = 500, message = "Something went wrong", errorCode = "INTERNAL_SERVER_ERROR", errors = []) => {
  const body = { success: false, message, error_code: errorCode };
  if (errors.length > 0) body.errors = errors;
  return res.status(status).json(body);
};

module.exports = { sendSuccess, sendError };