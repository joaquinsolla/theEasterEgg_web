import "../style/App.css";
import Searchbar from "./Searchbar";  // Si necesitas tus propios estilos, este archivo sigue siendo útil

const Home = () => {
    return (
            <div className="Content">
                    <Searchbar />
                    <p>-----</p>
            </div>
    );
};

export default Home;
