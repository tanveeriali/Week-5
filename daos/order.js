const mongoose = require("mongoose");

const Order = require("../models/order");

module.exports = {};

module.exports.create = async (userId, items, total) => {
  try {
    const newOrder = await Order.create({
      userId: userId,
      items: items,
      total: total,
    });
    return newOrder;
  } catch (e) {
    throw e;
  }
};

module.exports.getUserOrders = async (userId) => {
  try {
    const order = await Order.find({ userId: userId }).lean();
    return order;
  } catch (e) {
    throw e;
  }
};

module.exports.getOrders = async () => {
  try {
    const orders = await Order.find({}).lean();
    return orders;
  } catch (e) {
    throw e;
  }
};
module.exports.orderBelongsToUser = async (orderId, userId) => {
  try {
    const orderUser = await Order.find({ _id: orderId, userId: userId }).lean();
    return orderUser;
  } catch (e) {
    throw e;
  }
};
module.exports.getOrderId = async (orderId) => {
  const order = await Order.aggregate([
    { $match: { _id: mongoose.Types.ObjectId(orderId) } },
    {
      $lookup: {
        from: "items",
        localField: "items",
        foreignField: "_id",
        as: "items",
      },
    },
    {
      $project: {
        "items.price": 1,
        "items.title": 1,
        total: 1,
        userId: 1,
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
  ]);
  return order[0];
};
