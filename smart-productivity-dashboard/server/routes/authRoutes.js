const express = require("express");

const router = express.Router();

const {
    registerUser
} = require("../controllers/authController");

const {
    registerUser,
    loginUser
} = require("../controllers/authController");

module.exports = router;