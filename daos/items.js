const mongoose = require("mongoose");
const Item = require("../models/item");

module.exports = {};

module.exports.create = async (title, price) => {
  try {
    const newItem = await Item.create({
      title: title,
      price: price,
    });
    return newItem;
  } catch (e) {
    throw e;
  }
};

module.exports.updateItemById = async (itemId, title, price) => {
  const item = await Item.updateOne({
    _id: itemId,
    title: title,
    price: price,
  });
  if (item) {
    return item;
  } else {
    return false;
  }
};

module.exports.getAllItems = async () => {
  const items = await Item.find();
  if (items) {
    return items;
  } else {
    return false;
  }
};

module.exports.getItemById = async (itemId) => {
  const item = await Item.findOne({ _id: itemId });
  if (item) {
    return item;
  } else {
    return false;
  }
};

module.exports.getTotalPrice = async (items) => {
  var total = 0;
  for (let i = 0; i < items.length; i++) {
    if (!mongoose.Types.ObjectId.isValid(items[i])) {
      return false;
    } else {
      const item = await Item.findOne({ _id: items[i] });
      total += item.price;
    }
  }
  return total;
};

class BadDataError extends Error {}
module.exports.BadDataError = BadDataError;
