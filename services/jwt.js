const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY;

// create session
const createCookie = (userId, name, email, role) => {
  if (userId === undefined || role === undefined) {
    throw new Error("userId and role must be specified");
  }

  try {
    const token = jwt.sign(
      { user_id: userId, name: name, email: email, role: role },
      secretKey,
      { expiresIn: "1h" }
    );

    return token;
  } catch (error) {
    console.error("Cannot create user session", error.message);
    throw new Error("Cannot create user session", error.message);
  }
};

// decrypt session
const verifyCookie = (token) => {
  if (token === undefined) {
    throw new Error("token must be specified");
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    return {
      loggedIn: true,
      result: decoded,
    };
  } catch (error) {
    console.log(error.message);
    return {
      loggedIn: false,
      result: null,
    };
  }
};

const getDataUser = (req) => {
  const header = req.headers["authorization"];

  try {
    const token = header.startsWith("Bearer ") ? header.split(" ")[1] : header;

    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (error) {
    console.error("Cannot decode user session", error.message);
    throw new Error("Cannot decode user session", error.message);
  }

  return null;
};

exports.createCookie = createCookie;
exports.verifyCookie = verifyCookie;
exports.getDataUser = getDataUser;
