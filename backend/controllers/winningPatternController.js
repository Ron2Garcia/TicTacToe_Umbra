const WinningPattern = require('../models/WinningPattern')

// GET ALL
const getWinningPatterns = async (req, res) => {
    const winningPatterns = await WinningPattern.find({}).sort({patternID: 1})

    res.status(200).json(winningPatterns)
}

// GET SINGLE DATA


// CREATE NEW DATA
const createWinningPattern = async (req, res) => {
    const {patternID , pattern} = req.body

    try {
        const winningPattern = await WinningPattern.create({patternID , pattern})
        res.status(200).json(winningPattern)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}


// DELETA DATA


// UPDATE DATA

module.exports = {
    createWinningPattern,
    getWinningPatterns
}