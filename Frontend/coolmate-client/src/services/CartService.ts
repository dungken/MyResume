
import axios from 'axios';


export const CreateOrderService = async (orderData: any) => {
    const dto = {
        UserId: orderData.user.id,
        OrderDetails: orderData.cartItems,
        TotalAmount: orderData.totalAmount,
    }

    // console.log(dto.OrderDetails);


    try {
        const response = await axios.post('http://localhost:5289/api/Order',
            dto
        );
        return response.data;
    } catch (error) {
        return (error as any).response.data;
    }
};


export const GetOrderHistoryService = async (userId: string) => {
    try {
        const response = await axios.get(`http://localhost:5289/api/Order/user/${userId}`);
        return response.data;
    } catch (error) {
        return (error as any).response.data;
    }
};