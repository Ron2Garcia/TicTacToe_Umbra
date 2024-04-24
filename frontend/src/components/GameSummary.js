import  "../styles/GameSummary.css"
import { useState, useEffect } from "react"

const GameSummary = ({ gameSummary }) => {

    const [tableContent, setTableContent] = useState([])


    const setTable =  () => {
        let table = []
        gameSummary.forEach(({gameID, rounds}) =>{
            // let arr = []
            let gameSet = {}
            gameSet.gameID = gameID
            gameSet.details = []
            rounds.forEach(({roundID, playerKind, playerName, result}) => {
                let obj = {}
                obj.playerName = playerName
                obj.playerKind = playerKind
                obj.roundID = roundID
                    obj.win = result === 'Win' 
                    ? !obj.win 
                        ? 1 
                        : obj.win++
                    : !obj.win
                        ? 0
                        : obj.win
                    obj.lose = result === 'Lose' 
                    ? !obj.lose
                        ? 1 
                        : obj.lose++
                    : !obj.lose 
                        ? 0
                        : obj.lose
                    obj.draw = result === 'Draw' 
                    ? !obj.draw
                        ? 1
                        : obj.draw++
                    : !obj.draw
                        ? 0
                        : obj.draw
                gameSet.details.push(obj)
            })
            table.push(gameSet)
        })
        setTableContent(table) 
    }

    useEffect(() => {
        setTable()
    },[gameSummary])

    const TableRow = () => {
        return (
            <>
                {tableContent.map((row, index) => 
                    <tbody key={index}>
                        {row.details.map((detail,i) => 
                            <tr key={i}>
                                {i === 0 && <td rowSpan={row.details.length}>{row.gameID}</td>}
                                <td>{detail.playerName}</td>
                                <td>{detail.win}</td>
                                <td>{detail.lose}</td>
                                <td>{detail.draw}</td>
                            </tr>
                        )}
                    </tbody>
                )}
            </>
            
        )
    }   

    return (
        <div >
            <div className="summaryTitle">
                <span>Game Summary</span>
            </div>
            <div className="summaryContent">
                <table className="gameSummaryTable">
                    <thead >
                        <tr>
                            <th>Game</th>
                            <th>Player</th>
                            <th>Win</th>
                            <th>Lose</th>
                            <th>Draw</th>
                        </tr>
                    </thead>
                    <TableRow />
                </table>
            </div>
        </div>
    )
}

export default GameSummary