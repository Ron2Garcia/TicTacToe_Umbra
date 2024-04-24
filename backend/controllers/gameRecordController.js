const GameRecord = require('../models/GameRecord')


// GET ALL

const getGameRecords = async (req, res) => {
    const gameRecords = await GameRecord.find({}).sort({gameID: -1})

    res.status(200).json(gameRecords)
}


// GET SINGLE DATA  


// CREATE NEW DATA
const createGameRecord = async (req, res) => {
    const {gameID , rounds} = req.body

    try {
        const gameRecord = await GameRecord.create({gameID , rounds})
        res.status(200).json(gameRecord)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

// DELETA DATA


// UPDATE DATA
const updateGameRecord = async (req, res) => {
    console.log(req.body)
    const gameID = +req.params.id
    console.log(gameID,req.params,'gameID')
    const gameRecord = await GameRecord.findOneAndUpdate({gameID: gameID},{
        ...req.body 
    })
    
    if(!gameRecord){
        return res.status(400).json({error: 'No Such Game Record'})
    }

    res.status(200).json(gameRecord)
    
}


module.exports = {
    getGameRecords,
    createGameRecord,
    updateGameRecord
}