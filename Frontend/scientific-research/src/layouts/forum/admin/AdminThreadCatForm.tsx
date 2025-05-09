import { useState } from "react";
import SideBar from "../../sidebar/SideBar";
import { jwtDecode } from "jwt-decode";
import JwtPayload from "../../../models/JwtPayLoad";
import { NavLink } from "react-router-dom";
import AdminOrStaffRequire from "../../require/AdminOrStaffRequire";

function AdminThreadCatForm() {
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');

    const [errorName, setErrorName] = useState<string>('');
    const [errorDescription, setErrorDescription] = useState<string>('');
    const [successNoti, setSuccessNoti] = useState("");
    const [errorNoti, setErrorNoti] = useState("");

    const handleOnChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value) {
            setName(e.target.value);
            setErrorName('');
        } else {
            setName('');
            setErrorName('This field cannot be left blank');
        }
    }

    const handleOnChangeDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value) {
            setDescription(e.target.value);
            setErrorDescription('');
        } else {
            setDescription('');
            setErrorDescription('This field cannot be left blank');
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        setErrorName('');
        setErrorDescription('');

        e.preventDefault();

        const token = localStorage.getItem('token');
        if (name && description && token) {
            const decodedToken = jwtDecode(token) as JwtPayload;
            const userId = decodedToken.userId;

            fetch(`${process.env.REACT_APP_SERVER_URL}/api/thread/cat/add`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        threadCatId: 0,
                        name: name,
                        description: description,
                        userId: userId,
                        createdAt: '',
                    })
                }
            ).then((response) => {
                if (response.ok) {
                    setSuccessNoti("Added successfully!");
                    setName('');
                    setDescription('');
                } else {
                    setErrorNoti("Error while adding!");
                }
            })
        }
    }

    return (
        <div id="layoutSidenav " className="container-fluid" style={{ minHeight: '700px', textAlign: 'left' }}>
            <div className="row">
                <div className="col-md-2">
                    <SideBar />
                </div>
                <div id="layoutSidenav_content" className="col-md-10">
                    <main>
                        <div id="content" className="container-fluid">
                            <div className="card">
                                <div className="card-header font-weight-bold" style={{ fontWeight: 'bold' }}>
                                    Add New Thread Category
                                </div>
                                <div className="card-body">
                                    <form onSubmit={handleSubmit}>
                                        <div className="form-group mt-3">
                                            <label htmlFor="name">Thread Category Name
                                                <span className="text-danger">(*) {errorName}</span>
                                            </label>
                                            <input className="form-control" type="text" name="name" id="name"
                                                value={name}
                                                onChange={handleOnChangeName}
                                            />
                                        </div>

                                        <div className="form-group mt-3">
                                            <label htmlFor="description">Description
                                                <span className="text-danger">(*) {errorDescription}</span>
                                            </label>
                                            <input className="form-control" type="text" name="name" id="description"
                                                value={description}
                                                onChange={handleOnChangeDescription}
                                            />
                                        </div>

                                        <div>
                                            {
                                                successNoti && <NavLink to='/admin/thread/cat/list' className="btn btn-info btn-sm w-25 col-md-6 mx-4 mt-4">View list thread category </NavLink>
                                            }
                                            <button type="submit" className="btn btn-primary btn-sm w-25 col-md-6 mt-4">Add</button>
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

    );
}
export default AdminOrStaffRequire(AdminThreadCatForm);
