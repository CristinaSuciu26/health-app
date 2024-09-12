import RefreshToken from "../models/refreshToken.js";
import User from "../models/user.js";

const findUserByEmail = async (email) => {
  return await User.findOne({ email }).exec();
};

const createUser = async (userData) => {
  const user = new User(userData);
  return await user.save();
};

const updateUserToken = async (userId, token) => {
  return await User.findByIdAndUpdate(userId, { token }, { new: true }).exec();
};

const getUserById = async (userId) => {
  return await User.findById(userId).exec();
};

export const createRefreshToken = async (userId, token) => {
  return await RefreshToken.create({
    userId,
    token,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });
};

export const findRefreshToken = async (token) => {
  return await RefreshToken.findOne({ token });
};

export const deleteRefreshToken = async (token) => {
  return await RefreshToken.deleteOne({ token });
};

const UserService = {
  findUserByEmail,
  createUser,
  updateUserToken,
  getUserById,
  createRefreshToken,
  findRefreshToken,
  deleteRefreshToken,
};
export default UserService;
