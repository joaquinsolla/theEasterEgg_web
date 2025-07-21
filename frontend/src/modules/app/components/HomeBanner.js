import "../style/HomeBanner.css";
import {Link} from "react-router-dom";

const HomeBanner = () => {
    return (
        <Link to="/advanced-search" className="Formatted-Link">
            <div className="HomeBanner Margin-bottom-big Flex-center-div"
                 style={{ backgroundImage: `url('/theeasteregg_web/assets/banner-background.webp')` }}>
                <div className="HomeBanner-Container">
                    <img className="HomeBanner-Container-Image" src="/theeasteregg_web/assets/banner-text.webp" />
                </div>
                <div className="HomeBanner-Container">
                    <img className="HomeBanner-Container-Image" src="/theeasteregg_web/assets/banner-logos.webp" />
                </div>
            </div>
        </Link>
    );
}

export default HomeBanner;