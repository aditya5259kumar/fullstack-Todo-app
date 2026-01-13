module.exports = {
  success: (res, message, data, statuscode = 200) => {
    return res.status(statuscode).json({
      success: true,
      message: message,
      data: data,
    });
  },

  error: (res, message, error, statuscode = 400) => {
    return res.status(statuscode).json({
      success: false,
      message: message,
      error: error,
    });
  },
};