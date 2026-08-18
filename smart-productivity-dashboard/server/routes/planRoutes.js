const express = require("express");

const router = express.Router();

const {
    getPlans,
    createPlan,
    deletePlan,
    updatePlan
} = require("../controllers/planController");


router.get("/", getPlans);

router.post("/", createPlan);

router.delete("/:id", deletePlan);

router.put("/:id", updatePlan);


module.exports = router;