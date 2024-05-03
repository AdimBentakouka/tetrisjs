import './App.css'
import {Game} from "./components/game/game";
import {Title} from "./components/title/title";

function App() {

    return (
        <main>
            <a className="website" href="https://www.adimb.dev">
                <span>&#8592;</span> adimb.dev
            </a>
            <Title title="tetris" img="/images/icons/logo.svg" />
            <Game />
        </main>
    )
}

export default App
