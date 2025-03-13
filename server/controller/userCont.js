/* eslint-disable no-unused-vars */
import { response } from "express";
import User from "../schemas/user.js";
import { createJWT } from "../components/index.js";
import Notif from "./../schemas/notifications.js";
import transporter from "./../components/nodeMailerConfig.js";
import jwt from "jsonwebtoken";
import Task from "../schemas/tasks.js";
import dotenv  from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const JWT_SECRET = process.env.JWT;

const baseurl = process.env.BASE_APP_URL;

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExist = await User.findOne({ email });

    if (userExist) {
      return res.status(400).json({
        status: false,
        message: "User already exists",
      });
    }
    const isAdmin = true;

    const user = await User.create({
      name,
      email,
      password,
      isAdmin,
      role,
    });

    if (user) {
      //isAdmin ? createJWT(res, user._id) : null;

      user.password = undefined;

      res.status(201).json(user);
    } else {
      return res
        .status(400)
        .json({ status: false, message: "Invalid user data" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .json({ status: false, message: "Invalid email or password." });
    }

    const isMatch = await user.matchPassword(password);

    // if(isAdmin){
    createJWT(res, user._id);
    //}

    if (user && isMatch) {
      //isAdmin is added to make sure JWT is generated for members updated as admins

      user.password = undefined;

      res.status(200).json(user);
    } else {
      return res
        .status(401)
        .json({ status: false, message: "Invalid email or password" });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message, error: "Failed" });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.cookie("token", "", {
      htttpOnly: true,
      expires: new Date(0),
    });

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: error.message });
  }
};

export const testingApis = async (req, res) => {
  // Log the request and response details, including cookies from the request
  const { userId, isAdmin } = req.user;
  const { _id } = req.body;
  //const msg = `RES STATUS:${res.statusCode}, REQ COOKIES:${req.cookie}`;
  return res
    .status(200)
    .json({ message: `Working ${userId}, ${isAdmin}, ${_id}` });
};

export const getTeamList = async (req, res) => {
  try {
    const users = await User.find().select("name role email");

    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: error.message });
  }
};

export const getNotificationsList = async (req, res) => {
  try {
    const { userId } = req.user;

    const notice = await Notif.find({
      team: userId,
      isRead: { $nin: [userId] },
    }).populate("task", "title");

    res.status(201).json(notice);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  const { userId, isAdmin } = req.user;
  const { _id } = req.body;
  const tst = req.user;

  const id =
    isAdmin && userId === _id
      ? userId
      : isAdmin && userId !== _id
        ? _id
        : userId;

  const user = await User.findById(id);

  if (user) {
    user.name = req.body.name || user.name;
    user.role = req.body.role || user.role;
    user.email = req.body.email || user.email;
    user.isAdmin = req.body.isAdmin || false;

    const updatedUser = await user.save();

    user.password = undefined;

    res.status(201).json({
      status: true,
      message: "Profile Updated Successfully.",
      user: updatedUser,
    });
    // } else {
    //   res.status(404).json({ status: false, message: "User not found" });
  } else {
    res.status(404).json({ status: false, message: "User not found" });
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    const { userId } = req.user;

    const { isReadType, id } = req.query;

    if (isReadType === "all") {
      await Notif.updateMany(
        { team: userId, isRead: { $nin: [userId] } },
        { $push: { isRead: userId } },
        { new: true }
      );
    } else {
      await Notif.findOneAndUpdate(
        { _id: id, isRead: { $nin: [userId] } },
        { $push: { isRead: userId } },
        { new: true }
      );
    }

    res.status(201).json({ status: true, message: "Done" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: error.message });
  }
};

export const changeUserPassword = async (req, res) => {
  try {
    const { userId, email } = req.user;
    const { password, oldPassword } = req.body;

    const user = await User.findOne({email});
    ///////////////////////////////////////
    const isMatch = await user.matchPassword(oldPassword);
    //const isMatch = bcrypt.compare(user.password,password);//solve the issue of bcrypt compare
    //////////////////////////////////////
    if (user) { 
      if (isMatch) {
        user.password = password;

        await user.save();

        user.password = undefined;

        res.status(201).json({
          status: true,
          message: `Password chnaged successfully.`,
        });
      } else {
        res
          .status(404)
          .json({ status: false, message: "Old password is incorrect",email });
      }
    } else {
      res.status(504).json({ status: false, message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: error.message });
  }
};

export const activateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (user) {
      user.isActive = req.body.isActive; //!user.isActive

      await user.save();

      res.status(201).json({
        status: true,
        message: `User account has been ${
          user?.isActive ? "activated" : "disabled"
        }`,
      });
    } else {
      res.status(404).json({ status: false, message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: error.message });
  }
};

export const deleteUserProfile = async (req, res) => {
  try {
    const { id } = req.body;
    await User.findByIdAndDelete(id);
    res
      .status(200)
      .json({ status: true, message: `User deleted successfully ${id}` });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: error.message });
  }
};

