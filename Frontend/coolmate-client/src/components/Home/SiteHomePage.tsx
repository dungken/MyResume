import React, { useEffect, useState } from "react";
import AllProduct from "../../assets/images/all-product.png";
import DoTheThao from "../../assets/images/do-the-thao.png";
import MacHangNgay2 from "../../assets/images/mac-hang-ngay-2.png";
import Slider2 from "../../assets/images/slider-2.png";
import Irl1 from "../../assets/images/irl-1.png";
import Irl2 from "../../assets/images/irl-2.png";
import Irl3 from "../../assets/images/irl-3.png";
import Irl4 from "../../assets/images/irl-4.png";
import Irl5 from "../../assets/images/irl-5.png";
import { GetCategoriesService, GetProductsByCategory } from "../../services/ProductService";
import { Link } from "react-router-dom";
interface Category {
    id: string;
    name: string;
    description: string;
    status: string;
    parentCategoryId: string | null;
    subCategories: Category[];
}

const SiteHomePage = () => {
    // Call API to get categories
    const [categories, setCategories] = useState<Category[]>([]);
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await GetCategoriesService() as { success: boolean, data: any, message: string };
                // console.log(response);

                if (response.success) {
                    setCategories(response.data);
                } else {
                    console.error("API call failed:", response.message);
                }
            } catch (error) {
                console.error("API call failed:", error);
            }
        };

        fetchCategories();
    }, []);

    console.log(categories);

    return (
        <main className="site-homepage">
            {
                categories.map((category) => (
                    <RenderProductsByCategoryId key={category.id} categoryId={category.id} categoryName={category.name} />
                ))
            }


            <section className="homepage-collections container p-0">
                <ul className="d-flex p-0 gap-2">
                    <li>
                        <a href="">
                            <img src={AllProduct} alt="All Products" />
                        </a>
                    </li>
                    <li>
                        <a href="">
                            <img src={DoTheThao} alt="Sportswear" />
                        </a>
                    </li>
                    <li>
                        <a href="">
                            <img src={MacHangNgay2} alt="Everyday Wear" />
                        </a>
                    </li>
                    <li>
                        <a href="">
                            <img src={AllProduct} alt="Men's Underwear" />
                        </a>
                    </li>
                </ul>
            </section>
            <section className="banner-block">
                <div className="container">
                    <a href="#">
                        <img src={Slider2} alt="Sale Banner" />
                    </a>
                    <div className="desc-banner sale">
                        <h1 className="title-banner">SALE 50%</h1>
                        {/* <p><i>Giới hạn thời gian</i></p> */}
                        {/* <a href="">Khám phá ngay</a> */}
                    </div>
                </div>
            </section>
            <section className="wp-homepage-irl">
                <div className="homepage-irl container">
                    <div className="irl-title">
                        <h1>Nhật ký Coolmate</h1>
                        <p>Chia sẻ diện mạo mới nhất của bạn cùng với #Coolmate.</p>
                    </div>
                    <ul className="product-container d-flex p-0">
                        <li className="product-card-irl">
                            <a href="">
                                <img src={Irl1} alt="IRL 1" />
                            </a>
                            <i className="fa-solid fa-bag-shopping"></i>
                        </li>
                        <li className="product-card-irl">
                            <a href="">
                                <img src={Irl2} alt="IRL 2" />
                            </a>
                            <i className="fa-solid fa-bag-shopping"></i>
                        </li>
                        <li className="product-card-irl">
                            <a href="">
                                <img src={Irl3} alt="IRL 3" />
                            </a>
                            <i className="fa-solid fa-bag-shopping"></i>
                        </li>
                        <li className="product-card-irl">
                            <a href="">
                                <img src={Irl4} alt="IRL 4" />
                            </a>
                            <i className="fa-solid fa-bag-shopping"></i>
                        </li>
                        <li className="product-card-irl">
                            <a href="">
                                <img src={Irl5} alt="IRL 5" />
                            </a>
                            <i className="fa-solid fa-bag-shopping"></i>
                        </li>
                    </ul>
                </div>
            </section>
        </main>
    );
};

const RenderProductsByCategoryId = ({ categoryId, categoryName }: { categoryId: string, categoryName: string }) => {
    const [products, setProducts] = useState<any[]>([]);
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await GetProductsByCategory(categoryId) as { success: boolean, data: any, message: string };

                if (response.success) {
                    setProducts(response.data);
                } else {
                    console.error("API call failed:", response.message);
                }
            } catch (error) {
                console.error("API call failed:", error);
            }
        };

        fetchProducts();
    }, [categoryId]);

    if (products.length === 0) {
        return null;
    }

    return (
        <section className="wp-homepage-products">
            <div className="homepage-products container">
                <div className="title d-flex">
                    <Link to={`/collection-product/${categoryId}`}>
                        {categoryName}
                    </Link>
                </div>
                <ul className="product-container category d-flex p-0">
                    {/* Render only 4 products */}
                    {products.slice(0, 4).map(product => (
                        <li className="product-card" key={product.id}>
                            <div className="product-image">
                                <Link className="" to={`/product-detail/${product.id}`}>
                                    <img src={product.images[0].url} alt="Product 6" className="product-thumb" />
                                </Link>
                            </div>
                            <div className="product-types d-flex mt-4">
                                {product.colors.map((color: { id: string; colorCode: string }) => (
                                    <div key={color.id} style={{ width: '20px', height: '20px', backgroundColor: color.colorCode, borderRadius: '50%', border: '1px solid #ddd', marginRight: '2px' }} />
                                ))}
                            </div>
                            <Link className="product-title" to={`/product-detail/${product.id}`}>
                                {product.name}
                            </Link>
                            <p className="text-center">
                                <span className="price-new ">
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                                </span>
                            </p>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}

export default SiteHomePage;