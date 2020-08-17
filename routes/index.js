const { Router } = require("express");
const router = Router();

router.use("/items", require("./items"));
router.use("/login", require("./login"));
router.use("/orders", require("./orders"));

module.exports = router;
