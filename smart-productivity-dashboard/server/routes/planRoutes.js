const express = require("express");

const router = express.Router();

const {
    getPlans,
    createPlan,
    deletePlan
} = require("../controllers/planController");


router.get("/", getPlans);

router.post("/", createPlan);

router.delete("/:id", deletePlan);


module.exports = router;