const { Router } = require("express");
const router = Router();
const bcrypt = require("bcrypt");
const userDAO = require("../daos/user");
const jwt = require("jsonwebtoken");
const secret = "shhhhhh do not tell anyone this secret";

const authorizationCheck = async (req, res, next) => {
  let header = req.headers.authorization;
  if (!header) {
    res.sendStatus(401);
  } else {
    const token = header.split(" ")[1];
    const userCheck = jwt.verify(token, secret, (e, tokenNew) => {
      if (e) {
        res.sendStatus(401);
      } else {
        req.user = tokenNew;
        next();
      }
    });
  }
};

// Create a new user
router.post("/signup", async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password || password === "") {
    res.status(400).send("You need both an email and a password.");
  } else {
    const userCheck = await userDAO.getUser(email);
    if (userCheck) {
      res.status(409).send("Email has already been registered.");
    }
    try {
      const user = await userDAO.create(email, password);
      if (user) {
        res.json(user);
      }
    } catch (e) {
      next(e);
    }
  }
});

// Login
router.post("/", async (req, res, next) => {
  const { email, password } = req.body;
  const user = await userDAO.getUser(email);
  if (!user) {
    res.status(401).send("A user with that email doesn't exist");
  } else {
    if (!password || password === "") {
      res.status(400).send("You didn't provide a password.");
    } else {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        res.status(401).send("That password is incorrect");
      } else {
        const userWithoutPassword = await userDAO.getUserExceptPassword(email);
        const token = jwt.sign(userWithoutPassword.toJSON(), secret, {
          expiresIn: "2h",
        });
        res.json({ token });
      }
    }
  }
});

// Change password
router.post("/password", authorizationCheck, async (req, res, next) => {
  const { email } = req.user;
  const { password } = req.body;
  if (!password || password === "") {
    res.status(400).send("You didn't provide a password.");
  } else {
    try {
      const newPassword = await userDAO.changePassword(email, password);
      res.sendStatus(200);
    } catch (e) {
      res.sendStatus(401);
    }
  }
});

module.exports = router;
