const router = require("express").Router();
const getModules = require("../controllers/moduleController");

router.get("/", getModules);

module.exports = router;
