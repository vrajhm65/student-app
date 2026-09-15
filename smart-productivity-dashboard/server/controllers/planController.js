const Plan = require("../models/Plan");

const getPlans = async (req, res) => {
  try {
    const plans = await Plan.find({ user: req.userId }).sort({ createdAt: 1 });

    res.json(
      plans.map((plan) => ({
        id: plan._id.toString(),
        time: plan.time,
        title: plan.title,
        completed: plan.completed,
      }))
    );
  } catch (error) {
    console.error("Error fetching plans:", error);
    res.status(500).json({ message: "Failed to fetch plans" });
  }
};

const createPlan = async (req, res) => {
  try {
    const { time, title } = req.body;

    if (!time || !title) {
      return res.status(400).json({
        message: "Time and title are required",
      });
    }

    const plan = await Plan.create({
      time,
      title,
      completed: false,
      user: req.userId,
    });

    res.status(201).json({
      message: "Plan created successfully",
      plan: {
        id: plan._id.toString(),
        time: plan.time,
        title: plan.title,
        completed: plan.completed,
      },
    });
  } catch (error) {
    console.error("Error creating plan:", error);
    res.status(500).json({ message: "Failed to create plan" });
  }
};

const updatePlan = async (req, res) => {
  try {
    const plan = await Plan.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    if (req.body.time !== undefined) {
      plan.time = req.body.time;
    }

    if (req.body.title !== undefined) {
      plan.title = req.body.title;
    }

    if (req.body.completed !== undefined) {
      plan.completed = req.body.completed;
    }

    await plan.save();

    res.json({
      message: "Plan updated successfully",
      plan: {
        id: plan._id.toString(),
        time: plan.time,
        title: plan.title,
        completed: plan.completed,
      },
    });
  } catch (error) {
    console.error("Error updating plan:", error);
    res.status(500).json({ message: "Failed to update plan" });
  }
};

const deletePlan = async (req, res) => {
  try {
    const plan = await Plan.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    res.json({ message: "Plan deleted successfully" });
  } catch (error) {
    console.error("Error deleting plan:", error);
    res.status(500).json({ message: "Failed to delete plan" });
  }
};

module.exports = {
  getPlans,
  createPlan,
  updatePlan,
  deletePlan,
};