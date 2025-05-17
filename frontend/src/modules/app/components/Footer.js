import "../style/Footer.css";
import { ReactComponent as SteamIcon } from "./svg/steam.svg";
import { ReactComponent as XboxIcon } from "./svg/xbox.svg";
import { ReactComponent as EpicIcon } from "./svg/epic.svg";
import { ReactComponent as BattleIcon } from "./svg/battle.svg";
import { ReactComponent as GogIcon } from "./svg/gog.svg";


const Footer = () => {
    return (
        <div className="Footer">
            <div>En esta web no se realiza la venta de videojuegos o productos digitales. Si deseas adquirir videojuegos visita las plataformas de venta oficiales:</div>
            <br/>
            <div className="Footer-Platforms Text-center">
                <a target="_blank" href="https://store.steampowered.com">
                    <SteamIcon className="Footer-Platforms-Svg"/>
                </a>
                <a target="_blank" href="https://store.epicgames.com">
                    <EpicIcon className="Footer-Platforms-Svg"/>
                </a>
                <a target="_blank" href="https://www.xbox.com/games">
                    <XboxIcon className="Footer-Platforms-Svg"/>
                </a>
                <a target="_blank" href="https://eu.shop.battle.net">
                    <BattleIcon className="Footer-Platforms-Svg"/>
                </a>
                <a target="_blank" href="https://www.gog.com/en/">
                    <GogIcon className="Footer-Platforms-Svg"/>
                </a>

            </div>
            <br/>
            <div className="Margin-bottom-small">Sitio web desarrollado con fines académicos.</div>
            <div className="Margin-bottom-small">&#169;&nbsp;Joaquín Solla Vázquez - 2025</div>
        </div>
    );
}

export default Footer;