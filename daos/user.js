const mongoose = require("mongoose");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const salt = 10;

module.exports = {};

module.exports.create = async (email, password) => {
  const passwordHash = await bcrypt.hash(password, 10);
  try {
    const newUser = await User.create({
      email: email,
      password: passwordHash,
      roles: ["user"],
    });
    return newUser;
  } catch (e) {
    throw e;
  }
};

module.exports.getUser = async (email) => {
  try {
    const user = await User.findOne({ email: email });
    return user;
  } catch (e) {
    throw e;
  }
};

module.exports.getUserExceptPassword = async (email) => {
  try {
    const user = await User.findOne(
      { email: email },
      { _id: 1, email: 1, roles: 1 }
    );
    return user;
  } catch (e) {
    throw e;
  }
};

module.exports.changePassword = async (email, password) => {
  try {
    const newPasswordHash = await bcrypt.hash(password, 10);
    const updatedUser = User.updateOne(
      { email: email },
      { password: newPasswordHash }
    );
    return updatedUser;
  } catch (e) {
    throw e;
  }
};
class BadDataError extends Error {}
module.exports.BadDataError = BadDataError;
