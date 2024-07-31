/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
import jwt from "jsonwebtoken";
import User from "./../schemas/user.js";

const JWT_SECRET = "hvdvay6ert72839289";

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (token) {
      const decodedToken = jwt.verify(token, JWT_SECRET);
      const resp = await User.findById(decodedToken.userId).select(
        "isAdmin email"
      );
      req.user = {
        email: resp.email,
        isAdmin: resp.isAdmin,
        userId: decodedToken.userId,
      };
      next();
      //return res.status(400).json({ message: "Success" });
    } else {
      return res.status(401).json({ status: false, message: "Token not found" });
    }
  } catch (err) {
    return res.status(401).json({ status: false, message: "Invalid Token" });
  }
};

export const testingApis = async (req, res, next) => {
  // Log the request and response details, including cookies from the request
  const msg = res.cookies;

  //const msg = `RES STATUS:${res.statusCode}, REQ COOKIES:${req.cookie}`;
  return res.status(401).json({ msg });
};

const isAdminRoute = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    return res.status(401).json({
      status: false,
      message: "Not authorized as admin. Try login as admin.",
    });
  }
};

export { isAdminRoute, protectRoute };
