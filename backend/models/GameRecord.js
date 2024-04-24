const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const gameRecordSchema = new Schema ({
    gameID: {
        type: Number,
        required: true
    },
    rounds: [
        {   
            roundID: Number,
            playerID: Number,
            playerKind: Number,
            playerName: String,
            result: String,
            _id: false
        }
    ]
}, { timestamps: true })

module.exports = mongoose.model('GameRecord',gameRecordSchema)
