import React, { useState } from 'react';
import TShirtChayBoBasic from "../../assets/images/t-shirt-chay-bo-basic.png";

interface ProductDetailDescriptionProps {
    productDesc: string;
}

const ProductDetailDescription: React.FC<ProductDetailDescriptionProps> = ({ productDesc }) => {
    // State to control the visibility of ProductDescriptionDetail
    const [isDetailVisible, setIsDetailVisible] = useState(false);

    // Function to toggle the visibility
    const toggleDetailVisibility = () => {
        setIsDetailVisible(prevState => !prevState);
    };

    return (
        <section className="detail-product">
            <div className="btn-expand-detail">
                <button className="expand-detail" onClick={toggleDetailVisibility}>
                    {isDetailVisible ? 'Thu gọn' : 'Xem chi tiết sản phẩm'}
                </button>
            </div>

            {/* Show description only if isDetailVisible is true */}
            {isDetailVisible && (
                <div className="desc-detail d-flex">
                    <div className="product-description" style={{ maxWidth: '990px' }} dangerouslySetInnerHTML={{ __html: productDesc }} />
                </div>
            )}
        </section>
    );
}

export default ProductDetailDescription;
