import {useCallback, useEffect, useState} from "react";
import {
    generateGrid,
    getLastRow,
    getPieceId,
    getRandomPieceId,
    getSafePosition, isCollide, linesCompleted,
    mergedGrid,
    movePiece,
    rotate, scoring
} from "../core";
import {getHighScore, setNewHighScore} from "./localStorage";
import {useInterval} from "./useInterval";


const initGameContext = (maxColumns: number, maxRows: number): GameContext => {

    return {
        gameState: "WAITING START",
        score: 0,
        rows: 0,
        level: 1,
        counterNotMove: 0,
        counterStartGame: 0,
        board: generateGrid(maxColumns, maxRows),
        canHold: true,
        holdPieceId: -1,
        nextPieceId: -1,
        currentPieceId: -1,
        currentPiece: null,
        positionPiece: {
            x: 4,
            y: 0
        },
        highScore: getHighScore()
    }
}

export const useGame = (maxColumns: number, maxRows: number) => {

    const [{
        gameState,
        score,
        rows,
        level,
        board,
        currentPieceId,
        currentPiece,
        holdPieceId,
        nextPieceId,
        positionPiece,
        canHold,
        counterNotMove,
        highScore
    }, setState] = useState<GameContext>(initGameContext(maxColumns, maxRows));

    const pauseGame = () => setState((prevState) => ({
        ...prevState,
        gameState: "PAUSED"
    }));
    const resumeGame = () => setState((prevState) => ({
        ...prevState,
        gameState: "PLAYING"
    }));

    const commitGrid = useCallback(() => {

        const newPiece = getPieceId(nextPieceId);
        const _mergedGrid = mergedGrid({
            grid: board,
            piece: currentPiece!,
            positionPiece: {
                x: positionPiece.x,
                y: getLastRow({grid: board, piece: currentPiece!, positionPiece}) // Forcer à ce que la pièce soit le plus bas possible
            }
        });

        const {grid: newGrid, numberLines} = linesCompleted(_mergedGrid);

        const newPosition: Position = {
            y: 0,
            x: newPiece[0].length + positionPiece.x > maxColumns ? maxColumns - newPiece[0].length : positionPiece.x
        };

        let _level = level;

        if (rows >= level * 10 + 10) {
            _level++;
        }

        //check si game over
        if (isCollide({grid: _mergedGrid, piece: newPiece, positionPiece: newPosition})) {
            setNewHighScore(score);
            return setState((prevState) => ({
                ...prevState,
                gameState: "GAME OVER",
                highScore: getHighScore(),
            }))

        }

        return setState((c) => ({
            ...c,
            board: newGrid ? newGrid : _mergedGrid,
            positionPiece: newPosition,
            currentPieceId: nextPieceId,
            currentPiece: getPieceId(nextPieceId),
            nextPieceId: getRandomPieceId(),
            canHold: true,
            counterNotMove: 0,
            rows: rows + numberLines,
            score: numberLines > 0 ? score + (scoring[numberLines - 1] * (level ? level : 1)) : score + 30 * (level ? level : 1),
            level: _level
        }));
    }, [board, currentPiece, level, maxColumns, nextPieceId, positionPiece, rows, score]);

    const intervalDelay = 500 * Math.pow(0.8 - ((level - 1) * 0.007), level - 1);

    // update
    useInterval((): void => {
        if (gameState === "PLAYING") {
            const newPosition = movePiece({grid: board, piece: currentPiece!, positionPiece, direction: "bottom"});

            if (counterNotMove >= 1000 / intervalDelay) {
                return commitGrid();
            }

            return setState((prevState) => ({
                ...prevState,
                positionPiece: newPosition,
                counterNotMove: newPosition.y === positionPiece.y ? counterNotMove + 1 : 0
            }));
        }
    }, intervalDelay);

    useEffect(() => {
        const holdPiece = () => {
            if (canHold) {
                const newHoldIdPiece = currentPieceId;
                const newCurrentPieceId = holdPieceId !== -1 ? holdPieceId : nextPieceId;
                const newNextIdPiece = holdPieceId !== -1 ? nextPieceId : getRandomPieceId();
                const newCurrentPiece = getPieceId(newCurrentPieceId);

                const newPosition = getSafePosition({grid: board, piece: newCurrentPiece, positionPiece});

                setState((prevState) => ({
                    ...prevState,
                    canHold: false,
                    currentPieceId: newCurrentPieceId,
                    currentPiece: getPieceId(newCurrentPieceId),
                    holdPieceId: newHoldIdPiece,
                    nextPieceId: newNextIdPiece,
                    positionPiece: {...newPosition, y: 0},
                    counterNotMove: 0
                }))
            }
        };


        const Controller = (event: KeyboardEvent) => {
            if (gameState === "PLAYING") {
                event.preventDefault();
                switch (event.key.toUpperCase()) {
                    case "ESCAPE":
                        return pauseGame();
                    case "ARROWLEFT":
                        return setState((prevState) => ({
                            ...prevState,
                            positionPiece: movePiece({
                                grid: board,
                                piece: currentPiece!,
                                positionPiece,
                                direction: "left"
                            }),
                        }))
                    case "ARROWRIGHT":
                        return setState((prevState) => ({
                            ...prevState,
                            positionPiece: movePiece({
                                grid: board,
                                piece: currentPiece!,
                                positionPiece,
                                direction: "right"
                            }),
                        }))
                    case "ARROWDOWN":
                        return setState((prevState) => ({
                            ...prevState,
                            positionPiece: movePiece({
                                grid: board,
                                piece: currentPiece!,
                                positionPiece,
                                direction: "bottom"
                            }),
                        }))
                    case "ARROWUP":
                        return setState((prevState) => ({
                            ...prevState,
                            ...rotate({grid: board, piece: currentPiece!, positionPiece})
                        }))
                    case "C":
                        return holdPiece();
                    case " ":
                        return commitGrid();
                }
            }
        };

        addEventListener("keydown", Controller);

        return () => {
            removeEventListener("keydown", Controller);
        }

    }, [board, canHold, commitGrid, currentPiece, currentPieceId, gameState, holdPieceId, nextPieceId, positionPiece])


    // Démarrer une nouvelle partie
    const newGame = () => {
        const newGameState = initGameContext(maxColumns, maxRows);
        const firstPieceID = getRandomPieceId();

        setState({
            ...newGameState,
            gameState: "PLAYING",
            nextPieceId: getRandomPieceId(),
            currentPieceId: firstPieceID,
            currentPiece: getPieceId(firstPieceID),
        })

    }

    return {
        gameState,
        score,
        rows,
        level,
        board: currentPiece ? mergedGrid({
            grid: mergedGrid({
                grid: board,
                piece: currentPiece!,
                positionPiece: {
                    x: positionPiece.x,
                    y: getLastRow({grid: board, piece: currentPiece!, positionPiece})
                },
                prevPiece: true
            }),
            piece: currentPiece!,
            positionPiece
        }) : board,
        holdPiece: holdPieceId !== -1 ? getPieceId(holdPieceId) : undefined,
        nextPiece: nextPieceId !== -1 ? getPieceId(nextPieceId) : undefined,
        highScore,
        newGame,
        pauseGame,
        resumeGame,
    }
}