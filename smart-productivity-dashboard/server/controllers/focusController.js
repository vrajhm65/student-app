let focusSessions = [];

const getFocusSessions = (req, res) => {
    res.json(focusSessions);
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