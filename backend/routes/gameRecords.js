const express = require('express');
const {
    getGameRecords,
    createGameRecord,
    updateGameRecord
} = require('../controllers/gameRecordController')

const router = express.Router();

// Get ALL
router.get('/', getGameRecords);

// Get single item
router.get('/:id', (req, res) => {
    res.json({msg: 'GET single game record'})
});

// post new
router.post('/', createGameRecord);

// delete 
router.delete('/:id', (req, res) => {
    res.json({msg: 'delete game record'})
});

// update 
router.patch('/:id', updateGameRecord);



module.exports = router
