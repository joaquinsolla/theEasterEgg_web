import "../style/App.css";
import Searchbar from "./Searchbar";
import SelectedGames from "./SelectedGames";
import FreeGames from "./FreeGames";
import SpecialPrices from "./SpecialPrices";
import HomeBanner from "./HomeBanner";

const Home = () => {
    return (
            <div className="Content">
                <Searchbar />
                <HomeBanner />

                <div>
                    <h1 className="Margin-bottom">Destacado</h1>
                    <SelectedGames />
                </div>

                <div className="Content-Section-1 Margin-bottom-big">
                    <h2 className="Margin-bottom">Juegos gratis</h2>
                    <FreeGames />
                </div>

                <div className="Content-Section-2 Margin-bottom-big">
                    <h2 className="Margin-bottom Text-center">¡Grandes ofertas, precios pequeños!</h2>
                    <SpecialPrices />
                </div>

            </div>
    );
};

export default Home;
