import {useState} from "react";
import {useDownCount} from "../../utils/hook/useDownCount";
import {useGame} from "../../utils/hook/useGame";
import {numberWithSpaces} from "../../utils/string";
import {Board} from "../board/board";
import {Button} from "../button/button";
import {Help} from "../help/help";
import {Highscore} from "../highscore/highscore";
import {Info} from "../info/info";
import {Piece} from "../piece/piece";
import "./game.css"


export const Game = () => {
    const [help, setHelp] = useState<boolean>(false);
    const {count, startCounter} = useDownCount();
    const {
        level,
        score,
        rows,
        board,
        gameState,
        holdPiece,
        nextPiece,
        highScore,
        newGame,
        resumeGame,
        pauseGame
    } = useGame(11, 19);

    const toggleHelp = () => {
        if (gameState === "PLAYING") {
            pauseGame();
        }
        setHelp(!help);
    }
    const gameText = (): string => {
        if (count >= 0) {
            return count.toString()
        }
        if (gameState === "GAME OVER") {
            return gameState;
        }
        if (gameState === "PAUSED" && !help) {
            return "II";
        }
        return "";
    }
    const disabledButton = () => {
        return count > 0
    }

    return (
        <div className="game">
            {
                gameState !== "PLAYING" && <div className="text">{gameText()}</div>
            }
            {help ? <Help close={() => toggleHelp()}/> :
                <>
                    <Piece title="Hold" piece={holdPiece}/>
                    <Board grid={board}/>
                    <section>
                        <Piece title="Next" piece={nextPiece}/>
                        <Info info={`Score: ${numberWithSpaces(score)}`}/>
                        <Info info={`Rows: ${numberWithSpaces(rows)}`}/>
                        <Info info={`Level: ${level}`}/>
                        <div className="group-btn">
                            {["WAITING START", "GAME OVER"].includes(gameState) &&
                                <Button label="Start Game" primary disabled={disabledButton()}
                                        onClick={() => startCounter(() => newGame(), 5)
                                        }/>}
                            {gameState == "PLAYING" &&
                                <Button label="Pause" disabled={disabledButton()} primary onClick={() => pauseGame()}/>}
                            {gameState == "PAUSED" &&
                                <Button label="Resume" primary disabled={disabledButton()}
                                        onClick={() => startCounter(() => resumeGame(), 5)}/>}
                            <Button label="?" disabled={disabledButton()} onClick={() => toggleHelp()}/>
                        </div>
                        <Highscore highScore={highScore}/>
                    </section>
                </>
            }
        </div>
    )
}