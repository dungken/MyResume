import TheoryExampleModel from "../models/TheoryExampleModel";
import TheoryKeywordModel from "../models/TheoryKeywordModel";
import TheoryModel from "../models/TheoryModel";

interface ResultInterface {
    result: TheoryKeywordModel[];
    totalPages: number;
    totalTheoryKeyword: number;
}

export async function getTheoryKeyword(url: string): Promise<ResultInterface> {
    const result: TheoryKeywordModel[] = [];
    const token = localStorage.getItem('token');

    const response: Response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    const responseData = await response.json(); // Phải await để chờ dữ liệu JSON được trả về

    if (!response.ok) {
        throw new Error(`Error ${response.status}: ${responseData.message}`);
    }

    const totalPages: number = responseData.page.totalPages;
    const totalTheoryKeyword: number = responseData.page.totalElements;

    responseData._embedded.theoryKeywords.forEach((theoryKeywordData: any) => {
        result.push({
            keywordId: theoryKeywordData.keywordId,
            theoryDetailId: theoryKeywordData.theoryDetailId,
            keyword: theoryKeywordData.keyword,
            userId: theoryKeywordData.userId,
            createdAt: theoryKeywordData.createdAt,
            updatedAt: theoryKeywordData.updatedAt,
        });
    });

    return { result: result, totalTheoryKeyword: totalTheoryKeyword, totalPages: totalPages };
}

export async function getTheoryKeywords(): Promise<TheoryKeywordModel[]> {
    const url: string = `${process.env.REACT_APP_SERVER_URL}/theory-keyword`;
    return (await getTheoryKeyword(url)).result;
}


export async function getListTheoryKeyword(page: number): Promise<ResultInterface> {
    const url: string = `${process.env.REACT_APP_SERVER_URL}/theory-keyword?sort=keywordId,asc&size=20&page=${page}`;
    return getTheoryKeyword(url);
}


export async function deleteTheoryKeyword(keywordId: number) {
    const url: string = `${process.env.REACT_APP_SERVER_URL}/theory-keyword/${keywordId}`;
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


export async function getTheoryKeywordById(keywordId: number): Promise<TheoryKeywordModel | null> {
    const url: string = `${process.env.REACT_APP_SERVER_URL}/theory-keyword/${keywordId}`;

    try {
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
            keywordId: responseData.keywordId,
            theoryDetailId: responseData.theoryDetailId,
            keyword: responseData.keyword,
            userId: responseData.userId,
            createdAt: responseData.createdAt,
            updatedAt: responseData.updatedAt,
        }
    } catch (error) {
        console.error('Error: ', error);
        return null;
    }
}


export async function getTheoryByKeywordExample(keyword: string): Promise<TheoryExampleModel | null> {
    const url: string = `${process.env.REACT_APP_SERVER_URL}/api/theory/example/keyword/search/${keyword}`;

    try {
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
            exampleId: responseData.exampleId,
            userId: responseData.userId,
            name: responseData.name,
            answer: responseData.answer,
            createdAt: responseData.createdAt,
            updatedAt: responseData.updatedAt,
        }
    } catch (error) {
        console.error('Error: ', error);
        return null;
    }
}


export async function getTheoryByKeyword(keyword: string): Promise<TheoryModel | null> {
    const url: string = `${process.env.REACT_APP_SERVER_URL}/api/theory/keyword/search/${keyword}`;

    try {
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
