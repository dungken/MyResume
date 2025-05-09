import RoleModel from "../models/RoleModel";

interface ResultInterface {
    result: RoleModel[];
    totalPages: number;
    totalRole: number;
}

export async function getRole(url: string): Promise<ResultInterface> {
    const result: RoleModel[] = [];
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
    const totalRole: number = responseData.page.totalElements;

    responseData._embedded.roles.forEach((roleData: any) => {
        result.push({
            roleId: roleData.roleId,
            roleName: roleData.roleName,
            desc: roleData.desc,
            createdAt: roleData.createdAt,
            updatedAt: roleData.updatedAt,
            permissions: roleData.permissons
        });
    });
    return { result: result, totalRole: totalRole, totalPages: totalPages };
}

export async function getRoles(page: number): Promise<ResultInterface> {
    const url: string = `${process.env.REACT_APP_SERVER_URL}/role?sort=roleId,asc&size=4&page=${page}`;
    return getRole(url);
}

export async function deleteRole(id: number) {
    const url: string = `${process.env.REACT_APP_SERVER_URL}/role/${id}`;
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
        console.error('Error deleting role:', error);
        throw error; // Ném lỗi để xử lý tại nơi gọi hàm này nếu cần
    }
}


export async function getRoleById(id: number): Promise<RoleModel | null> {
    const url: string = `${process.env.REACT_APP_SERVER_URL}/role/${id}`;
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
            throw new Error(`Lỗi khi truy cập đến API lấy role! ${url}`);
        }

        const roleData = await response.json();
        if (!roleData) {
            throw new Error('User không tồn tài!');
        }
        return {
            roleId: roleData.roleId,
            roleName: roleData.roleName,
            desc: roleData.desc,
            createdAt: roleData.createdAt,
            updatedAt: roleData.updatedAt,
            permissions: roleData.permissons
        }
    } catch (error) {
        console.error('Error: ', error);
        return null;
    }
}
