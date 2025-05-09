import "../style/App.css";
import Searchbar from "./Searchbar";
import SelectedGames from "./SelectedGames";

const Home = () => {
    return (
            <div className="Content">
                <Searchbar />
                <h1 className="Margin-bottom">Destacado</h1>
                <SelectedGames />
                <div className="Content-Section">
                    <h2 className="Margin-bottom">Juegos gratis</h2>
                </div>

            </div>
    );
};

export default Home;
