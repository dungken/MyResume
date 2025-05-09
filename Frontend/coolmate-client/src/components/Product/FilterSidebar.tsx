// components/FilterSidebar.tsx
import React, { useEffect } from 'react';
import { GetCategoriesService } from '../../services/ProductService';

interface FilterSidebarProps {
    categories: string[];
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ categories }) => {

    return (
        <aside style={{ width: '200px', padding: '10px 30px', borderRight: '1px solid #ddd' }}>
            <h5>Nhóm sản phẩm</h5>
            <div>
                {categories.map(
                    (category) => (
                        <div key={category}>
                            <input type="radio" name="category" id={category} />
                            <label style={{ margin: '0px 10px' }} htmlFor={category}>{category}</label>
                        </div>
                    )
                )}
            </div>
            <h5 className='my-2'>Kích cỡ</h5>
            <div>
                {['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'].map((size) => (
                    <button className='btn btn-sm btn-outline-primary' key={size} style={{ margin: '3px', padding: '5px' }}>{size}</button>
                ))}
            </div>
            <h5 className='mt-2'>Màu sắc</h5>
            <div style={{ display: 'flex', gap: '0px' }}>
                {['#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF'].map((color) => (
                    <div
                        key={color}
                        style={{
                            width: '30px',
                            height: '30px',
                            backgroundColor: color,
                            borderRadius: '50%',
                            border: '1px solid #ddd',
                            marginRight: '2px',
                        }}
                    />
                ))}
            </div>
        </aside>
    );
};

export default FilterSidebar;
