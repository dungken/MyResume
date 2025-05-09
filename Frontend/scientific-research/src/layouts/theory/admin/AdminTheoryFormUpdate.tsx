import { useEffect, useState } from "react";
import SideBar from "../../sidebar/SideBar";
import { jwtDecode } from "jwt-decode";
import JwtPayload from "../../../models/JwtPayLoad";
import { NavLink, useParams } from "react-router-dom";
import TheoryModel from "../../../models/TheoryModel";
import { getTheoryById } from "../../../api/TheoryAPI";
import { getAllTheoryCats, getTheoryCats } from "../../../api/TheoryCatAPI";
import TheoryCatModel from "../../../models/TheoryCatModel";
import AdminOrStaffRequire from "../../require/AdminOrStaffRequire";

function AdminTheoryFormUpdate() {
    const { theoryIdParam } = useParams();

    let theoryId = 0;
    try {
        theoryId = parseInt(theoryIdParam + '');
    } catch (error) {
        theoryId = 0;
        console.log('Error', error);
    }
    if (Number.isNaN(theoryId))
        theoryId = 0;

    const [theory, setTheory] = useState<TheoryModel | null>(null);
    const [theoryCatId, setTheoryCatId] = useState<number>(0);
    const [theoryCats, setTheoryCats] = useState<TheoryCatModel[]>([]);
    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [errorTitle, setErrorTitle] = useState<string>('');
    const [errorContent, setErrorContent] = useState<string>('');
    const [successNoti, setSuccessNoti] = useState("");
    const [errorNoti, setErrorNoti] = useState("");

    useEffect(() => {
        getTheoryById(theoryId)
            .then(
                result => {
                    setTheory(result);
                }
            ).catch(error => {
                console.error('Error fetching user data:', error);
            });
    }, [theoryId]);

    useEffect(() => {
        getAllTheoryCats()
            .then(
                result => {
                    setTheoryCats(result);
                }
            )
    }, [])

    useEffect(() => {
        if (theory !== null) {
            setTitle(theory.title === undefined ? '' : theory.title);
            setContent(theory.content === undefined ? '' : theory.content);
            setTheoryCatId(theory.theoryCatId);
        }
    }, [theory]);

    const handleOnChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value) {
            setTitle(e.target.value);
            setErrorTitle('');
        } else {
            setTitle('');
            setErrorTitle('This field cannot be left blank!');
        }
    }

    const handleOnChangeContent = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (e.target.value) {
            setContent(e.target.value);
            setErrorContent('');
        } else {
            setContent('');
            setErrorContent('This field cannot be left blank');
        }
    }

    const handleTheoryCatId = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setTheoryCatId(parseInt(event.target.value));
    }


    const handleSubmit = async (e: React.FormEvent) => {
        // Clear 
        setErrorTitle('');
        setErrorContent('');

        // Prevent default
        e.preventDefault();

        const token = localStorage.getItem('token');
        if (title && content && token) {
            const decodedToken = jwtDecode(token) as JwtPayload;
            const userId = decodedToken.userId;
            fetch(`${process.env.REACT_APP_SERVER_URL}/api/theory/update`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        theoryDetailId: theoryId,
                        theoryCatId: theoryCatId,
                        title: title,
                        content: content,
                        userId: userId,
                        createdAt: '',
                    })
                }
            ).then((response) => {
                if (response.ok) {
                    setSuccessNoti("Updated successfully!");
                    setTitle('');
                    setContent('');
                } else {
                    setErrorNoti("An error occurred while updating!");
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
                            <div className="card">
                                <div className="card-header font-weight-bold" style={{fontWeight: 'bold'}}>
                                    Update Theory Detail
                                </div>
                                <div className="card-body">
                                    <form onSubmit={handleSubmit}>
                                        <div className="form-group">
                                            <label htmlFor="title">Title
                                                <span className="text-danger">(*) {errorTitle}</span>
                                            </label>
                                            <input className="form-control" type="text" name="name" id="title"
                                                value={title}
                                                onChange={handleOnChangeTitle}
                                            />
                                        </div>

                                        <div className="form-group mt-2">
                                            <label htmlFor="detail">Content
                                                <span className="text-danger">(*) {errorContent}</span>
                                            </label>
                                            <textarea
                                                className="form-control"
                                                value={content}
                                                onChange={handleOnChangeContent}
                                                rows={4}
                                                cols={50}
                                            />
                                        </div>

                                        <div className="form-group mt-2">
                                            <label htmlFor="">Belong to Topic</label>
                                            <select className="form-control" id=""
                                                value={theoryCatId}
                                                onChange={handleTheoryCatId}
                                            >
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
                                                successNoti && <NavLink to='/admin/theory/list' className="btn btn-info btn-sm w-25 col-md-6 mx-4 mt-4">View theory list</NavLink>
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

export default AdminOrStaffRequire(AdminTheoryFormUpdate);