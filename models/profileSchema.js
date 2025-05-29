const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    balance: { type: Number, default: 1000 },
    lastDiveTimestamp: {type: Number, default: 0 },
    inventory: { type: Map, of: Number, default: {} },
});

const model = mongoose.model("DiscordBank", profileSchema);

module.exports = model; 