import PageModel from "../models/PageModel";

interface ResultInterface {
    result: PageModel[];
    totalPages: number;
    totalPage: number;
}

export async function getPage(url: string): Promise<ResultInterface> {
    const result: PageModel[] = [];

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

    const totalPages: number = responseData.page.totalPages;
    const totalPage: number = responseData.page.totalElements;

    responseData._embedded.pages.forEach((pageData: any) => {
        result.push({
            pageId: pageData.pageId,
            pageName: pageData.pageName,
            shortDesc: pageData.shortDesc,
            detail: pageData.detail,
            userId: pageData.userId,
            createdAt: pageData.createdAt,
            updatedAt: pageData.updatedAt,
        });
    });

    return { result: result, totalPage: totalPage, totalPages: totalPages };
}

export async function getPages(): Promise<PageModel[]> {
    const url: string = `${process.env.REACT_APP_SERVER_URL}/page`;
    return (await getPage(url)).result;
}


export async function getListPage(page: number): Promise<ResultInterface> {
    const url: string = `${process.env.REACT_APP_SERVER_URL}/page?sort=pageId,asc&size=8&page=${page}`;
    return getPage(url);
}

export async function deletePage(pageId: number) {
    const url: string = `${process.env.REACT_APP_SERVER_URL}/page/${pageId}`;
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


export async function getPageById(pageId: number): Promise<PageModel | null> {
    const url: string = `${process.env.REACT_APP_SERVER_URL}/page/${pageId}`;
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
        const pageData = await response.json();
        if (!pageData) {
            throw new Error('Không tồn tài!');
        }
        return {
            pageId: pageData.pageId,
            pageName: pageData.pageName,
            shortDesc: pageData.shortDesc,
            detail: pageData.detail,
            userId: pageData.userId,
            createdAt: pageData.createdAt,
            updatedAt: pageData.updatedAt,
        }
    } catch (error) {
        console.error('Error: ', error);
        return null;
    }
}
