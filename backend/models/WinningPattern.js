const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const winningPatternSchema = new Schema({
    patternID: {
        type: Number,
        required: true
    },
    pattern: {
        type: Array,
        "default": []
    }
}, { timestamps: true })

module.exports = mongoose.model('WinningPattern',winningPatternSchema)