export const forgotUser = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ status: "User not exists" });
    }
    const secret = JWT_SECRET + user.password;
    const token = jwt.sign({ email: user.email, id: user.id }, secret, {
      expiresIn: "10m",
    });
    //const link = `http://localhost:4555/resetpass/${user._id}/${token}`;
    const link = `${baseurl}/resetpass/${user._id}/${token}`;
    const mailOptions = {
      to: email,
      subject: "Password Reset",
      text: `You requested a password reset. Use the following token to reset your password: ${link} `, // plain text body
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent to:" + info.response);
      }
    });

    res.status(201).json({
      status: "ok",
      message: "Profile Updated Successfully.",
      content: mailOptions,
    });
  } catch (error) {
    return res.json({ status: "User not found" });
  }
};

export const resetPassword = async (req, res) => {
  const { userId, token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.json({ status: "Invalid link or user not found" });
    }

    const secret = JWT_SECRET + user.password;
    try {
      const decoded = jwt.verify(token, secret);
      if (decoded.id !== userId) {
        return res.json({ status: "Invalid token" });
      }
      user.password = password;
      await user.save();

      return res.json({ message: "Reset hogayaaaaaa" });
    } catch (error) {
      return res.json({ status: "Invalid or expired token" });
    }
  } catch (error) {
    return res.json({ status: "An error occurred. Please try again later." });
  }
};

export const adduser = async (req, res) => {
  try {
    const { name, email, role, isAdmin } = req.body;

    const usrName = req.body.name;
    const usrRole = req.body.role;

    const userExist = await User.findOne({ email });

    if (userExist) {
      return res.status(400).json({
        status: false,
        message: "User already exists",
      });
    }

    const password = Math.random().toString(36).substring(2, 12);

    const user = await User.create({
      name,
      email,
      password,
      isAdmin,
      role,
    });

    const secret = JWT_SECRET + user.password;
    const token = jwt.sign({ email: user.email, id: user.id }, secret, {
      expiresIn: "10m",
    });
    //const link = `http://localhost:4555/change/${user._id}/${token}`;
    const link = `${baseurl}/change/${user._id}/${token}`;
    const mailOptions = {
      to: email,
      subject: "Account Creation",
      text: `Hello ${usrName} .Your account has been created successfully. The role assigned to you is ${usrRole} .Please use this link to create a password for your account. You must use this password to log in to the application: ${link} `, // plain text body
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent to:" + info.response);
      }
    });

    if (user) {
      //isAdmin ? createJWT(res, user._id) : null;// Don't create jwt for users updated as admins later
      //JWT will be generated when the updated users login as admins
      user.password = undefined;
      res.status(201).json(user);
    } else {
      return res
        .status(400)
        .json({ status: false, message: "Invalid user data" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: "api is working" });
  }
};

export const getUserProfile = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: `User not found ${userId}` });
    }
    res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ status: error.message, message: "Internal Server Error" });
  }
};

export const getUsers = async (req, res) => {
  const { taskId } = req.params;
  try {
    const task = await Task.findById(taskId).populate('uTeam', 'name role email');
    // const tasks = await Task.find({ _id: taskId});
    // const task = tasks[0];
    // const userIds = task.uTeam; 
    // const users = await User.find({ _id: { $in: userIds } });
    const users = task.uTeam;
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  
  }
};

export const getUserInfo = async(req,res) => {
  const {id} = req.params;
  try{
    const user = await User.findById(id);
    res.json({name:user.name, role:user.role, email:user.email});
  }
  catch(error){
    res.status(404).json({ error: error})
  }
}
