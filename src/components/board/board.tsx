import { Grid } from "../grid/grid";
import "./board.css"

interface IBoard {
    grid: Grid,
}
export const Board = ({grid} : IBoard) => {
    return (
        <div className="board">
            <Grid grid={grid}/>
        </div>
    )
}