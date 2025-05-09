import ThreadCommentModel from "../models/ThreadCommentModel";

interface ResultInterface {
    result: ThreadCommentModel[];
    totalPages: number;
    totalThreadComment: number;
}

export async function getThreadComment(url: string): Promise<ResultInterface> {
    const result: ThreadCommentModel[] = [];
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
    const totalThreadComment: number = responseData.page.totalElements;

    responseData._embedded.threadComments.forEach((threadComment: any) => {
        result.push({
            commentId: threadComment.commentId,
            commentParentId: threadComment.commentParentId,
            userId: threadComment.userId,
            threadId: threadComment.threadId,
            level: threadComment.level,
            comment: threadComment.comment,
            status: threadComment.status,
            createdAt: threadComment.createdAt,
            updatedAt: threadComment.updatedAt,
        });
    });

    return { result: result, totalThreadComment: totalThreadComment, totalPages: totalPages };
}

export async function getThreadComments(): Promise<ThreadCommentModel[]> {
    const url: string = `${process.env.REACT_APP_SERVER_URL}/thread-comment`;
    return (await getThreadComment(url)).result;
}


export async function getListThreadComment(page: number): Promise<ResultInterface> {
    const url: string = `${process.env.REACT_APP_SERVER_URL}/thread-comment?sort=commentId,desc&size=8&page=${page}`;
    return getThreadComment(url);
}

export async function deleteThreadComment(commentId: number) {
    const url: string = `${process.env.REACT_APP_SERVER_URL}/thread-comment/${commentId}`;
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


export async function getThreadCommentById(commentId: number): Promise<ThreadCommentModel | null> {
    const url: string = `${process.env.REACT_APP_SERVER_URL}/thread-comment/${commentId}`;
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
        const threadCommentData = await response.json();
        if (!threadCommentData) {
            throw new Error('Không tồn tài!');
        }
        return {
            commentId: threadCommentData.commentId,
            commentParentId: threadCommentData.commentParentId,
            userId: threadCommentData.userId,
            threadId: threadCommentData.threadId,
            level: threadCommentData.level,
            comment: threadCommentData.comment,
            status: threadCommentData.status,
            createdAt: threadCommentData.createdAt,
            updatedAt: threadCommentData.updatedAt,
        }
    } catch (error) {
        console.error('Error: ', error);
        return null;
    }
}


export async function getThreadCommentsByThreadId(threadId: number): Promise<ThreadCommentModel[]> {
    const result: ThreadCommentModel[] = [];
    const url: string = `${process.env.REACT_APP_SERVER_URL}/thread/${threadId}/threadComments`;

    const response: Response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    const responseData = await response.json();

    if (!response.ok) {
        throw new Error(`Error ${response.status}: ${responseData.message}`);
    }

    responseData._embedded.threadComments.forEach((threadComment: any) => {
        result.push({
            commentId: threadComment.commentId,
            commentParentId: threadComment.commentParentId,
            userId: threadComment.userId,
            threadId: threadComment.threadId,
            level: threadComment.level,
            comment: threadComment.comment,
            status: threadComment.status,
            createdAt: threadComment.createdAt,
            updatedAt: threadComment.updatedAt,
        });
    });

    return result;
}



export async function getRepliesByThreadId(threadId: number): Promise<number> {
    // let result: number = 0;
    const url: string = `${process.env.REACT_APP_SERVER_URL}/thread/${threadId}/threadComments`;

    const response: Response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    const responseData = await response.json();

    if (!response.ok) {
        throw new Error(`Error ${response.status}: ${responseData.message}`);
    }

    return responseData._embedded.threadComments.length;

}
