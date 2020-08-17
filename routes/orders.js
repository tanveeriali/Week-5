const { Router } = require("express");
const router = Router();
const ordersDAO = require("../daos/order");
const itemsDAO = require("../daos/items");
const secret = "shhhhhh do not tell anyone this secret";
const jwt = require("jsonwebtoken");

const authorizationCheck = async (req, res, next) => {
  let header = req.headers.authorization;
  if (!header) {
    res.sendStatus(401);
  } else {
    const token = header.split(" ")[1];
    const user = jwt.verify(token, secret, (err, tokenNew) => {
      if (err) {
        res.sendStatus(401);
      } else {
        req.user = tokenNew;
        next();
      }
    });
  }
};

// Create an order
router.post("/", authorizationCheck, async (req, res, next) => {
  const userId = req.user._id;
  const items = req.body;
  const total = await itemsDAO.getTotalPrice(items);
  if (total) {
    const order = await ordersDAO.create(userId, items, total);
    if (order) {
      res.json(order);
    } else {
      res.sendStatus(404);
    }
  } else {
    res.sendStatus(400);
  }
});

// Get all orders
router.get("/", authorizationCheck, async (req, res, next) => {
  if (req.user.roles.includes("admin") == true) {
    // get all orders
    const orders = await ordersDAO.getOrders();
    if (orders) {
      res.json(orders);
    } else {
      res.sendStatus(404);
    }
  } else {
    // get orders of that user
    const userId = req.user._id;
    const userOrder = await ordersDAO.getUserOrders(userId);
    if (userOrder) {
      res.json(userOrder);
    } else {
      res.sendStatus(404);
    }
  }
});

// Get a specific order
router.get("/:id", authorizationCheck, async (req, res, next) => {
  const orderId = req.params.id;
  if (req.user.roles.includes("admin") == true) {
    const order = await ordersDAO.getOrderId(orderId);
    if (order) {
      res.json(order);
    } else {
      res.sendStatus(404);
    }
  } else {
    const userId = req.user._id;
    const orderBelongsToUser = await ordersDAO.orderBelongsToUser(
      orderId,
      userId
    );
    if (orderBelongsToUser.length !== 0) {
      const userOrder = await ordersDAO.getOrderId(orderId);
      res.json(userOrder);
    } else {
      res.sendStatus(404);
    }
  }
});

module.exports = router;
