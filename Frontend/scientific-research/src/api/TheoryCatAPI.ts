import TheoryCatModel from "../models/TheoryCatModel";

interface ResultInterface {
    result: TheoryCatModel[];
    totalPages: number;
    totalTheoryCat: number;
}

export async function getTheoryCat(url: string): Promise<ResultInterface> {
    const result: TheoryCatModel[] = [];

    const response: Response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    const responseData = await response.json(); // Phải await để chờ dữ liệu JSON được trả về

    if (!response.ok) {
        throw new Error(`Error ${response.status}: ${responseData.message}`);
    }

    const totalPages: number = responseData.page.totalPages;
    const totalTheoryCat: number = responseData.page.totalElements;

    responseData._embedded.theoryCategories.forEach((theoryData: any) => {
        result.push({
            theoryCatId: theoryData.theoryCatId,
            theoryParentCatId: theoryData.theoryParentCatId,
            userId: theoryData.userId,
            name: theoryData.name,
            shortDesc: theoryData.shortDesc,
            createdAt: theoryData.createdAt,
            updatedAt: theoryData.updatedAt,
        });
    });

    return { result: result, totalTheoryCat: totalTheoryCat, totalPages: totalPages };
}

export async function getTheoryCats(): Promise<TheoryCatModel[]> {
    const url: string = `${process.env.REACT_APP_SERVER_URL}/theory-cat`;
    return (await getTheoryCat(url)).result;
}

export async function getAllTheoryCats(): Promise<TheoryCatModel[]> {
    const url: string = `${process.env.REACT_APP_SERVER_URL}/api/theory/cat`;
    const result: TheoryCatModel[] = [];

    const response: Response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    const responseData = await response.json(); // Phải await để chờ dữ liệu JSON được trả về

    if (!response.ok) {
        throw new Error(`Error ${response.status}: ${responseData.message}`);
    }

    responseData.forEach((theoryData: any) => {
        result.push({
            theoryCatId: theoryData.theoryCatId,
            theoryParentCatId: theoryData.theoryParentCatId,
            userId: theoryData.userId,
            name: theoryData.name,
            shortDesc: theoryData.shortDesc,
            createdAt: theoryData.createdAt,
            updatedAt: theoryData.updatedAt,
        });
    });

    return result;
}


export async function getListTheoryCat(page: number): Promise<ResultInterface> {
    const url: string = `${process.env.REACT_APP_SERVER_URL}/theory-cat?sort=theoryCatId,asc&size=8&page=${page}`;
    return getTheoryCat(url);
}

export async function deleteTheoryCat(theoryCatId: number) {
    const url: string = `${process.env.REACT_APP_SERVER_URL}/theory-cat/${theoryCatId}`;
    const token = localStorage.getItem('token');

    if (!token) {
        throw new Error('Token not found in localStorage');
    }

    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const responseData = await response.json();
            throw new Error(`Error ${response.status}: ${responseData.message}`);
        }
        return true; // Trả về true nếu xóa thành công
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error; // Ném lỗi để xử lý tại nơi gọi hàm này nếu cần
    }
}


export async function getTheoryCatById(theoryCatId: number): Promise<TheoryCatModel | null> {
    const url: string = `${process.env.REACT_APP_SERVER_URL}/theory-cat/${theoryCatId}`;
    const token = localStorage.getItem('token');

    try {
        const response: Response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Lỗi khi truy cập đến API! ${url}`);
        }
        const responseData = await response.json();
        if (!responseData) {
            throw new Error('Không tồn tài!');
        }
        return {
            theoryCatId: responseData.theoryCatId,
            theoryParentCatId: responseData.theoryParentCatId,
            userId: responseData.userId,
            name: responseData.name,
            shortDesc: responseData.shortDesc,
            createdAt: responseData.createdAt,
            updatedAt: responseData.updatedAt,
        }
    } catch (error) {
        console.error('Error: ', error);
        return null;
    }
}
