import { useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import SideBar from '../sidebar/SideBar';
import RequireAdmin from '../require/AdminRequire';
import RoleModel from '../../models/RoleModel';
import { getPermission } from '../../api/PermissionAPI';
import { getRoleById } from '../../api/RoleAPI';
import PermissionModel from '../../models/PermissionModel';
import AdminRequire from '../require/AdminRequire';

function RoleFormUpdate() {
    const { roleIdParam } = useParams();

    let roleId = 0;
    try {
        roleId = parseInt(roleIdParam + '');
    } catch (error) {
        roleId = 0;
        console.log('Error', error);
    }
    if (Number.isNaN(roleId))
        roleId = 0;


    const [role, setRole] = useState<RoleModel | null>(null);
    const [roleName, setRoleName] = useState('');
    const [desc, setDesc] = useState('');
    const [permissions, setPermissions] = useState<PermissionModel[] | null>(null);
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

    // Các biến báo lỗi
    const [errorRoleName, setErrorRoleName] = useState("");
    const [errorDesc, setErrorDesc] = useState("");
    const [successNoti, setSuccessNoti] = useState("");
    const [errorNoti, setErrorNoti] = useState("");

    useEffect(() => {
        getRoleById(roleId)
            .then((res) => {
                setRole(res);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
    }, [roleId]);

    useEffect(() => {
        getPermission(`${process.env.REACT_APP_SERVER_URL}/permission`)
            .then((res) => {
                setPermissions(res.result);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
    }, [roleId]);


    useEffect(() => {
        if (role !== null) {
            setRoleName(role.roleName === undefined ? '' : role.roleName)
            setDesc(role.desc === undefined ? '' : role.desc)
        }
    }, [role]);

    const handleSubmit = (e: React.FormEvent) => {
        // Clear 
        setErrorRoleName('');
        setErrorDesc('');

        // Prevent default
        e.preventDefault();

        // 
        if (roleName && desc && selectedPermissions) {
            const token = localStorage.getItem('token');
            fetch(`${process.env.REACT_APP_SERVER_URL}/api/role/update`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        roleId: roleId,
                        roleName: roleName,
                        desc: desc,
                        permissions: selectedPermissions,
                    })
                }
            ).then((response) => {
                if (response.ok) {
                    setSuccessNoti("Role updated successfully!");
                    setRoleName('');
                    setDesc('');
                } else {
                    setErrorNoti("Error while updating roles!");
                }
            })
        }
    }

    const handleOnChangeRoleName = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value) {
            setRoleName(e.target.value);
            setErrorRoleName('');
        } else {
            setRoleName('');
            setErrorRoleName('This field cannot be left blank');
        }
    }

    const handleOnChangeDesc = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value) {
            setDesc(e.target.value);
            setErrorDesc('');
        } else {
            setDesc('');
            setErrorDesc('This field cannot be left blank');
        }
    }

    const handlePermissionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const permissionId = event.target.value;
        const isChecked = event.target.checked;

        if (isChecked) {
            setSelectedPermissions([...selectedPermissions, permissionId]); // Thêm quyền được chọn vào danh sách
        } else {
            setSelectedPermissions(selectedPermissions.filter(id => id !== permissionId)); // Xóa quyền được bỏ chọn khỏi danh sách
        }
    };


    // Hàm để lấy danh sách các module từ dữ liệu permissions
    const getModules = (): { [key: string]: PermissionModel[] } => {
        if (!permissions) return {};

        // Sử dụng phương thức reduce để tạo một đối tượng với các module làm khóa
        return permissions.reduce((modules: { [key: string]: PermissionModel[] }, permission: PermissionModel) => {
            const moduleName: string = permission.name;
            if (!modules[moduleName]) {
                modules[moduleName] = [];
            }
            modules[moduleName].push(permission);
            return modules;
        }, {});
    }

    // Hàm để render HTML cho từng module
    const renderModulePermissions = (moduleName: string, modulePermissions: PermissionModel[]): JSX.Element => {
        return (
            <div key={moduleName}>
                <div className="card my-4 border">
                    <div className="card-header">
                        <label htmlFor={moduleName.toLowerCase()} className="m-2">Module {moduleName}</label>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            {/* Mapping through modulePermissions array and rendering each permission */}
                            {modulePermissions.map(permission => (
                                <div className="col-md-3" key={permission.permissionId}>
                                    <input type="checkbox" className="permission m-2" value={permission.permissionId} name="permission_id[]" id={permission.slug} onChange={handlePermissionChange} />
                                    <label htmlFor={permission.slug}>{permission.desc}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Lấy danh sách các module
    const modules = getModules();

    return (
        <div id="layoutSidenav" className="container-fluid" style={{ minHeight: '700px', textAlign: 'left' }}>
            <div className="row">
                <div className="col-md-2">
                    <SideBar />
                </div>
                <div id="layoutSidenav_content" className="col-md-10">
                    <main>
                        <div id="content" className="container-fluid text-start">
                            <div className="card">
                                <div className="card-header font-weight-bold d-flex justify-content-between align-items-center">
                                    <h5 className="m-2 ">Cập nhật vai trò</h5>
                                </div>
                                <div className="card-body">
                                    <form method="POST" action=""
                                        onSubmit={handleSubmit}
                                    >

                                        <div className="form-group mt-2">
                                            <label className="text-strong" htmlFor="name">Tên vai trò <span className="text-danger">(*) {errorRoleName}</span></label>
                                            <input className="form-control" type="text" name="name" id="name"
                                                value={roleName}
                                                onChange={handleOnChangeRoleName}
                                            />
                                        </div>
                                        <div className="form-group my-4">
                                            <label className="text-strong" htmlFor="description">Mô tả <span className="text-danger">(*) {errorDesc}</span></label>
                                            <input className="form-control" type="text" name="desc" id="desc"
                                                value={desc}
                                                onChange={handleOnChangeDesc}
                                            />
                                        </div>
                                        <strong className="pt-2">Vai trò này có quyền gì?</strong>
                                        <small className="form-text text-muted pb-2"> Check vào module hoặc các hành động bên dưới để chọn quyền.</small>
                                        <div>
                                            {/* Duyệt qua danh sách các module và render HTML tương ứng */}
                                            {Object.keys(modules).map(moduleName => (
                                                renderModulePermissions(moduleName, modules[moduleName])
                                            ))}
                                        </div>
                                        <div>
                                            {
                                                successNoti && <NavLink to='/admin/role/list' className="btn btn-info btn-sm w-25 col-md-6 mx-4 mt-4">View list role</NavLink>
                                            }
                                            <button type="submit" className="btn btn-primary btn-sm w-25 col-md-6 mt-4">Update</button>
                                        </div>
                                        {successNoti && <div className="text-success">{successNoti}</div>}
                                        {errorNoti && <div className="text-danger">{errorNoti}</div>}
                                    </form>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}
export default AdminRequire(RoleFormUpdate);