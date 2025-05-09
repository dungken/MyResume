import ThreadModel from "../models/ThreadModel";

interface ResultInterface {
    result: ThreadModel[];
    totalPages: number;
    totalThread: number;
}

export async function getThread(url: string): Promise<ResultInterface> {
    const result: ThreadModel[] = [];
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
    const totalThread: number = responseData.page.totalElements;

    responseData._embedded.threads.forEach((thread: any) => {
        result.push({
            threadId: thread.threadId,
            threadCatId: thread.threadCatId,
            userId: thread.userId,
            shortQuestion: thread.shortQuestion,
            detailQuestion: thread.detailQuestion,
            views: thread.views,
            votes: thread.votes,
            replies: thread.replies,
            status: thread.status,
            createdAt: thread.createdAt,
            updatedAt: thread.updatedAt,
        });
    });

    return { result: result, totalThread: totalThread, totalPages: totalPages };
}

export async function getThreads(): Promise<ThreadModel[]> {
    const url: string = `${process.env.REACT_APP_SERVER_URL}/thread`;
    return (await getThread(url)).result;
}


export async function getListThread(page: number): Promise<ResultInterface> {
    const url: string = `${process.env.REACT_APP_SERVER_URL}/thread?sort=threadId,desc&size=5&page=${page}`;
    return getThread(url);
}

export async function deleteThread(threadId: number) {
    const url: string = `${process.env.REACT_APP_SERVER_URL}/thread/${threadId}`;
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


export async function getThreadById(threadId: number): Promise<ThreadModel | null> {
    const url: string = `${process.env.REACT_APP_SERVER_URL}/thread/${threadId}`;
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
        const threadData = await response.json();
        if (!threadData) {
            throw new Error('Không tồn tài!');
        }
        return {
            threadId: threadData.threadId,
            threadCatId: threadData.threadCatId,
            userId: threadData.userId,
            shortQuestion: threadData.shortQuestion,
            detailQuestion: threadData.detailQuestion,
            views: threadData.views,
            votes: threadData.votes,
            replies: threadData.replies,
            status: threadData.status,
            createdAt: threadData.createdAt,
            updatedAt: threadData.updatedAt,
        }
    } catch (error) {
        console.error('Error: ', error);
        return null;
    }
}



export async function getThreadByThreadCommentId(commentId: number): Promise<ThreadModel | null> {
    const url: string = `${process.env.REACT_APP_SERVER_URL}/thread-comment/${commentId}/thread`;
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
        const threadData = await response.json();
        if (!threadData) {
            throw new Error('Không tồn tài!');
        }
        return {
            threadId: threadData.threadId,
            threadCatId: threadData.threadCatId,
            userId: threadData.userId,
            shortQuestion: threadData.shortQuestion,
            detailQuestion: threadData.detailQuestion,
            views: threadData.views,
            votes: threadData.votes,
            replies: threadData.replies,
            status: threadData.status,
            createdAt: threadData.createdAt,
            updatedAt: threadData.updatedAt,
        }
    } catch (error) {
        console.error('Error: ', error);
        return null;
    }
}



export async function getThreadByThreadCatId(commentId: number): Promise<ThreadModel | null> {
    const url: string = `${process.env.REACT_APP_SERVER_URL}/thread-cat/${commentId}/thread`;
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
        const threadData = await response.json();
        if (!threadData) {
            throw new Error('Không tồn tài!');
        }
        return {
            threadId: threadData.threadId,
            threadCatId: threadData.threadCatId,
            userId: threadData.userId,
            shortQuestion: threadData.shortQuestion,
            detailQuestion: threadData.detailQuestion,
            views: threadData.views,
            votes: threadData.votes,
            replies: threadData.replies,
            status: threadData.status,
            createdAt: threadData.createdAt,
            updatedAt: threadData.updatedAt,
        }
    } catch (error) {
        console.error('Error: ', error);
        return null;
    }
}
