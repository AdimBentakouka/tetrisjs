const item = "HIGHSCORE";

export const getHighScore = (): HighScore => {
    return JSON.parse(localStorage.getItem(item) || '[10000,5000,3000,2000,1000]').sort((a: number, b: number) => (a > b) ? -1 : 1) as number[];
}

export const setNewHighScore = (newHighScore: number): void => {
    const highScore = getHighScore();

    if(highScore.includes(newHighScore)) {
        return;
    }

    highScore.push(newHighScore);



    localStorage.setItem(item, JSON.stringify(highScore.sort((a: number, b: number) => (a > b) ? -1 : 1).slice(0,5)));
}

