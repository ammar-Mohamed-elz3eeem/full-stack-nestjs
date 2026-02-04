import mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  passwordResetToken: { type: String, required: false },
  passwordResetExpires: { type: Date, required: false },
  otpToken: { type: String, required: false },
  otpExpires: { type: Date, required: false },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
});

const User = mongoose.model('User', UserSchema);

export default User;
