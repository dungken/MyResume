import React, { useState, useEffect } from 'react';

function ScrollToTopButton() {
    const [isVisible, setIsVisible] = useState(false);

    // Show button when user scrolls down 100px
    const toggleVisibility = () => {
        if (window.pageYOffset > 100) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    // Set up scroll event listener
    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    // Scroll to top of page
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <div className="scroll-to-top">
            {isVisible &&
                <button onClick={scrollToTop} style={{border: 'none', background: 'none'}}>
                    <i style={{fontSize: '30px'}} className="bi bi-arrow-up-circle-fill"></i>
                </button>
            }
        </div>
    );
}

export default ScrollToTopButton;
