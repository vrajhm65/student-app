const {
    getTimer,
    updateTimer
} = require("../controllers/timerController");

const express = require("express");

const router = express.Router();

const {
    getFocusSessions,
    createFocusSession
} = require("../controllers/focusController");


router.get("/", getFocusSessions);

router.post("/", createFocusSession);

router.get("/timer", getTimer);

router.put("/timer", updateTimer);

module.exports = router;