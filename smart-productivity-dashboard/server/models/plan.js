const mongoose = require("mongoose");

const planSchema = new mongoose.Schema(
    {
        time: {
            type: String,
            required: true
        },

        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            trim: true,
            default: ""
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

module.exports = mongoose.model("Plan", planSchema);