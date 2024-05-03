const availablePieces : Grid[] = [
    [
        ["O","O"],
        ["O","O"]
    ],
    [
        ["I","I","I","I"]
    ],
    [
        ["J", null, null],
        ["J", "J", "J"]
    ],
    [
        [null, null, "L"],
        ["L", "L", "L"]
    ],
    [
        [null, "S", "S"],
        ["S", "S", null]
    ],
    [
        ["Z", "Z", null],
        [null, "Z", "Z"]
    ],
    [
        [null, "T", null],
        ["T", "T", "T"]
    ]
]

export const scoring = [40, 100, 300, 1200]

export const getRandomPieceId = () : number => Math.floor(Math.random() * (availablePieces.length) + 1);

export const getPieceId = (id: number) : Grid => {
    const _id = id - 1;

    if(_id < 0 || _id > availablePieces.length - 1)
    {
        throw new Error(`getPieceId: Id must be between 1 and ${availablePieces.length}`);
    }

    return JSON.parse(JSON.stringify(availablePieces[_id]));
}

export const generateGrid = (maxColumns: number, maxRows:number) : Grid => {
    if( maxColumns === undefined || maxRows === undefined ||  maxColumns <= 0 || maxRows <= 0)
    {
        throw new Error(`generateGrid: MaxColumns or MaxRows must be greater than 0`);
    }

    return Array.from({ length: maxRows }, () => Array(maxColumns).fill(null));
}

export const mergedGrid = ({grid, piece, positionPiece, prevPiece} : ParamsTransformPiece & {
    prevPiece?: boolean
}): Grid => {
    const currentGrid = JSON.parse(JSON.stringify(grid));

    if (positionPiece.x + piece[0].length > currentGrid[0].length || positionPiece.y + piece.length > currentGrid.length) {
       throw new Error("Bad position of this piece");
    }

    piece.map((row, offsetRow) => {
        row.map((value, offsetColumn) => {
            if (value !== null) {
                currentGrid[positionPiece.y + offsetRow][positionPiece.x + offsetColumn] = prevPiece ? "PREV" : value;
            }
        });
    });

    return currentGrid
}


export const isCollide = ({grid, piece, positionPiece}: ParamsTransformPiece): boolean => {
    for (let indexRow = 0; indexRow < piece.length; indexRow++) {
        for (let indexColumn = 0; indexColumn < piece[indexRow].length; indexColumn++) {

            if (indexRow + positionPiece.y >= grid.length) {
                return true;
            }

            if (piece[indexRow][indexColumn] !== null &&
                grid[indexRow + positionPiece.y][indexColumn + positionPiece.x] !== null) {
                return true;
            }
        }
    }
    return false;
}

const rotatePiece = (currentPiece: Grid): Grid => {

    const newPiece: Grid = [];

    for (let columnNumber = 0; columnNumber < currentPiece[0].length; columnNumber++) {
        const line: Cell[] = [];
        for (let rowNumber = currentPiece.length - 1; rowNumber >= 0; rowNumber--) {
            line.push(currentPiece[rowNumber][columnNumber]);
        }
        newPiece.push(line);
    }

    return newPiece;
}

export const getSafePosition = ({grid, piece, positionPiece}: ParamsTransformPiece): Position => {
    const newPosition: Position = JSON.parse(JSON.stringify(positionPiece));

    if (positionPiece.x + piece[0].length > grid[0].length) {
        newPosition.x -= positionPiece.x + piece[0].length - grid[0].length;
    }

    if (positionPiece.y + piece.length > grid.length) {
        newPosition.y -= positionPiece.y + piece.length - grid.length;
    }

    let offsetY = 0;

    for (let indexRow = 0; indexRow < piece.length; indexRow++) {
        for (let indexColumn = 0; indexColumn < piece[0].length; indexColumn++) {
            if (grid[newPosition.y + indexRow][newPosition.x + indexColumn] !== null) {
                offsetY++;
                break;
            }
        }
    }

    return {...newPosition, y: newPosition.y - offsetY};
}

export const rotate = ({grid, piece, positionPiece}: ParamsTransformPiece) => {
    const newPiece: Grid = rotatePiece(piece);
    const newPosition: Position = getSafePosition({grid, piece: newPiece, positionPiece});

    if (newPosition.y >= 0 && !isCollide({grid, piece: newPiece, positionPiece: newPosition})) {
        return {positionPiece: newPosition, currentPiece: newPiece};
    }

    return {
        positionPiece,
        piece
    }
}

export const movePiece = ({grid, piece, positionPiece, direction}: ParamsTransformPiece & {
    direction: Direction
}) => {
    const newPosition: Position = JSON.parse(JSON.stringify(positionPiece));

    switch (direction) {
        case "left":
            if (positionPiece.x - 1 >= 0) {
                newPosition.x--;
            }
            break;
        case "right":
            if (positionPiece.x + 1 + piece[0].length <= grid[0].length) {
                newPosition.x++;
            }
            break;
        case "bottom":
        default:
            if (positionPiece.y + 1 + piece.length <= grid.length) {
                newPosition.y++;
            }
    }

    return !isCollide({grid, piece, positionPiece: newPosition}) ? newPosition : positionPiece;

}

export const linesCompleted = (grid: Grid): {
    grid: Grid,
    numberLines: number
} => {

    let currentGrid: Grid = JSON.parse(JSON.stringify(grid));

    currentGrid = currentGrid.filter((rows) => !rows.every((value) => value !== null));

    if (grid.length - currentGrid.length !== 0) {
        return {
            grid: [...generateGrid(grid[0].length, grid.length - currentGrid.length), ...currentGrid],
            numberLines: grid.length - currentGrid.length
        };
    }

    return {
        grid,
        numberLines: 0
    };
}

export const getLastRow = ({grid, piece, positionPiece}: ParamsTransformPiece) => {

    const currentGrid = JSON.parse(JSON.stringify(grid));
    const currentPiece = JSON.parse(JSON.stringify(piece));

    for (let indexRow = 0; indexRow < currentGrid.length; indexRow++) {

        if (isCollide({
            grid: currentGrid,
            positionPiece: {
                x: positionPiece.x,
                y: positionPiece.y + indexRow
            },
            piece: currentPiece
        })) {
            return positionPiece.y + indexRow - 1
        }
    }

    return currentGrid.length - currentPiece.length;

}