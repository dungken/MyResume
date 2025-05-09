import PostCatModel from "../models/PostCatModel";
import PostModel from "../models/PostModel";

interface ResultInterface {
    result: PostModel[];
    totalPages: number;
    totalPost: number;
}

export async function getPost(url: string): Promise<ResultInterface> {
    const result: PostModel[] = [];
    const token = localStorage.getItem('token');
    // console.log(token);


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
    const totalPost: number = responseData.page.totalElements;

    responseData._embedded.postDetails.forEach((postData: any) => {
        result.push({
            postId: postData.postId,
            title: postData.title,
            detail: postData.detail,
            thumbnail: postData.thumbnail,
            desc: postData.desc,
            postCatId: postData.postCatId,
            userId: postData.userId,
            createdAt: postData.createdAt,
            updatedAt: postData.updatedAt,
        });
    });

    return { result: result, totalPost: totalPost, totalPages: totalPages };
}

export async function getPosts(): Promise<PostModel[]> {
    const url: string = `${process.env.REACT_APP_SERVER_URL}/post-detail`;
    return (await getPost(url)).result;
}


export async function getListPost(page: number): Promise<ResultInterface> {
    const url: string = `${process.env.REACT_APP_SERVER_URL}/post-detail?sort=postId,desc&size=9&page=${page}`;
    return getPost(url);
}

export async function getPostsByPostCatId(postCatId: number): Promise<PostModel[] | null> {
    const url: string = `${process.env.REACT_APP_SERVER_URL}/post-cat/${postCatId}/posts`;
    const result: PostModel[] = [];

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

    responseData._embedded.postDetails.forEach((postData: any) => {
        result.push({
            postId: postData.postId,
            title: postData.title,
            detail: postData.detail,
            thumbnail: postData.thumbnail,
            desc: postData.desc,
            postCatId: postData.postCatId,
            userId: postData.userId,
            createdAt: postData.createdAt,
            updatedAt: postData.updatedAt,
        });
    });

    return result;
}

export async function deletePost(postId: number) {
    const url: string = `${process.env.REACT_APP_SERVER_URL}/post-detail/${postId}`;
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


export async function getPostById(postId: number): Promise<PostModel | null> {
    const url: string = `${process.env.REACT_APP_SERVER_URL}/post-detail/${postId}`;
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
        const postData = await response.json();
        if (!postData) {
            throw new Error('Không tồn tài!');
        }
        return {
            postId: postData.postId,
            title: postData.title,
            detail: postData.detail,
            thumbnail: postData.thumbnail,
            desc: postData.desc,
            postCatId: postData.postCatId,
            userId: postData.userId,
            createdAt: postData.createdAt,
            updatedAt: postData.updatedAt,
        }
    } catch (error) {
        console.error('Error: ', error);
        return null;
    }
}

