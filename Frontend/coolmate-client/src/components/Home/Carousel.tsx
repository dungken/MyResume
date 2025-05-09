import React from "react";
import 'rc-slider/assets/index.css';
import Slider1 from "../../assets/images/slider-1.png";
import Slider2 from "../../assets/images/slider-2.png";
import Slider3 from "../../assets/images/slider-3.png";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from "react-slick";

const Carousel: React.FC = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    return (
        <div style={{ width: '100%', margin: '0 auto' }}>
            <Slider {...settings}>
                <div>
                    <img src={Slider1} alt="Slide 1" />
                </div>
                <div>
                    <img src={Slider2} alt="Slide 2" />
                </div>
                <div>
                    <img src={Slider3} alt="Slide 3" />
                </div>
            </Slider>
        </div>
    );
};

export default Carousel;
