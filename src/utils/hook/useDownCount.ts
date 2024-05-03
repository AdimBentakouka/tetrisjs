import {useState} from "react";


interface ICounter {
    value: number,
    intervalId: number,
    callback: () => void,
}

export const useDownCount = () => {
    const [state, setState] = useState<ICounter>({
        value: -1,
        intervalId: -1,
        callback: () => {
        }
    });


    const decreaseCounter = () => {
        setState(prevState => {
            const newValue = prevState.value - 1;
            if (newValue <= 0) {
                prevState.callback();
                clearInterval(prevState.intervalId);
                return {
                    value: -1,
                    intervalId: -1,
                    callback: () => {
                    }
                }
            } else {
                return {...prevState, value: newValue};
            }
        });

    }

    const startCounter = ( callback: () => void, delay: number) => {
        if (delay <= 0) {
            throw new Error(`startCounter: delay must be greater than 0`);
        }

        const intervalId = setInterval(decreaseCounter, 1000);

        setState({
            value: delay,
            intervalId: intervalId,
            callback: callback
        })
    }

    return {
        count: state.value,
        startCounter,
    }

}