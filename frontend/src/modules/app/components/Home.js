import "../style/App.css";
import Searchbar from "./Searchbar";
import SelectedGames from "./SelectedGames";
import FreeGames from "./FreeGames";

const Home = () => {
    return (
            <div className="Content">
                <Searchbar />
                <h1 className="Margin-bottom">Destacado</h1>
                <SelectedGames />
                <div className="Content-Section-1 Margin-bottom">
                    <h2 className="Margin-bottom">Juegos gratis</h2>
                    <FreeGames />
                </div>
                <div className="Content-Section-2 Margin-bottom">
                    <h2 className="Margin-bottom">¡Grandes ofertas, precios pequeños!</h2>

                </div>

            </div>
    );
};

export default Home;
