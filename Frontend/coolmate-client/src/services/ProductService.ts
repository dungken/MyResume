import axios from 'axios';

export const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return {
        'Authorization': `Bearer ${token}`
    }
}

export const GetCategoriesService = async () => {
    try {
        const response = await axios.get('http://localhost:5289/api/Categories');
        return response.data;
    } catch (error) {
        console.error("API call failed:", error);
        throw error;
    }
}


export const GetProductByCatIdService = async (cateId: string) => {
    try {
        const response = await axios.get(`http://localhost:5289/api/Products/Category/${cateId}`);
        return response.data;
    } catch (error) {
        console.error("API call failed:", error);
        throw error;
    }
}


export const GetProductByIdService = async (productId: string) => {
    try {
        const response = await axios.get(`http://localhost:5289/api/Products/${productId}`);
        return response.data;
    } catch (error) {
        console.error("API call failed:", error);
        throw error;
    }
}

export const GetProductsByCategory = async (categoryId: any) => {
    try {
        const response = await axios.get(`http://localhost:5289/api/Products/Category/${categoryId}`);
        return response.data;
    } catch (error) {
        return (error as any).response.data;
    }
}
