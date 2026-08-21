const mongoose = require("mongoose");

const focusSessionSchema = new mongoose.Schema(
    {
        duration: {
            type: Number,
            required: true
        },

        completed: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "FocusSession",
    focusSessionSchema
);