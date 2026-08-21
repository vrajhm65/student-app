const Task = require("../models/task");


const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find();

        const formattedTasks = tasks.map((task) => ({
            id: task._id.toString(),
            title: task.title,
            completed: task.completed
        }));

        res.json(formattedTasks);
    } catch (error) {
        console.error("Error fetching tasks:", error);

        res.status(500).json({
            message: "Failed to fetch tasks"
        });
    }
};

const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.json({
            id: task._id.toString(),
            title: task.title,
            completed: task.completed
        });

    } catch (error) {
        console.error("Error fetching task:", error);

        res.status(500).json({
            message: "Failed to fetch task"
        });
    }
};

const createTask = async (req, res) => {
    try {
        const newTask = await Task.create({
            title: req.body.title,
            completed: false
        });

       res.status(201).json({
    message: "Task added successfully",
    task: {
        id: newTask._id.toString(),
        title: newTask.title,
        completed: newTask.completed
    }
});
    } catch (error) {
        console.error("Error creating task:", error);

        res.status(500).json({
            message: "Failed to create task"
        });
    }
};

const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        task.title = req.body.title ?? task.title;
        task.completed = req.body.completed ?? task.completed;

        await task.save();

        res.json({
            message: "Task updated successfully",
            task: {
                id: task._id.toString(),
                title: task.title,
                completed: task.completed
            }
        });

    } catch (error) {
        console.error("Error updating task:", error);

        res.status(500).json({
            message: "Failed to update task"
        });
    }
};

const deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);

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


module.exports={
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
};

