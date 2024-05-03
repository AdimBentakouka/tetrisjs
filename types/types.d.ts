type Cell =
    null
    | "I"
    | "J"
    | "L"
    | "O"
    | "S"
    | "T"
    | "Z"
    | "PREV";

type Grid = Cell[][];

type GameState = "PLAYING" | "PAUSED" | "GAME OVER" | "WAITING START";

type Position = {
    x: number,
    y: number
}

type GameContext = {
    gameState: GameState,
    score: number,
    rows: number,
    level: number,
    counterNotMove: number,
    counterStartGame: number

    board: Grid,

    canHold: boolean,
    holdPieceId: number,
    nextPieceId: number,
    currentPieceId: number
    currentPiece: Grid | null,
    positionPiece: Position,

    highScore: HighScore
}

type ParamsTransformPiece = {
    grid: Grid,
    piece: Grid,
    positionPiece: Position
}

type Direction = "left" | "right" | "bottom";

type HighScore = number[];