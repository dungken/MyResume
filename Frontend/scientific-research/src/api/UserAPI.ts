import UserModel from "../models/UserModel";

interface ResultInterface {
    result: UserModel[];
    totalPages: number;
    totalUser: number;
}

async function getUser(url: string): Promise<ResultInterface> {
    const result: UserModel[] = [];
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
    const totalUser: number = responseData.page.totalElements;

    responseData._embedded.users.forEach((userData: any) => {
        result.push({
            userId: userData.userId,
            username: userData.username,
            email: userData.email,
            active: userData.active,
            gender: userData.gender,
            roles: userData.roles,
            createdAt: userData.createdAt,
            updatedAt: userData.updatedAt,
            firstname: userData.firstname,
            lastname: userData.lastname,
            address: userData.address,
            avatar: userData.avatar,
            phoneNumber: userData.phoneNumber
        });
    });

    return { result: result, totalUser: totalUser, totalPages: totalPages };
}

export async function getUsers(page: number): Promise<ResultInterface> {
    const url: string = `${process.env.REACT_APP_SERVER_URL}/user?sort=userId,desc&size=8&page=${page}`;
    return getUser(url);
}

export async function getUserById(id: number): Promise<UserModel | null> {
    const url: string = `${process.env.REACT_APP_SERVER_URL}/user/${id}`;
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
            throw new Error(`Lỗi khi truy cập đến API lấy user! ${url}`);
        }
        const userData = await response.json();
        if (!userData) {
            throw new Error('User không tồn tài!');
        }
        return {
            userId: userData.userId,
            username: userData.username,
            email: userData.email,
            active: userData.active,
            gender: userData.gender,
            createdAt: userData.createdAt,
            updatedAt: userData.updatedAt,
            roles: userData.roles,
            firstname: userData.firstname,
            lastname: userData.lastname,
            address: userData.address,
            avatar: userData.avatar,
            phoneNumber: userData.phoneNumber
        }
    } catch (error) {
        console.error('Error: ', error);
        return null;
    }
}

export async function findUser(keyword: string): Promise<ResultInterface> {
    const url: string = `${process.env.REACT_APP_SERVER_URL}/user/search/findByUsernameContaining?sort=userId,desc&size=8&page=0&username=${keyword}`;
    return getUser(url);
}

export async function deleteUser(id: number) {
    const url: string = `${process.env.REACT_APP_SERVER_URL}/user/${id}`;
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



export async function getUserByPostId(postId: number): Promise<UserModel | null> {
    const url: string = `${process.env.REACT_APP_SERVER_URL}/post-detail/${postId}/user`;
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
        const userData = await response.json();
        if (!userData) {
            throw new Error('Không tồn tài!');
        }
        return {
            userId: userData.userId,
            username: userData.username,
            email: userData.email,
            active: userData.active,
            gender: userData.gender,
            createdAt: userData.createdAt,
            updatedAt: userData.updatedAt,
            roles: userData.roles,
            firstname: userData.firstname,
            lastname: userData.lastname,
            address: userData.address,
            avatar: userData.avatar,
            phoneNumber: userData.phoneNumber
        }
    } catch (error) {
        console.error('Error: ', error);
        return null;
    }
}



export async function getUserByThreadId(threadId: number): Promise<UserModel | null> {
    const url: string = `${process.env.REACT_APP_SERVER_URL}/thread/${threadId}/user`;
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
        const userData = await response.json();
        if (!userData) {
            throw new Error('Không tồn tài!');
        }
        return {
            userId: userData.userId,
            username: userData.username,
            email: userData.email,
            active: userData.active,
            gender: userData.gender,
            createdAt: userData.createdAt,
            updatedAt: userData.updatedAt,
            roles: userData.roles,
            firstname: userData.firstname,
            lastname: userData.lastname,
            address: userData.address,
            avatar: userData.avatar,
            phoneNumber: userData.phoneNumber
        }
    } catch (error) {
        console.error('Error: ', error);
        return null;
    }
}