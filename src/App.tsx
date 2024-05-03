import './App.css'
import {Game} from "./components/game/game";
import {Title} from "./components/title/title";

function App() {

    return (
        <main>
            <Title title="tetris" img="/images/icons/logo.svg" />
            <Game />
        </main>
    )
}

export default App
