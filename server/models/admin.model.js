import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      default: process.env.ADMIN_EMAIL,
    },
    last_login_date: {
      type: Date,
    },
  },
  { timestamps: true }
);

const AdminModel = mongoose.model('Admin', adminSchema);
export default AdminModel;
