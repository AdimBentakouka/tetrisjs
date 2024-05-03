import {Grid} from "../grid/grid";
import "./piece.css"
interface IPiece {
    title: string,
    piece?: Grid

}
export const Piece = ({title, piece} : IPiece) => {
    return (
        <div className="piece">
            <p>{title}</p>
            <div className="piece-container">
                {piece && <Grid grid={piece} preview/>}
            </div>
        </div>
    )
}