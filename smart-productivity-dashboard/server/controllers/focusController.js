const FocusSession = require("../models/focusSession");

const getFocusSessions = async (req, res) => {
    try {
        const sessions = await FocusSession.find().sort({
            createdAt: -1
        });

        const formattedSessions = sessions.map((session) => ({
            id: session._id.toString(),
            duration: session.duration,
            createdAt: session.createdAt
        }));

        res.json(formattedSessions);

    } catch (error) {
        console.error("Error fetching focus sessions:", error);

        res.status(500).json({
            message: "Failed to fetch focus sessions"
        });
    }
};

const createFocusSession = async (req, res) => {
    try {
        const newSession = await FocusSession.create({
            duration: req.body.duration
        });

        res.status(201).json({
            message: "Focus session added successfully",
            session: {
                id: newSession._id.toString(),
                duration: newSession.duration,
                createdAt: newSession.createdAt
            }
        });

    } catch (error) {
        console.error("Error creating focus session:", error);

        res.status(500).json({
            message: "Failed to create focus session"
        });
    }
};

module.exports = {
    getFocusSessions,
    createFocusSession
};