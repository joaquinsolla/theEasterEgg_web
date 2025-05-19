import "../style/HomeBanner.css";
import {Link} from "react-router-dom";
import BannerText from '../../common/assets/banner-text.webp';
import BannerLogos from '../../common/assets/banner-logos.webp';
import BannerBackground from '../../common/assets/banner-background.webp'

const HomeBanner = () => {
    return (
        <Link to="/advanced-search" className="Formatted-Link">
            <div className="HomeBanner Margin-bottom-big Flex-center-div"
                 style={{ backgroundImage: `url(${BannerBackground})` }}>
                <div className="HomeBanner-Container">
                    <img className="HomeBanner-Container-Image" src={BannerText} />
                </div>
                <div className="HomeBanner-Container">
                    <img className="HomeBanner-Container-Image" src={BannerLogos} />
                </div>
            </div>
        </Link>
    );
}

export default HomeBanner;