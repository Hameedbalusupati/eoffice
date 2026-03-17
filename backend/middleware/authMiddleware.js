const { verifyToken } = require("../config/jwt");

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ msg: "No token provided" });
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ msg: "Invalid token" });
  }

  req.user = decoded;
  next();
};

module.exports = authMiddleware;