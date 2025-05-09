import { useEffect, useState } from "react";
import SideBar from "../../sidebar/SideBar";
import { NavLink } from "react-router-dom";
import TheoryCatModel from "../../../models/TheoryCatModel";
import { getAllTheoryCats, getTheoryCats } from "../../../api/TheoryCatAPI";
import { jwtDecode } from "jwt-decode";
import JwtPayload from "../../../models/JwtPayLoad";
import AdminOrStaffRequire from "../../require/AdminOrStaffRequire";

function AdminTheoryCatForm() {
    const [theoryCats, setTheoryCats] = useState<TheoryCatModel[]>([]);
    const [name, setName] = useState<string>('');
    const [shortDesc, setShortDesc] = useState<string>('');
    const [theoryCatParent, setTheoryCatParent] = useState<number>(1);

    const [errorName, setErrorName] = useState<string>('');
    const [errorShortDesc, setErrorShortDesc] = useState<string>('');
    const [successNoti, setSuccessNoti] = useState("");
    const [errorNoti, setErrorNoti] = useState("");

    useEffect(() => {
        getAllTheoryCats()
            .then(
                result => {
                    setTheoryCats(result);
                }
            )
    }, [])

    const handleOnChangeName = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value) {
            setName(e.target.value);
            setErrorName('');
        } else {
            setName('');
            setErrorName('This field cannot be left blank!');
        }
    }

    const handleOnChangeShortDesc = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value) {
            setShortDesc(e.target.value);
            setErrorShortDesc('');
        } else {
            setShortDesc('');
            setErrorShortDesc('This field cannot be left blank!');
        }
    }

    const handleTheoryCatParent = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setTheoryCatParent(parseInt(event.target.value));
    }


    const handleSubmit = (e: React.FormEvent) => {
        // Clear 
        setErrorName('');
        setErrorShortDesc('');

        // Prevent default
        e.preventDefault();

        // 
        const token = localStorage.getItem('token');
        if (name && shortDesc && theoryCatParent && token) {
            const decodedToken = jwtDecode(token) as JwtPayload;
            const userId = decodedToken.userId;

            fetch(`${process.env.REACT_APP_SERVER_URL}/api/theory/cat/add`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        theoryCatId: 0,
                        theoryParentCatId: theoryCatParent,
                        userId: userId,
                        name: name,
                        shortDesc: shortDesc
                    })
                }
            ).then((response) => {
                if (response.ok) {
                    setSuccessNoti("Added successfully!");
                    setName('');
                    setShortDesc('');
                    setTheoryCatParent(1);
                } else {
                    setErrorNoti("An error occurred while adding!");
                }
            })
        }
    }

    return (
        <div id="layoutSidenav" className="container-fluid" style={{ minHeight: '700px', textAlign: 'left' }}>
            <div className="row">
                <div className="col-md-2">
                    <SideBar />
                </div>
                <div id="layoutSidenav_content" className="col-md-10">
                    <main>
                        <div id="content" className="container-fluid">
                            <div className="row">
                                <div className="col-12">
                                    <div className="card">
                                        <div className="card-header font-weight-bold" style={{fontWeight: 'bold'}}>
                                            Add Theory Topic
                                        </div>
                                        <div className="card-body">
                                            <form onSubmit={handleSubmit}>
                                                <div className="form-group mt-2">
                                                    <label htmlFor="name">Topic Name
                                                        <span className="text-danger">(*) {errorName}</span>
                                                    </label>
                                                    <input className="form-control" type="text" name="name" id="name"
                                                        value={name}
                                                        onChange={handleOnChangeName}
                                                    />
                                                </div>

                                                <div className="form-group mt-2">
                                                    <label htmlFor="desc">Short Description
                                                        <span className="text-danger">(*) {errorShortDesc}</span>
                                                    </label>
                                                    <input className="form-control" type="text" name="name" id="desc"
                                                        value={shortDesc}
                                                        onChange={handleOnChangeShortDesc}
                                                    />
                                                </div>

                                                <div className="form-group mt-2">
                                                    <label htmlFor="">Belong to Topic</label>
                                                    <select className="form-control" id=""
                                                        value={theoryCatParent}
                                                        onChange={handleTheoryCatParent}
                                                    >
                                                        <option value={1}>Parent Topic</option>
                                                        {
                                                            theoryCats.map((theoryCat) => (
                                                                <option
                                                                    key={theoryCat.theoryCatId}
                                                                    value={theoryCat.theoryCatId}
                                                                >{theoryCat.name}</option>
                                                            ))
                                                        }
                                                    </select>
                                                </div>
                                                <div>
                                                    {
                                                        successNoti && <NavLink to='/admin/theory/topic/list' className="btn btn-info btn-sm w-25 col-md-6 mx-4 mt-4">View Theory Topic</NavLink>
                                                    }
                                                    <button type="submit" className="btn btn-primary btn-sm w-25 col-md-6 mt-4">Add New</button>
                                                </div>
                                                {successNoti && <div className="text-success">{successNoti}</div>}
                                                {errorNoti && <div className="text-danger">{errorNoti}</div>}
                                            </form>
                                        </div>
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

export default AdminOrStaffRequire(AdminTheoryCatForm);