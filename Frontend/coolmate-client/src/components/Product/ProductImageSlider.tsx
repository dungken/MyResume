import React, { useEffect, useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'rc-slider/assets/index.css';
import { useParams } from 'react-router-dom';


interface ProductImageSliderProps {
    images: string[]; // Array of image URLs
}

const ProductImageSlider: React.FC<ProductImageSliderProps> = ({ images }) => {
    const mainSlider = useRef<Slider>(null);
    const thumbnailSlider = useRef<Slider>(null);

    // Main slider settings
    const mainSettings = {
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        fade: true,
        beforeChange: (oldIndex: number, newIndex: number) => {
            if (thumbnailSlider.current) {
                thumbnailSlider.current.slickGoTo(newIndex); // Sync thumbnail slider with main slider
            }
        },
    };

    // Thumbnail slider settings
    const thumbnailSettings = {
        slidesToShow: 4,
        slidesToScroll: 1,
        focusOnSelect: true,
        vertical: true,
        verticalSwiping: true,
        arrows: false,
        beforeChange: (oldIndex: number, newIndex: number) => {
            if (mainSlider.current) {
                mainSlider.current.slickGoTo(newIndex); // Sync main slider with thumbnail slider
            }
        },
    };

    return (
        <div className="product-image-slider" style={{ display: 'flex', alignItems: 'flex-start' }}>
            {/* Thumbnail Slider */}
            <div style={{ width: '80px', marginRight: '10px' }}>
                <Slider {...thumbnailSettings} ref={thumbnailSlider}>
                    {images.map((image, index) => (
                        <div key={index} style={{ padding: '5px' }}>
                            <img
                                src={image}
                                alt={`Thumbnail ${index + 1}`}
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    cursor: 'pointer',
                                    borderRadius: '4px',
                                }}
                            />
                        </div>
                    ))}
                </Slider>
            </div>

            {/* Main Image Slider */}
            <div style={{ width: '400px' }}>
                <Slider {...mainSettings} ref={mainSlider}>
                    {images.map((image, index) => (
                        <div key={index}>
                            <img
                                src={image}
                                alt={`Product Image ${index + 1}`}
                                style={{ width: '100%', height: '500px', borderRadius: '8px' }}
                            />
                        </div>
                    ))}
                </Slider>
            </div>
        </div>
    );
};

export default ProductImageSlider;
