const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY;
const { decrypt, getKey } = require("../services/key.js");

const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ message: "Token is required" });

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
};

// validate api key
const validateKey = async (req, res, next) => {
  const keyFromClient = req.headers["x-api-key"];

  if (!keyFromClient) {
    return res.status(401).json({ message: "API key is required" });
  }

  const apiKey = await getKey();
  if (!apiKey) {
    return res.status(404).json({ message: "API key not found" });
  }

  const decryptedKey = decrypt(apiKey);
  if (keyFromClient !== decryptedKey) {
    return res.status(403).json({ message: "Invalid API key" });
  }

  next();
};

exports.authenticateToken = authenticateToken;
exports.validateKey = validateKey;
