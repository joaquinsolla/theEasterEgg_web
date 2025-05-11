import "../style/HomeBanner.css";
import {Link} from "react-router-dom";

const HomeBanner = () => {
    return (
        <Link to="/advanced-search" className="Formatted-Link">
            <div className="HomeBanner Margin-bottom-big Flex-center-div"
                 style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/assets/banner-background.webp)`}}>
                <div className="HomeBanner-Container">
                    <img className="HomeBanner-Container-Image" src={`${process.env.PUBLIC_URL}/assets/banner-text.webp`} />
                </div>
                <div className="HomeBanner-Container">
                    <img className="HomeBanner-Container-Image" src={`${process.env.PUBLIC_URL}/assets/banner-logos.webp`} />
                </div>
            </div>
        </Link>
    );
}

export default HomeBanner;