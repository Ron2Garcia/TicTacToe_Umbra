import "../styles/Board.css"
import Square from "./Square"
import { useState, useEffect } from "react"
import axios from 'axios'


const WinCounter = ({ playerNum, numberOfWin }) => {
    return (
        <div className={playerNum === 1 ? 'playerOneArea' : 'playerTwoArea'}>
            <span>No. of Wins:</span>
            <p>{numberOfWin}</p>
        </div>
    )
}

const Board = ({ playerDetails, onStartGame, readyStartButton, resetReady, onClickSave }) => {
    const [patterns, setPatterns] = useState([])
    const [isPlayerOne, setIsPlayerOne] = useState(true)
    const [slots, setSlot] = useState(Array(9).fill(''))
    const [roundResult, setRoundResult] = useState(
        [
            {roundID: null, playerID: null, playerKind: null, result: ''},
            {roundID: null, playerID: null, playerKind: null, result: ''}
        ]
    )
    const [gameSetResult, setGameSetResult] = useState([
        {gameID: 0, rounds: []}
    ])
    const [disableStart, setDisableStart] = useState(true)

    const [gameSummary, setGameSummary] = useState([])

    const getGameSummary = async () => {
        const url = `http://localhost:3050/api/gameRecords/`
        const holdGameSummary = await axios.get(url).then(res => {
            if(!res.data){
                return [
                    {gameID: 0, rounds: []}
                ]
            }else{
                return res.data
            }
        })

        setGameSummary(holdGameSummary)
        setGameSetResult(holdGameSummary)
    }

    useEffect(() => {
        getGameSummary()
    },[])
    
    useEffect(() => {
        setRoundResult(playerDetails)
    },[playerDetails])

    useEffect(() => {
        const checkPlayerName = playerDetails.filter(player=>{
            return player.playerName
        })
        if(!readyStartButton || checkPlayerName.length < 2){
            document.getElementById("overlayStartGame").style.display = "block";
            document.getElementById("statusText").style.display = "none";
        }else{
            setDisableStart(false)
        }   
    },[readyStartButton])
    
    useEffect( ()=> {
        getRoundResult()
    },[slots]) // eslint-disable-line react-hooks/exhaustive-deps

    const handleClick = (i) => {
        if(slots[i] || getResult(slots) ){
            return // to stop function
        }
        const newSlots = [...slots]
        
        if(isPlayerOne){
            newSlots[i] = 'X'
        }else{
            newSlots[i] = 'O'
        }
        
        setSlot(newSlots)
        setIsPlayerOne(!isPlayerOne)

    }

    const getPatterns = async () => {
        const url = `http://localhost:3050/api/winningPatterns/`
        const holdPatterns = await axios.get(url).then((res)=>{
            return res.data
        })
        const passPatterns = holdPatterns.map(({pattern}) =>{
            return pattern
        })
        setPatterns(passPatterns)
    }
    useEffect( () => {
        getPatterns()
    },[])

    const getResult = (slot) => {
        // GET WINNER
        let gameResult = ''
        patterns.forEach(([a, b, c,]) => {
            if(slot[a] && slot[a] === slot[b] && slot[a] === slot[c]){
                gameResult = slot[a]
            }   
        })

        // IF THE GAME IS DRAW
        const countMove = slot.filter(record => { return record})
        if(!gameResult){
            if( patterns.length === countMove.length-1){
                gameResult = 'Draw'
            }
        }
           
        return gameResult ? gameResult : null
    }
    
    const getStatus = () => {
        let currentResult;
        const gameResult = getResult(slots)
        if(gameResult){
            currentResult = gameResult === 'Draw' ? gameResult.toUpperCase() : `WINNER: ${(gameResult === 'X' ? 'PLAYER 1' : 'PLAYER 2')}`
        }else{
            currentResult = `TURN: ${(isPlayerOne ? 'PLAYER 1' : 'PLAYER 2')}`
        }
        return currentResult
    }
    const getRoundResult = () => {
        const gameResult = getResult(slots)
        const passResult = roundResult.map(player=>{
            if(gameResult){
                if(gameResult === 'Draw'){
                    player.result = gameResult
                }else if(gameResult === 'X'){
                    player.result = player.playerKind === 1 ? 'Win' : 'Lose'
                }else{
                    player.result = player.playerKind === 2 ? 'Win' : 'Lose'
                }
            }
            return {...player}   
        })
        setRoundResult(passResult)
        if(gameResult){
            getGameSetResult()
        }
    }
    const getGameSetResult = () => {
        const gameSet = gameSetResult[0]
        gameSet.rounds.push(...roundResult)

        onClickSave(gameSet)

    }

    // const countWins = (id) => {
    //     let winCount = 0
    //     if(gameSetResult > 0){
    //         gameSetResult[0].rounds.map(round =>
    //             (round.playerID === id && round.result === 'Win') && winCount++
    //         )
    //     }
    //     return winCount

    // }

    const onClickStart = (startTrigger) => {
        let newGameID = gameSetResult.map(({ gameID })=>{
            return {gameID: gameID + 1, rounds: []}
        })
        setGameSetResult(newGameID)
        startTrigger()
        setDisableStart(true)
        document.getElementById("overlayStartGame").style.display = "none";
        document.getElementById("statusText").style.display = "block";
    }

    const resetBoard = () => {
        const currentRound = roundResult.filter(player=>{return player.result})
        const emptySlot = Array(9).fill('')
        if(currentRound.length > 0){
            setSlot(emptySlot)
            setIsPlayerOne(true)
        }
    }
    const continueGame = () => {
        resetBoard()
        const currentRound = [...roundResult]
        currentRound.forEach(round => {
            round.roundID++
            round.result = ''
        })
        setRoundResult(currentRound)
    }

    const stopGame = () => {
        resetBoard()
        const currentRound = [...roundResult]
        currentRound.forEach(round => {
            round.roundID = 0
            round.playerName = ''
            round.result = ''
        })
        setRoundResult(currentRound)
        setGameSetResult(
            [
                {gameID: 0, rounds: []}
            ]
        )
        resetReady(false)
    }

    useEffect(() => {
        if(getResult(slots)){
            document.getElementById("overlayRoundOptions").style.display = "block";
        }else{
            document.getElementById("overlayRoundOptions").style.display = "none";
        }
    },[getResult(slots)])
       
    return (
        <div className="board">
            <div id="overlayStartGame">
                <div>
                    <span>Welcome Players !!!</span>
                    <span>Please Enter Player's Name and Click Ready</span>
                    <button onClick={() => onClickStart(onStartGame)} disabled={disableStart} >START</button>
                    <span>Good Luck and Have Fun !!!</span>
                </div>
            </div>

            {/* <WinCounter playerNum={1} numberOfWin={countWins(roundResult[0].playerID)} /> */}
            <div className="boardArea">
                <div id="overlayRoundOptions">
                    <div>
                        <span>End of Round {roundResult[0].roundID}</span>
                        <div>
                            <button onClick={() => continueGame()}>CONTINUE</button>
                            <button onClick={() => stopGame()}>STOP</button>
                        </div>
                    </div>
                </div>
                 <div className="status">
                     <p id="statusText">{getStatus()}</p>
                 </div>
                 <div className="boardRow">
                     <Square value={slots[0]} onSlotClick={() => handleClick(0) } />
                     <Square value={slots[1]} onSlotClick={() => handleClick(1) } />
                     <Square value={slots[2]} onSlotClick={() => handleClick(2) } />
                     <Square value={slots[3]} onSlotClick={() => handleClick(3) } />
                     <Square value={slots[4]} onSlotClick={() => handleClick(4) } />
                     <Square value={slots[5]} onSlotClick={() => handleClick(5) } />
                     <Square value={slots[6]} onSlotClick={() => handleClick(6) } />
                     <Square value={slots[7]} onSlotClick={() => handleClick(7) } />
                     <Square value={slots[8]} onSlotClick={() => handleClick(8) } />  
                 </div>
            </div>
            {/* <WinCounter playerNum={2} numberOfWin={countWins(roundResult[1].playerID)} /> */}
        </div>
    )
}

export default Board