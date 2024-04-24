const express = require('express');
const { 
    createWinningPattern,
    getWinningPatterns 
} = require('../controllers/winningPatternController')

const router = express.Router();

// Get ALL
router.get('/', getWinningPatterns);

// Get single item
router.get('/:id', (req, res) => {
    res.json({msg: 'GET single game record'})
});

// post new
router.post('/', createWinningPattern);

// delete 
router.delete('/:id', (req, res) => {
   
});

// update 
router.patch('/:id', (req, res) => {
    
});



module.exports = router
