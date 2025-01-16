const express = require("express");
const { createOrUpdateUser } = require("../controllers/auth");

const router = express.Router();

router.get("/create-or-update-user", createOrUpdateUser);

module.exports = router;
