import TheoryExampleModel from "../models/TheoryExampleModel";

interface ResultInterface {
    result: TheoryExampleModel[];
    totalPages: number;
    totalTheoryExample: number;
}

export async function getTheoryExample(url: string): Promise<ResultInterface> {
    const result: TheoryExampleModel[] = [];
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
    const totalTheoryExample: number = responseData.page.totalElements;

    responseData._embedded.theoryExamples.forEach((theoryExampleData: any) => {
        result.push({
            exampleId: theoryExampleData.exampleId,
            name: theoryExampleData.name,
            answer: theoryExampleData.answer,
            userId: theoryExampleData.userId,
            createdAt: theoryExampleData.createdAt,
            updatedAt: theoryExampleData.updatedAt,
        });
    });

    return { result: result, totalTheoryExample: totalTheoryExample, totalPages: totalPages };
}

export async function getTheoryExamples(): Promise<TheoryExampleModel[]> {
    const url: string = `${process.env.REACT_APP_SERVER_URL}/theory-example`;
    return (await getTheoryExample(url)).result;
}


export async function getListTheoryExample(page: number): Promise<ResultInterface> {
    const url: string = `${process.env.REACT_APP_SERVER_URL}/theory-example?sort=exampleId,asc&size=8&page=${page}`;
    return getTheoryExample(url);
}


export async function deleteTheoryExample(exampleId: number) {
    const url: string = `${process.env.REACT_APP_SERVER_URL}/theory-example/${exampleId}`;
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


export async function getTheoryExampleById(exampleId: number): Promise<TheoryExampleModel | null> {
    const url: string = `${process.env.REACT_APP_SERVER_URL}/theory-example/${exampleId}`;

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
            name: responseData.name,
            answer: responseData.answer,
            userId: responseData.userId,
            createdAt: responseData.createdAt,
            updatedAt: responseData.updatedAt,
        }
    } catch (error) {
        console.error('Error: ', error);
        return null;
    }
}
