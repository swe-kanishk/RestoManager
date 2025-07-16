import sharp from "sharp";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import EmployeeModel from "../models/employee.model.js";
import { getPublicIdFromUrl } from "../utils/getPublicIdFromURL.js";
import { v4 as uuidv4 } from "uuid";
import path from "path";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CONFIG_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_CONFIG_API_KEY,
  api_secret: process.env.CLOUDINARY_CONFIG_API_SECRET,
  secure: true,
});

export const addEmployeeController = async (req, res) => {
  try {
    const { fullName, salary } = req.body;

    if (!fullName) {
      return res.status(400).json({
        message: "Please provide employee full name.",
        error: true,
        success: false,
      });
    }

    let avatarUrl = null;
    const files = req?.files;

    if (files && files.length > 0) {
      const originalPath = files[0].path;
      const compressedPath = path.join(
        path.dirname(originalPath),
        `${uuidv4()}_compressed.jpg`
      );

      try {
        // Compress and resize using sharp
        await sharp(originalPath)
          .resize({ width: 1000 }) // Resize to max 1000px width
          .jpeg({ quality: 70 }) // Compress to 70% quality
          .toFile(compressedPath);

        const uploaded = await cloudinary.uploader.upload(compressedPath, {
          use_filename: true,
          unique_filename: false,
          overwrite: false,
        });

        avatarUrl = uploaded.secure_url;

        // Delete both original and compressed files
        fs.unlinkSync(originalPath);
        fs.unlinkSync(compressedPath);
      } catch (uploadError) {
        console.error("Error uploading avatar:", uploadError);
        return res.status(500).json({
          message: "Failed to process or upload avatar.",
          error: true,
          success: false,
        });
      }
    }

    // Create employee
    const employee = new EmployeeModel({
      fullName,
      salary,
      avatar: avatarUrl,
    });

    await employee.save();

    return res.status(200).json({
      success: true,
      error: false,
      message: "Employee added successfully!",
      data: employee,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const updateUserDetails = async (req, res) => {
  try {
    const userId = req.userId;
    const { fullName, email, mobile, password } = req.body;
    const userExist = await UserModel.findById(userId);
    if (!userExist) return res.status(400).send("User cannot be updated!");

    let verifyOTP = "";
    if (email !== userExist.email) {
      verifyOTP = Math.floor(100000 + Math.random() * 900000).toString();
    }

    let hashPassword = "";
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashPassword = await bcrypt.hash(password, salt);
    } else {
      hashPassword = userExist.password;
    }

    const updateUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        fullName,

        mobile,
        email,
        verify_email: email !== userExist.email ? false : true,
        password: hashPassword,
        otp: verifyOTP !== "" ? verifyOTP : null,
        otpExpires: verifyOTP !== "" ? Date.now() + 600000 : "",
      },
      { new: true }
    );

    if (email !== userExist.email) {
      await sendEmailFun({
        to: email,
        subject: "verify email from ClickMart App",
        text: "",
        html: verifyEmailTemplate({ fullName, otp: verifyOTP }),
      });
    }

    return res.json({
      message: "User updated successfully!",
      error: false,
      success: true,
      user: {
        fullName: updateUser?.fullName,
        email: updateUser?.email,
        _id: updateUser?._id,
        mobile: updateUser?.mobile,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const getEmployees = async (req, res) => {
  try {
    const employees = await EmployeeModel.find();
    return res.json({
      employees,
      success: true,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const removeEmployeeController = async (req, res) => {
  try {
    const { employeeId } = req.params;

    if (!employeeId) {
      return res.status(400).json({
        message: "Please provide employee ID.",
        error: true,
        success: false,
      });
    }

    // Find employee by ID
    const employee = await EmployeeModel.findById(employeeId);
    if (!employee) {
      return res.status(404).json({
        message: "Employee not found.",
        error: true,
        success: false,
      });
    }

    // Delete avatar from Cloudinary if exists
    if (employee.avatar) {
      try {
        const publicId = getPublicIdFromUrl(employee.avatar);
        await cloudinary.uploader.destroy(publicId);
      } catch (cloudErr) {
        console.error("Error deleting avatar from Cloudinary:", cloudErr);
        // Continue even if avatar deletion fails
      }
    }

    // Delete employee from database
    await EmployeeModel.findByIdAndDelete(employeeId);

    return res.status(200).json({
      success: true,
      error: false,
      message: "Employee removed successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
};

export const editEmployeeController = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { fullName, salary } = req.body;
    const files = req?.files;

    // Validate ID
    if (!employeeId) {
      return res.status(400).json({
        message: "Employee ID is required.",
        error: true,
        success: false,
      });
    }

    // Validate fields
    if (!fullName || !salary) {
      return res.status(400).json({
        message: "Employee full name and salary are required.",
        error: true,
        success: false,
      });
    }

    const employee = await EmployeeModel.findById(employeeId);
    if (!employee) {
      return res.status(404).json({
        message: "Employee not found.",
        error: true,
        success: false,
      });
    }

    let avatarUrl = employee.avatar;

    // Handle avatar update if new image is uploaded
    if (files && files?.length > 0) {
      const originalPath = files[0].path;
      const compressedPath = path.join(
        path.dirname(originalPath),
        `${uuidv4()}_compressed.jpg`
      );

      try {
        await sharp(originalPath)
          .resize({ width: 1000 })
          .jpeg({ quality: 70 })
          .toFile(compressedPath);

        const uploaded = await cloudinary.uploader.upload(compressedPath, {
          use_filename: true,
          unique_filename: false,
          overwrite: false,
        });

        avatarUrl = uploaded.secure_url;

        // Delete previous avatar from Cloudinary
        if (employee.avatar) {
          const publicId = getPublicIdFromUrl(employee.avatar);
          await cloudinary.uploader.destroy(publicId);
        }

        // Delete local files
        fs.unlinkSync(originalPath);
        fs.unlinkSync(compressedPath);
      } catch (err) {
        console.error("Avatar upload failed:", err);
        return res.status(500).json({
          message: "Failed to update avatar.",
          error: true,
          success: false,
        });
      }
    }

    // Update employee
    const updatedEmployee = await EmployeeModel.findByIdAndUpdate(
      employeeId,
      {
        fullName,
        salary,
        avatar: avatarUrl,
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      error: false,
      message: "Employee updated successfully!",
      data: updatedEmployee,
    });
  } catch (error) {
    console.error("Edit employee error:", error);
    return res.status(500).json({
      message: error.message || "Something went wrong.",
      error: true,
      success: false,
    });
  }
};
