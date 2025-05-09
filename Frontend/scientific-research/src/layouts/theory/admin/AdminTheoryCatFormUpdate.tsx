import { useEffect, useState } from "react";
import SideBar from "../../sidebar/SideBar";
import { NavLink, useParams } from "react-router-dom";
import TheoryCatModel from "../../../models/TheoryCatModel";
import { getAllTheoryCats, getTheoryCatById } from "../../../api/TheoryCatAPI";
import { jwtDecode } from "jwt-decode";
import JwtPayload from "../../../models/JwtPayLoad";
import AdminOrStaffRequire from "../../require/AdminOrStaffRequire";

function AdminTheoryCatFormUpdate() {
    const { theoryCatIdParam } = useParams();

    let theoryCatId = 0;
    try {
        theoryCatId = parseInt(theoryCatIdParam + '');
    } catch (error) {
        theoryCatId = 0;
        console.log('Error', error);
    }
    if (Number.isNaN(theoryCatId))
        theoryCatId = 0;

    const [theoryCats, setTheoryCats] = useState<TheoryCatModel[]>([]);
    const [theoryCat, setTheoryCat] = useState<TheoryCatModel | null>(null);
    const [name, setName] = useState<string>('');
    const [shortDesc, setShortDesc] = useState<string>('');
    const [theoryParentCatId, setTheoryCatParentId] = useState<number>(1);

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

    useEffect(() => {
        getTheoryCatById(theoryCatId)
            .then((res) => {
                setTheoryCat(res);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
    }, [theoryCatId]);

    useEffect(() => {
        if (theoryCat !== null) {
            setName(theoryCat.name === undefined ? '' : theoryCat.name);
            setShortDesc(theoryCat.shortDesc === undefined ? '' : theoryCat.shortDesc);
            setTheoryCatParentId(theoryCat.theoryParentCatId);
        }
    }, [theoryCat]);

    const handleOnChangeName = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value) {
            setName(e.target.value);
            setErrorName('');
        } else {
            setName('');
            setErrorName('This field cannot be left blank');
        }
    }

    const handleOnChangeShortDesc = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value) {
            setShortDesc(e.target.value);
            setErrorShortDesc('');
        } else {
            setShortDesc('');
            setErrorShortDesc('This field cannot be left blank');
        }
    }

    const handleTheoryCatParent = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setTheoryCatParentId(parseInt(event.target.value));
    }

    const handleSubmit = (e: React.FormEvent) => {
        // Clear 
        setErrorName('');
        setErrorShortDesc('');

        // Prevent default
        e.preventDefault();

        // 
        const token = localStorage.getItem('token');
        if (name && shortDesc && theoryParentCatId && token) {
            const decodedToken = jwtDecode(token) as JwtPayload;
            const userId = decodedToken.userId;
            fetch(`${process.env.REACT_APP_SERVER_URL}/api/theory/cat/update`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        theoryCatId: theoryCatId,
                        name: name,
                        shortDesc: shortDesc,
                        theoryParentCatId: theoryParentCatId,
                        userId: userId,
                    })
                }
            ).then((response) => {
                if (response.ok) {
                    setSuccessNoti("Updated successfully!");
                    setName('');
                    setShortDesc('');
                    setTheoryCatParentId(1);
                } else {
                    setErrorNoti("An error occurred during the update process!");
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
                                        <div className="card-header font-weight-bold"  style={{fontWeight: 'bold'}}>
                                            Edit Theory Topic
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
                                                        value={theoryParentCatId}
                                                        onChange={handleTheoryCatParent}
                                                    >
                                                        <option value={1}>Parent Topic</option>
                                                        {
                                                            theoryCats.map((theoryCat) => (
                                                                theoryCat.theoryCatId !== theoryCatId &&
                                                                <option
                                                                    key={theoryCat.theoryCatId}
                                                                    value={theoryCat.theoryCatId}
                                                                    selected={theoryCat.theoryCatId === theoryCatId}
                                                                >{theoryCat.name}</option>
                                                            ))
                                                        }
                                                    </select>
                                                </div>
                                                <div>
                                                    {
                                                        successNoti && <NavLink to='/admin/theory/topic/list' className="btn btn-info btn-sm w-25 col-md-6 mx-4 mt-4">View Theory Topic</NavLink>
                                                    }
                                                    <button type="submit" className="btn btn-primary btn-sm w-25 col-md-6 mt-4">Save</button>
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

export default AdminOrStaffRequire(AdminTheoryCatFormUpdate);