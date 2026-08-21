const FocusSession = require("../models/FocusSession");

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

const createFocusSession = (req, res) => {
    const newSession = {
        id:
            focusSessions.length > 0
                ? Math.max(
                      ...focusSessions.map(
                          (session) => session.id
                      )
                  ) + 1
                : 1,

        duration: req.body.duration,

        createdAt: new Date()
    };

    focusSessions.push(newSession);

    res.status(201).json({
        message: "Focus session added successfully",
        session: newSession
    });
};

module.exports = {
    getFocusSessions,
    createFocusSession
};