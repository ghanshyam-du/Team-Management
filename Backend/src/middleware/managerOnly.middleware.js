const managerOnly = (req, res, next) => {
  if (req.user.role !== "manager") {
    return res.status(403).json({
      success: false,
      message: "Access denied — managers only",
    });
  }
  next();
};

export default managerOnly;
