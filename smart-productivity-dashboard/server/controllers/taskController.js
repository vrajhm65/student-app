const Task = require("../models/task");


// GET ALL TASKS
const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({
            user: req.userId
        }).sort({ createdAt: -1 });

        res.json(
            tasks.map((task) => ({
                id: task._id.toString(),
                title: task.title,
                completed: task.completed,
                completedAt: task.completedAt
            }))
        );
    } catch (error) {
        console.error("Error fetching tasks:", error);

        res.status(500).json({
            message: "Failed to fetch tasks"
        });
    }
};


// GET ONE TASK
const getTaskById = async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            user: req.userId
        });

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.json({
            id: task._id.toString(),
            title: task.title,
            completed: task.completed,
            completedAt: task.completedAt
        });
    } catch (error) {
        console.error("Error fetching task:", error);

        res.status(500).json({
            message: "Failed to fetch task"
        });
    }
};


// CREATE TASK
const createTask = async (req, res) => {
    try {
        const { title } = req.body;

        if (!title) {
            return res.status(400).json({
                message: "Task title is required"
            });
        }

        const task = await Task.create({
            title,
            completed: false,
            completedAt: null,
            user: req.userId
        });

        res.status(201).json({
            message: "Task created successfully",
            task: {
                id: task._id.toString(),
                title: task.title,
                completed: task.completed,
                completedAt: task.completedAt
            }
        });
    } catch (error) {
        console.error("Error creating task:", error);

        res.status(500).json({
            message: "Failed to create task"
        });
    }
};


// UPDATE TASK
const updateTask = async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            user: req.userId
        });

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        task.title = req.body.title ?? task.title;

        if (req.body.completed !== undefined) {
            task.completed = req.body.completed;

            if (req.body.completed === true) {
                task.completedAt = new Date();
            } else {
                task.completedAt = null;
            }
        }

        await task.save();

        res.json({
            message: "Task updated successfully",
            task: {
                id: task._id.toString(),
                title: task.title,
                completed: task.completed,
                completedAt: task.completedAt
            }
        });
    } catch (error) {
        console.error("Error updating task:", error);

        res.status(500).json({
            message: "Failed to update task"
        });
    }
};


// DELETE TASK
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            user: req.userId
        });

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.json({
            message: "Task deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting task:", error);

        res.status(500).json({
            message: "Failed to delete task"
        });
    }
};


module.exports = {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
};