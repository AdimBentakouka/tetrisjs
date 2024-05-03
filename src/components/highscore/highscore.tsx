import "./highscore.css";
import {numberWithSpaces} from "../../utils/string";

export const Highscore = ({highScore} : {highScore : HighScore}) => {
    return (
        <div className="highscore">
            <p>High Score</p>
            <ul>
                {
                    highScore.map((score, index) => (
                        <li key={index}>{numberWithSpaces(score)}</li>
                    ))
                }
            </ul>
        </div>
    )
}