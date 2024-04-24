import "../styles/Home.css" 
import axios from "axios"
import Board from "../components/Board"
import GameSummary from "../components/GameSummary"
import { useEffect, useState } from "react"

const Home = () => {
    const [playerOneName, setPlayerOneName] = useState('')
    const [playerTwoName, setPlayerTwoName] = useState('')
    const [holdPlayerDetails, setHoldPlayerDetails] = useState([])
    const [playerDetails, setPlayerDetails] = useState(
        [
            {roundID: 0, playerID: null, playerKind: 1, playerName: '', result: ''},
            {roundID: 0, playerID: null, playerKind: 2, playerName: '', result: ''}
        ]
    )
    const [disableReadyPlayerOne, setDisableReadyPlayerOne] = useState(true)
    const [disableReadyPlayerTwo, setDisableReadyPlayerTwo] = useState(true)
    const [gameSetResult, setGameSetResult] = useState([
        {gameID: 0, rounds: []}
    ])
    const [gameSummary, setGameSummary] = useState([])

    const getGameSummary = async () => {
        const url = `http://localhost:3050/api/gameRecords/`
        const holdGameSummary = await axios.get(url).then(res => {
            return res.data
        })

        setGameSummary(holdGameSummary)
    }

    useEffect(() => {
        getGameSummary()
    },[])
    
    useEffect(() => {
        setGameSetResult(gameSummary)
    },[gameSummary])

    useEffect(() => {
        if(playerOneName){
            setDisableReadyPlayerOne(false)
        }
    },[playerOneName])

    useEffect(() => {
        if(playerTwoName){
            setDisableReadyPlayerTwo(false)
        }
    },[playerTwoName])

    const handleChangePlayerInput = (event, kind) => {
        if(kind === 1){
            const name = event.target.value
            setPlayerOneName(name.toUpperCase())
        }else{
            const name = event.target.value
            setPlayerTwoName(name.toUpperCase())
        }
    }
    const handleClickReady = (kind) => {
        let newPlayerDetails = [...playerDetails]
        const lastPlayerID = newPlayerDetails.sort((a, b) => b.playerID - a.playerID )
        newPlayerDetails.forEach(player => {
            if(player.playerKind === kind){
                player.playerID = lastPlayerID[0].playerID + 1
                player.playerName = kind === 1 ? playerOneName : playerTwoName
            }
            player.roundID = 1   
        })
        if(kind === 1){
            setDisableReadyPlayerOne(true)
        }else{
            setDisableReadyPlayerTwo(true)
        }
        setHoldPlayerDetails(newPlayerDetails)
       
    }
    const startGame = async () => {
        setPlayerDetails(holdPlayerDetails)
        const url = `http://localhost:3050/api/gameRecords`
        let newGameID = gameSummary.length > 0 ? gameSummary[0].gameID + 1 : 1
        let request = {"gameID": newGameID , "rounds": holdPlayerDetails}
        await axios.post(url, request).then((res)=>{
            setGameSetResult(res.data)
        })

    }

    const saveResult = async (data) => {
        const id = data.gameID
        const url = `http://localhost:3050/api/gameRecords/${id}`
        await axios.patch(url,data).then( async res =>{
            await getGameSummary()
        })
    }


    const enableStartButton = () => {
        return (disableReadyPlayerOne && disableReadyPlayerTwo) || false
    }

    const resetReady = (value) => {
        setDisableReadyPlayerOne(value)
        setDisableReadyPlayerTwo(value)
        setHoldPlayerDetails(
            [
                {roundID: 0, playerID: null, playerKind: 1, playerName: '', result: ''},
                {roundID: 0, playerID: null, playerKind: 2, playerName: '', result: ''}
            ]
        )
        setHoldPlayerDetails([])
        setPlayerOneName('')
        setPlayerTwoName('')

    }
    
    return (
        <div className="container">
            <div>
                <div>
                    <div className="playerOne">
                        <label>Player 1</label>
                        <input type="text" name="player1" value={playerOneName} onChange={(event) => handleChangePlayerInput(event, 1)} />
                        <button onClick={() => handleClickReady(1)} disabled={disableReadyPlayerOne}>Ready</button>
                    </div>
                    <div className="playerTwo">
                        <button onClick={() => handleClickReady(2)} disabled={disableReadyPlayerTwo} >Ready</button>
                        <input type="text" name="player2" value={playerTwoName} onChange={(event) => handleChangePlayerInput(event, 2)} />
                        <label>Player 2</label>
                    </div>
                </div>
                <Board playerDetails={playerDetails} onStartGame={() => startGame()} readyStartButton={enableStartButton()} resetReady={resetReady} onClickSave={saveResult} />
            </div>
            <GameSummary gameSummary={gameSummary} />
        </div>
    )
}

export default Home