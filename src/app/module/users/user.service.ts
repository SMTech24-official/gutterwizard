import { Payload } from './../../../../node_modules/aws-sdk/clients/athena.d';
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { IUser } from "./user.interface";
import { User } from "./user.model";
import * as argon2 from "argon2";
import { sendEmail } from "../../utils/sendEmail";
import { Request } from "express";
import { fileUploader } from '../../helpers/fileUploads';
interface UserPayload {
  fullName?: string;
  username?: string;
  email?: string;
  password?: string;
  profileImage?:string;
}

const createUser = async (payload: IUser) => {
  payload.password = await argon2.hash(payload.password);
  // Generate a 6-digit OTP

  const result = await User.create(payload);
  if (!result) {
    throw new AppError(httpStatus.NOT_ACCEPTABLE, "User create failed");
  }

  const { password, ...rest } = result.toObject();
  return rest;
};
const createAdmin = async (req:Request) => {
  if (!req.body.data){
    throw new AppError(httpStatus.BAD_REQUEST, 'Missing required data');
  }
  let payload=JSON.parse(req.body.data);
  const files=req.file as any
  const plainPass = payload.password;
  payload.password = await argon2.hash(payload.password);
  payload.role = "admin";
  payload.isVerified = true;
if(files){
    const uploadImage=await fileUploader.uploadToDigitalOcean(files)
  payload.profileImage=uploadImage?.Location||""
}

  const result = await User.create(payload);
  if (!result) {
    throw new AppError(httpStatus.NOT_ACCEPTABLE, "Admin create failed");
  }
  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .email-container {
      background-color: #ffffff;
      max-width: 600px;
      margin: 20px auto;
      border: 1px solid #ddd;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      animation: fadeIn 1.5s ease-out;
    }
    .email-header {
      background-color: #007bff;
      color: #ffffff;
      padding: 15px 20px;
      text-align: center;
      font-size: 18px;
      font-weight: bold;
    }
    .email-body {
      padding: 20px;
      color: #333;
      line-height: 1.6;
    }
    .email-footer {
      text-align: center;
      font-size: 12px;
      color: #777;
      padding: 10px 20px;
      border-top: 1px solid #ddd;
    }
    .highlight {
      color: #007bff;
      font-weight: bold;
    }
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .cta-button {
      display: inline-block;
      margin-top: 20px;
      padding: 10px 15px;
      background-color: #007bff;
      color: #ffffff;
      text-decoration: none;
      border-radius: 5px;
      font-weight: bold;
      transition: background-color 0.3s ease;
    }
    .cta-button:hover {
      background-color: #0056b3;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      Welcome to Admin Dashboard!
    </div>
    <div class="email-body">
      <p>Dear Admin,</p>
      <p>Congratulations! You are now an administrator for our platform. Below are your login credentials:</p>
      <p>Email: <span class="highlight">${payload.email}</span></p>
      <p>Password: <span class="highlight">${plainPass}</span></p>
    </div>
    <div class="email-footer">
      If you have any issues, feel free to contact our support team. <br>
      &copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.
    </div>
  </div>
</body>
</html>
`;
  await sendEmail(result.email, html, "Your Admin Credentials");
  const { password, ...rest } = result.toObject();
  return rest;
};
const activeAccount = async (id: any) => {
  const user = await User.findOne({ _id: id });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not Found");
  }
  if (user?.isVerified) {
    throw new AppError(httpStatus.CONFLICT, "You account is already activated");
  }
  await User.findOneAndUpdate({ _id: id }, { isActive: true });
  return { message: "Your account active successfully" };
};
const updateProfile = async (req: Request) => {
  if (!req.body.data) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Missing required data');
  }

  let payload:UserPayload = JSON.parse(req.body.data);
  const files = req.file as any;

  // If the password is included in the request, hash it
  if (payload.password) {
    const plainPass = payload.password;
    payload.password = await argon2.hash(payload.password);
  }

  // If a new profile image is uploaded, handle the file upload
  if (files) {
    const uploadImage = await fileUploader.uploadToDigitalOcean(files);
    payload.profileImage = uploadImage?.Location || "";
  }

  // Assuming `User` is the model representing the logged-in user
  const userId = req.user.userId; // Get the current user's ID from the request (for example, from JWT token)
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  let updateDoc:UserPayload={}

  if(payload.username){
    updateDoc.username=payload.username
  }
  // if(payload.email){
  //   updateDoc.email=payload.email
  // }
  if(payload.password){
    updateDoc.password=payload.password
  }
  if(payload.profileImage){
    updateDoc.profileImage=payload.profileImage
  }
  if(payload.fullName){
    updateDoc.fullName=payload.fullName
  }
  // Update the user's profile with the new data
  const updatedUser = await User.findByIdAndUpdate(userId, updateDoc, { new: true });

  if (!updatedUser) {
    throw new AppError(httpStatus.NOT_ACCEPTABLE, 'Profile update failed');
  }

  // Return updated user data excluding the password
  const { password, ...rest } = updatedUser.toObject();
  return rest;
};

export const userServices = {
  createUser,
  activeAccount,
  createAdmin,
  updateProfile
};
