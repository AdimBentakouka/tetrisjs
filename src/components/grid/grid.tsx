import "./grid.css";

interface IGrid {
    grid: Grid,
    preview?: boolean,
}

export const Grid = ({grid, preview}: IGrid) => {
    return (
        <div className={`grid ${preview ? "minimize" : ""}`}>
            {
                grid.map((row, indexRow) => (
                    <div key={`grid-${indexRow}`} className="row">
                        {row.map((cell, indexColumn) => (
                            <span key={`grid-${indexRow}-${indexColumn}`} className={`cell cell-${cell}`} />
                        ))}
                    </div>
                ))
            }
        </div>
    )

};