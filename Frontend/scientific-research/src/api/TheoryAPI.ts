import TheoryModel from "../models/TheoryModel";

interface ResultInterface {
    result: TheoryModel[];
    totalPages: number;
    totalTheory: number;
}

export async function getTheory(url: string): Promise<ResultInterface> {
    const result: TheoryModel[] = [];

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
    const totalTheory: number = responseData.page.totalElements;

    responseData._embedded.theoryDetails.forEach((theoryData: any) => {
        result.push({
            theoryDetailId: theoryData.theoryDetailId,
            theoryCatId: theoryData.theoryCatId,
            title: theoryData.title,
            content: theoryData.content,
            userId: theoryData.userId,
            createdAt: theoryData.createdAt,
            updatedAt: theoryData.updatedAt,
        });
    });

    return { result: result, totalTheory: totalTheory, totalPages: totalPages };
}


export async function getAllTheories(): Promise<TheoryModel[]> {
    const url: string = `${process.env.REACT_APP_SERVER_URL}/api/theory`;
    const result: TheoryModel[] = [];

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
            theoryDetailId: theoryData.theoryDetailId,
            theoryCatId: theoryData.theoryCatId,
            title: theoryData.title,
            content: theoryData.content,
            userId: theoryData.userId,
            createdAt: theoryData.createdAt,
            updatedAt: theoryData.updatedAt,
        });
    });

    return result;
}



export async function getTheories(): Promise<TheoryModel[]> {
    const url: string = `${process.env.REACT_APP_SERVER_URL}/theory-detail`;
    return (await getTheory(url)).result;
}

export async function getListTheory(page: number): Promise<ResultInterface> {
    const url: string = `${process.env.REACT_APP_SERVER_URL}/theory-detail?sort=theoryId,asc&size=8&page=${page}`;
    return getTheory(url);
}

export async function deleteTheory(theoryId: number) {
    const url: string = `${process.env.REACT_APP_SERVER_URL}/theory-detail/${theoryId}`;
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


export async function getTheoryById(theoryId: number): Promise<TheoryModel | null> {
    const url: string = `${process.env.REACT_APP_SERVER_URL}/theory-detail/${theoryId}`;

    try {
        // Truy vấn đến đường dẫn
        const response: Response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
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
            theoryDetailId: responseData.theoryDetailId,
            theoryCatId: responseData.theoryCatId,
            title: responseData.title,
            content: responseData.content,
            userId: responseData.userId,
            createdAt: responseData.createdAt,
            updatedAt: responseData.updatedAt,
        }
    } catch (error) {
        console.error('Error: ', error);
        return null;
    }
}



export async function getTheoryByCatId(theoryCatId: number): Promise<TheoryModel | null> {
    const url: string = `${process.env.REACT_APP_SERVER_URL}/api/theory/cat/${theoryCatId}`;

    try {
        const response: Response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        // Nếu trả về lỗi
        if (!response.ok) {
            throw new Error(`Lỗi khi truy cập đến API! ${url}`);
        }
        const responseData = await response.json();
        if (!responseData) {
            throw new Error('Không tồn tài!');
        }
        return {
            theoryDetailId: responseData.theoryDetailId,
            theoryCatId: responseData.theoryCatId,
            title: responseData.title,
            content: responseData.content,
            userId: responseData.userId,
            createdAt: responseData.createdAt,
            updatedAt: responseData.updatedAt,
        }
    } catch (error) {
        console.error('Error: ', error);
        return null;
    }
}
