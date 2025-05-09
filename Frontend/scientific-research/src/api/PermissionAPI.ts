
import PermissionModel from "../models/PermissionModel";

interface ResultInterface {
    result: PermissionModel[];
    totalPages: number;
    totalPermission: number;
}

export async function getPermission(url: string): Promise<ResultInterface> {
    const result: PermissionModel[] = [];
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
    const totalPermission: number = responseData.page.totalElements;

    responseData._embedded.permissions.forEach((permissionData: any) => {
        result.push({
            permissionId: permissionData.permissionId,
            name: permissionData.name,
            slug: permissionData.slug,
            desc: permissionData.desc,
            createdAt: permissionData.createdAt,
            updatedAt: permissionData.updatedAt,
        });
    });

    return { result: result, totalPermission: totalPermission, totalPages: totalPages };
}

export async function getPermissions(page: number): Promise<ResultInterface> {
    const url: string = `${process.env.REACT_APP_SERVER_URL}/permission?sort=permissionId,desc&size=8&page=${page}`;
    return getPermission(url);
}

export async function getPermissionsByRoleId(roleId: number): Promise<PermissionModel[]> {
    const url: string = `${process.env.REACT_APP_SERVER_URL}/role/${roleId}/permissions`;
    const result: PermissionModel[] = [];
    const token = localStorage.getItem('token');

    const response: Response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    const responseData = await response.json(); // Phải await để chờ dữ liệu JSON được trả về

    // Kiểm tra xem có lỗi trong phản hồi không
    if (!response.ok) {
        throw new Error(`Error ${response.status}: ${responseData.message}`);
    }

    // Duyệt qua mảng dữ liệu để lấy thông tin của mỗi user
    responseData._embedded.permissions.forEach((permissionData: any) => {
        result.push({
            permissionId: permissionData.permissionId,
            name: permissionData.name,
            slug: permissionData.slug,
            desc: permissionData.desc,
            createdAt: permissionData.createdAt,
            updatedAt: permissionData.updatedAt,
        });
    });

    return result;
}


export async function deletePermission(id: number) {
    const url: string = `${process.env.REACT_APP_SERVER_URL}/permission/${id}`;
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
        throw error; 
    }
}


export async function getPermissionById(id: number): Promise<PermissionModel | null> {
    const url: string = `${process.env.REACT_APP_SERVER_URL}/permission/${id}`;
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
            throw new Error(`Lỗi khi truy cập đến API lấy permission! ${url}`);
        }
        const permissionData = await response.json();
        if (!permissionData) {
            throw new Error('User không tồn tài!');
        }
        return {
            permissionId: permissionData.permissionId,
            name: permissionData.name,
            slug: permissionData.slug,
            desc: permissionData.desc,
            createdAt: permissionData.createdAt,
            updatedAt: permissionData.updatedAt,
        }
    } catch (error) {
        console.error('Error: ', error);
        return null;
    }
}
