import ThreadCatModel from "../models/ThreadCatModel";

interface ResultInterface {
    result: ThreadCatModel[];
    totalPages: number;
    totalThreadCat: number;
}

export async function getThreadCat(url: string): Promise<ResultInterface> {
    const result: ThreadCatModel[] = [];
    // const token = localStorage.getItem('token');

    const response: Response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${token}`
        }
    });

    const responseData = await response.json();

    if (!response.ok) {
        throw new Error(`Error ${response.status}: ${responseData.message}`);
    }

    const totalPages: number = responseData.page.totalPages;
    const totalThreadCat: number = responseData.page.totalElements;

    responseData._embedded.threadCategories.forEach((threadCatData: any) => {
        result.push({
            threadCatId: threadCatData.threadCatId,
            name: threadCatData.name,
            description: threadCatData.description,
            userId: threadCatData.userId,
            createdAt: threadCatData.createdAt,
            updatedAt: threadCatData.updatedAt,
        });
    });

    return { result: result, totalThreadCat: totalThreadCat, totalPages: totalPages };
}

export async function getThreadCats(): Promise<ThreadCatModel[]> {
    const url: string = `${process.env.REACT_APP_SERVER_URL}/thread-cat`;
    return (await getThreadCat(url)).result;
}


export async function getListThreadCat(page: number): Promise<ResultInterface> {
    const url: string = `${process.env.REACT_APP_SERVER_URL}/thread-cat?sort=threadCatId,asc&size=8&page=${page}`;
    return getThreadCat(url);
}

export async function deleteThreadCat(threadCatId: number) {
    const url: string = `${process.env.REACT_APP_SERVER_URL}/thread-cat/${threadCatId}`;
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


export async function getThreadCatById(threadCatId: number): Promise<ThreadCatModel | null> {
    const url: string = `${process.env.REACT_APP_SERVER_URL}/thread-cat/${threadCatId}`;
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
        const threadCatData = await response.json();
        if (!threadCatData) {
            throw new Error('Không tồn tài!');
        }
        return {
            threadCatId: threadCatData.threadCatId,
            name: threadCatData.name,
            description: threadCatData.description,
            userId: threadCatData.userId,
            createdAt: threadCatData.createdAt,
            updatedAt: threadCatData.updatedAt,
        }
    } catch (error) {
        console.error('Error: ', error);
        return null;
    }
}



export async function getThreadCatByThreadId(threadId: number): Promise<ThreadCatModel | null> {
    const url: string = `${process.env.REACT_APP_SERVER_URL}/thread/${threadId}/threadCategory`;
    // const token = localStorage.getItem('token');
    try {
        const response: Response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Lỗi khi truy cập đến API! ${url}`);
        }
        const threadCatData = await response.json();
        if (!threadCatData) {
            throw new Error('Không tồn tài!');
        }
        return {
            threadCatId: threadCatData.threadCatId,
            name: threadCatData.name,
            description: threadCatData.description,
            userId: threadCatData.userId,
            createdAt: threadCatData.createdAt,
            updatedAt: threadCatData.updatedAt,
        }
    } catch (error) {
        console.error('Error: ', error);
        return null;
    }
}
