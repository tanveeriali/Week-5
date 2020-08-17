const { Router } = require("express");
const mongoose = require("mongoose");
const router = Router();
const userDAO = require("../daos/user");
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
router.use(authorizationCheck);

const adminCheck = async (req, res, next) => {
  if (req.user.roles.includes("admin")) {
    next();
  } else {
    res.sendStatus(403);
  }
};

router.post("/", adminCheck, async (req, res, next) => {
  const { title, price } = req.body;
  const item = await itemsDAO.create(title, price);
  if (item) {
    res.json(item);
  } else {
    res.sendStatus(401);
  }
});

router.put("/:id", adminCheck, async (req, res, next) => {
  const itemId = req.params.id;
  const { title, price } = req.body;
  const item = await itemsDAO.updateItemById(itemId, title, price);
  if (item) {
    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }
});

router.get("/", async (req, res, next) => {
  const items = await itemsDAO.getAllItems();
  if (items) {
    res.json(items);
  } else {
    res.sendStatus(401);
  }
});

router.get("/:id", async (req, res, next) => {
  const itemId = req.params.id;
  const item = await itemsDAO.getItemById(itemId);
  if (item) {
    res.json(item);
  } else {
    res.sendStatus(401);
  }
});

module.exports = router;
