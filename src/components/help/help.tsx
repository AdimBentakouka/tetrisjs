import {Button} from "../button/button";

import "./help.css"

export const Help = ({close}: { close: () => void }) => {
    return (

        <div className="help">
            <h1>How to play ?</h1>
            <ul className="controls">
                <li>Drop<span className="key">spacebar</span></li>
                <li>Hold<span className="key">c</span></li>
                <li>Pause<span className="key">esc</span></li>
                <li>Rotate<span className="key">⬆</span></li>
                <li>Shift Left<span className="key">⬅</span></li>
                <li>Shift Right<span className="key">➡</span></li>
                <li>Soft Drop<span className="key">⬇</span></li>
            </ul>
            <Button label="Close" onClick={() => close()}/>
        </div>
    )
}