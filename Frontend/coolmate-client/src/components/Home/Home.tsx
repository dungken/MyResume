import React, { useState } from "react";
import Header from "../Layout/Header";
import SiteHomePage from "./SiteHomePage";
import Carousel from "./Carousel";
import Footer from "../Layout/Footer";
import Product from "../Product/Product";
import Cart from "../Cart/Cart";


const Home = () => {
    return (
        <div>
            <Header />
            <main className="site-homepage">
                <section className="homepage-banner">
                    <Carousel />
                </section>
            </main>
            <SiteHomePage />
            <Footer />
        </div>
    );
};

export default Home;
