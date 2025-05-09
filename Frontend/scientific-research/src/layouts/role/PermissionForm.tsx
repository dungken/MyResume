import { useState } from "react";
import SideBar from "../sidebar/SideBar";
import { NavLink } from "react-router-dom";
import AdminRequire from "../require/AdminRequire";

function PermissionForm() {

    const [permissionName, setPermissionName] = useState<string>('');
    const [slug, setSlug] = useState<string>('');
    const [desc, setDesc] = useState<string>('');

    const [errorPermissionName, setErrorPermissionName] = useState<string>('');
    const [errorSlug, setErrorSlug] = useState<string>('');
    const [successNoti, setSuccessNoti] = useState("");
    const [errorNoti, setErrorNoti] = useState("");


    const handleOnChangePermissionName = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value) {
            setPermissionName(e.target.value);
            setErrorPermissionName('');
        } else {
            setPermissionName('');
            setErrorPermissionName('This field cannot be left blank');
        }
    }

    const handleOnChangeSlug = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value) {
            setSlug(e.target.value);
            setErrorSlug('');
        } else {
            setSlug('');
            setErrorSlug('This field cannot be left blank');
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        // Clear 
        setErrorPermissionName('');
        setErrorSlug('');

        // Prevent default
        e.preventDefault();

        // 
        if (permissionName && slug) {
            const token = localStorage.getItem('token');
            fetch(`${process.env.REACT_APP_SERVER_URL}/permission`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        permissionId: 0,
                        name: permissionName,
                        desc: desc,
                        slug: slug,
                    })
                }
            ).then((response) => {
                if (response.ok) {
                    setSuccessNoti("Permission added successfully!");
                    setPermissionName('');
                    setDesc('');
                    setSlug('');

                } else {
                    setErrorNoti("Error while adding permissions!");
                }
            })
        }
    }

    return (
        <div id="layoutSidenav" className="container-fluid " style={{ minHeight: '700px', textAlign: 'left' }}>
            <div className="row">
                <div className="col-md-2">
                    <SideBar />
                </div>
                <div id="layoutSidenav_content" className="col-md-10">
                    <main className="w-50 mt-4">
                        <div className="card">
                            <div className="card-header font-weight-bold" style={{fontWeight: 'bold'}}>
                                Add Permission
                            </div>
                            <div className="container">
                                <div className="row">
                                    <div className="card-body col-md-4">
                                        <form onSubmit={handleSubmit}>
                                            <div className="form-group mt-2">
                                                <label htmlFor="name">Permission name <span className="text-danger">(*) {errorPermissionName}</span></label>
                                                <input className="form-control" type="text" name="name" id="name"
                                                    value={permissionName}
                                                    onChange={handleOnChangePermissionName}
                                                />
                                            </div>
                                            <div className="form-group mt-2">
                                                <label htmlFor="slug">Slug</label>
                                                <small className="form-text text-muted pb-2 p-2">Example: user.add <span className="text-danger">(*) {errorSlug}</span></small>
                                                <input className="form-control" type="text" name="slug" id="slug"
                                                    value={slug}
                                                    onChange={handleOnChangeSlug}
                                                />
                                            </div>
                                            <div className="form-group mt-2">
                                                <label htmlFor="description">Description</label>
                                                <input className="form-control" name="description" id="description" type="text"
                                                    value={desc}
                                                    onChange={(e) => setDesc(e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                {
                                                    successNoti && <NavLink to='/admin/role/permission/list' className="btn btn-info btn-sm w-25 col-md-6 mx-4 mt-4">View list permission</NavLink>
                                                }
                                                <button type="submit" className="btn btn-primary btn-sm w-25 col-md-6 mt-4">Add</button>
                                            </div>
                                            {successNoti && <div className="text-success">{successNoti}</div>}
                                            {errorNoti && <div className="text-danger">{errorNoti}</div>}
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}

export default AdminRequire(PermissionForm);