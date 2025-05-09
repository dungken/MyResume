import PostCatModel from "../models/PostCatModel";

interface ResultInterface {
    result: PostCatModel[];
    totalPages: number;
    totalPostCat: number;
}

export async function getPostCat(url: string): Promise<ResultInterface> {
    const result: PostCatModel[] = [];
    // const token = localStorage.getItem('token');

    const response: Response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${token}`
        }
    });

    const responseData = await response.json(); // Phải await để chờ dữ liệu JSON được trả về

    if (!response.ok) {
        throw new Error(`Error ${response.status}: ${responseData.message}`);
    }

    const totalPages: number = responseData.page.totalPages;
    const totalPostCat: number = responseData.page.totalElements;

    responseData._embedded.postCategories.forEach((postCatData: any) => {
        result.push({
            postCatId: postCatData.postCatId,
            postCatParentId: postCatData.postCatParentId,
            postCatName: postCatData.postCatName,
            desc: postCatData.desc,
            createdAt: postCatData.createdAt,
            updatedAt: postCatData.updatedAt,
        });
    });

    return { result: result, totalPostCat: totalPostCat, totalPages: totalPages };
}

export async function getPostCats(): Promise<PostCatModel[]> {
    const url: string = `${process.env.REACT_APP_SERVER_URL}/post-cat`;
    return (await getPostCat(url)).result;
}

export async function getPostCatByPostId(postId: number): Promise<PostCatModel | null> {
    const url: string = `${process.env.REACT_APP_SERVER_URL}/post-detail/${postId}/postCategory`;

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
        const postCatData = await response.json();
        if (!postCatData) {
            throw new Error('Không tồn tài!');
        }
        return {
            postCatId: postCatData.postCatId,
            postCatParentId: postCatData.postCatParentId,
            postCatName: postCatData.postCatName,
            desc: postCatData.desc,
            createdAt: postCatData.createdAt,
            updatedAt: postCatData.updatedAt,
        }
    } catch (error) {
        console.error('Error: ', error);
        return null;
    }
}


export async function getListPostCat(page: number): Promise<ResultInterface> {
    const url: string = `${process.env.REACT_APP_SERVER_URL}/post-cat?sort=postCatId,desc&size=8&page=${page}`;
    return getPostCat(url);
}

export async function deletePostCat(postCatId: number) {
    const url: string = `${process.env.REACT_APP_SERVER_URL}/post-cat/${postCatId}`;
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


export async function getPostCatById(postCatId: number): Promise<PostCatModel | null> {
    const url: string = `${process.env.REACT_APP_SERVER_URL}/post-cat/${postCatId}`;
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

        const postCatData = await response.json();
        if (!postCatData) {
            throw new Error('Không tồn tài!');
        }
        return {
            postCatId: postCatData.postCatId,
            postCatParentId: postCatData.postCatParentId,
            postCatName: postCatData.postCatName,
            desc: postCatData.desc,
            createdAt: postCatData.createdAt,
            updatedAt: postCatData.updatedAt,
        }
    } catch (error) {
        console.error('Error: ', error);
        return null;
    }
}
