let plans = [];

const getPlans = (req, res) => {
    res.json(plans);
};

const createPlan = (req, res) => {
    const newPlan = {
        id: plans.length > 0
            ? Math.max(...plans.map(plan => plan.id)) + 1
            : 1,
        time: req.body.time,
        title: req.body.title,
        description: req.body.description
    };

    plans.push(newPlan);

    res.status(201).json({
        message: "Plan added successfully",
        plan: newPlan
    });
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

module.exports = {
    getPlans,
    createPlan,
    deletePlan
};