import React, { useEffect } from 'react';
import Footer from '../Layout/Footer';
import Header from '../Layout/Header';
import { GetCategoriesService, GetProductByCatIdService } from '../../services/ProductService';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

interface CategoryModel {
    id: string;
    parentCategoryId: string | null;
    name: string;
}

const ProductPage: React.FC = () => {
    // Get product category id from url
    const { categoryIdParam } = useParams<{ categoryIdParam: string }>();
    const [categories, setCategories] = React.useState<CategoryModel[]>([]);
    const [products, setProducts] = React.useState<any[]>([]);
    const [filteredProducts, setFilteredProducts] = React.useState<any[]>([]); // filtered products based on search
    const [keyword, setKeyword] = React.useState('');

    const fetchProducts = async (categoryFilter: string | undefined) => {
        try {
            const response = await GetProductByCatIdService(categoryFilter ?? categoryIdParam ?? '');
            const data = response as { data: any[] };
            setProducts(data.data);
            setFilteredProducts(data.data); // Set the filtered products initially to be all products
        } catch (error) {
            console.error("API call failed:", error);
            throw error;
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await GetCategoriesService();
            const data = response as { data: CategoryModel[] };
            setCategories(data.data);
        } catch (error) {
            console.error("API call failed:", error);
            throw error;
        }
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const searchValue = event.target.value;
        setKeyword(searchValue);

        if (searchValue) {
            const filtered = products.filter((product) =>
                product.name.toLowerCase().includes(searchValue.toLowerCase())
            );
            setFilteredProducts(filtered); // Update filtered products
        } else {
            setFilteredProducts(products); // Reset to all products if no keyword
        }
    };

    const handleClickFilterProduct = (categoryId: string) => {
        fetchProducts(categoryId);
    }

    useEffect(() => {
        fetchCategories();
        fetchProducts(categoryIdParam);
    }, [categoryIdParam]);

    console.log(products);


    return (
        <div>
            <Header />
            <div style={{ display: 'flex', padding: '160px 0px 10px 0px' }}>
                <aside style={{ width: '250px', padding: '10px 30px', borderRight: '1px solid #ddd', minHeight: '900px' }}>
                    <div>
                        <h3>Lọc sản phẩm</h3>
                        {categories && categories
                            .filter(category => category.parentCategoryId !== null)
                            .map((category) => (
                                <div key={category.id}>
                                    <input type="radio" name="category" id={category.id} onClick={() => handleClickFilterProduct(category.id)} />
                                    <label style={{ margin: '0px 10px' }} htmlFor={category.id}>{category.name}</label>
                                </div>
                            ))
                        }
                    </div>
                </aside>

                <div style={{ flex: 1 }}>
                    <div className="row my-2">
                        <div className="col-md-6">
                            <h2 style={{ padding: '10px 20px' }}>TẤT CẢ SẢN PHẨM</h2>
                        </div>
                        <div className="col-md-6">
                            <div className="form-search">
                                <form action="" method="post">
                                    <input
                                        type="text"
                                        name="search"
                                        id="search"
                                        placeholder="Tìm kiếm sản phẩm..."
                                        value={keyword}
                                        onChange={handleSearchChange}
                                        autoComplete="off"
                                    />
                                </form>
                            </div>
                        </div>
                    </div>

                    <p style={{ padding: '10px 30px' }}>{filteredProducts.length} kết quả</p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
                        {filteredProducts.map((product) => (
                            <li className="product-card" key={product.name} style={{ textAlign: 'center', listStyle: 'none' }}>
                                <div className="product-image">
                                    <Link to={`/product-detail/${product.id}`}>
                                        <img src={product.images[0] && product.images[0].url || "https://st4.depositphotos.com/14953852/24787/v/380/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg"} alt={product.name} style={{ width: '100%', borderRadius: '8px' }} />

                                    </Link>
                                </div>
                                <div className="product-info" style={{ display: 'block' }}>
                                    <div className="product-types d-flex">
                                        {product.colors.map((color: { id: string; colorCode: string }) => (
                                            <div key={color.id} style={{ width: '20px', height: '20px', backgroundColor: color.colorCode, borderRadius: '50%', border: '1px solid #ddd', marginRight: '2px' }} />
                                        ))}
                                    </div>
                                    <Link className="product-title" to={`/product-detail/${product.id}`}>
                                        {product.name}
                                    </Link>
                                    <p>
                                        <span className="price-new">
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                                        </span>
                                    </p>
                                </div>
                            </li>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ProductPage;
