const Plan = require("../models/plan");
let plans = [];

const getPlans = async (req, res) => {
    try {
        const plans = await Plan.find();

        const formattedPlans = plans.map((plan) => ({
            id: plan._id.toString(),
            time: plan.time,
            title: plan.title,
            description: plan.description,
            completed: plan.completed
        }));

        res.json(formattedPlans);

    } catch (error) {
        console.error("Error fetching plans:", error);

        res.status(500).json({
            message: "Failed to fetch plans"
        });
    }
};

const createPlan = async (req, res) => {
    try {
        const newPlan = await Plan.create({
            time: req.body.time,
            title: req.body.title,
            description: req.body.description,
            completed: false
        });

        res.status(201).json({
            message: "Plan added successfully",
            plan: {
                id: newPlan._id.toString(),
                time: newPlan.time,
                title: newPlan.title,
                description: newPlan.description,
                completed: newPlan.completed
            }
        });

    } catch (error) {
        console.error("Error creating plan:", error);

        res.status(500).json({
            message: "Failed to create plan"
        });
    }
};

const deletePlan = (req, res) => {
    const planId = Number(req.params.id);

    const index = plans.findIndex(
        (plan) => plan.id === planId
    );

    if (index === -1) {
        return res.status(404).json({
            message: "Plan not found"
        });
    }

    plans.splice(index, 1);

    res.json({
        message: "Plan deleted successfully"
    });
};

const updatePlan = async (req, res) => {
    try {
        const plan = await Plan.findById(req.params.id);

        if (!plan) {
            return res.status(404).json({
                message: "Plan not found"
            });
        }

        plan.time = req.body.time ?? plan.time;
        plan.title = req.body.title ?? plan.title;
        plan.description = req.body.description ?? plan.description;
        plan.completed = req.body.completed ?? plan.completed;

        await plan.save();

        res.json({
            message: "Plan updated successfully",
            plan: {
                id: plan._id.toString(),
                time: plan.time,
                title: plan.title,
                description: plan.description,
                completed: plan.completed
            }
        });

    } catch (error) {
        console.error("Error updating plan:", error);

        res.status(500).json({
            message: "Failed to update plan"
        });
    }
};

module.exports = {
    getPlans,
    createPlan,
    deletePlan,
    updatePlan
}