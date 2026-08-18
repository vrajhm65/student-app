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
        description: req.body.description,
        completed: false    
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

const updatePlan = (req, res) => {
    const planId = Number(req.params.id);

    const plan = plans.find(
        (currentPlan) => currentPlan.id === planId
    );

    if (!plan) {
        return res.status(404).json({
            message: "Plan not found"
        });
    }

    plan.title = req.body.title ?? plan.title;
    plan.time = req.body.time ?? plan.time;
    plan.description = req.body.description ?? plan.description;
    plan.completed = req.body.completed ?? plan.completed;

    res.json({
        message: "Plan updated successfully",
        plan
    });
};

module.exports = {
    getPlans,
    createPlan,
    deletePlan,
    updatePlan
}