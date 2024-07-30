/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
import jwt from "jsonwebtoken";
import User from './../schemas/user.js';

const protectRoute = async (req, res, next) => {
    try{
        let token = req.cookie.token;
        if(token){
            const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
            const resp = await User.findById(decodedToken.userId).select("isAdmin email");

            req.user = {
                email : resp.email,
                isAdmin: resp.isAdmin,
                userId: decodedToken.userId
            }

            next();
        }
        else {
            return res
              .status(401)
              .json({ status: false, message: "Not authorized. Try login again." });
        }
    }
    catch(err){
        console.log('error', err);
        return res.status(401).json({status:false, message:"Not authorized. Log in again"});
    }
}

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
  