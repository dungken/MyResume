import { useEffect, useState } from "react";
import SideBar from "../../sidebar/SideBar";
import { jwtDecode } from "jwt-decode";
import JwtPayload from "../../../models/JwtPayLoad";
import { NavLink, useParams } from "react-router-dom";
import { getThreadCatById, getThreadCatByThreadId, getThreadCats } from "../../../api/ThreadCatAPI";
import ThreadCatModel from "../../../models/ThreadCatModel";
import ThreadModel from "../../../models/ThreadModel";
import { getThreadById } from "../../../api/ThreadAPI";
import AdminOrStaffRequire from "../../require/AdminOrStaffRequire";

function AdminThreadFormUpdate() {
    const { threadIdParam } = useParams();

    let threadId = 0;
    try {
        threadId = parseInt(threadIdParam + '');
    } catch (error) {
        threadId = 0;
        console.log('Error', error);
    }
    if (Number.isNaN(threadId))
        threadId = 0;

    const [thread, setThread] = useState<ThreadModel | null>(null);
    const [threadCats, setThreadCats] = useState<ThreadCatModel[] | null>(null);
    const [threadCatId, setThreadCatId] = useState<number>(0);
    const [threadCat, setThreadCat] = useState<ThreadCatModel | null>(null);
    const [shortQuestion, setShortQuestion] = useState<string>('');
    const [detailQuestion, setDetailQuestion] = useState<string>('');
    const [status, setStatus] = useState<boolean>(false);

    const [errorThreadCat, setErrorThreadCat] = useState<string>('');
    const [errorShortQuestion, setErrorShortQuestion] = useState<string>('');
    const [errorDetailQuestion, setErrorDetailQuestion] = useState<string>('');
    const [successNoti, setSuccessNoti] = useState("");
    const [errorNoti, setErrorNoti] = useState("");

    useEffect(() => {
        getThreadCats()
            .then((result) => {
                if (result) {
                    setThreadCats(result);
                }
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
    }, []);

    useEffect(() => {
        getThreadById(threadId)
            .then((result) => {
                if (result) {
                    setThread(result);
                }
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
    }, [threadId]);

    useEffect(() => {
        getThreadCatByThreadId(threadId)
            .then((result) => {
                if (result) {
                    setThreadCat(result);
                }
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
    }, [threadId]);

    useEffect(() => {
        if (thread !== null && threadCat !== null) {
            setShortQuestion(thread.shortQuestion === undefined ? '' : thread.shortQuestion);
            setDetailQuestion(thread.detailQuestion === undefined ? '' : thread.detailQuestion);
            setStatus(thread.status);
            setThreadCatId(threadCat?.threadCatId);
        }
    }, [thread]);


    const handleOnChangeShortQuestion = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value) {
            setShortQuestion(e.target.value);
            setErrorShortQuestion('');
        } else {
            setShortQuestion('');
            setErrorShortQuestion('This field cannot be left blank');
        }
    }

    const handleOnChangeDetailQuestion = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (e.target.value) {
            setDetailQuestion(e.target.value);
            setErrorDetailQuestion('');
        } else {
            setDetailQuestion('');
            setErrorDetailQuestion('This field cannot be left blank');
        }
    }

    const handleOnChangeStatus = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setStatus(parseInt(event.target.value) ? true : false);
    }

    const handleOnChangeThreadCat = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const threadCatId = parseInt(event.target.value);
        if(threadCatId === 0) {
            setErrorThreadCat("This field cannot be left blank");
        } else {
            setThreadCatId(threadCatId);
        }
    }
    
    const handleSubmit = async (e: React.FormEvent) => {
        setErrorShortQuestion('');
        setErrorDetailQuestion('');

        e.preventDefault();

        const token = localStorage.getItem('token');
        if (shortQuestion && detailQuestion && threadCatId != 0 && token) {
            const decodedToken = jwtDecode(token) as JwtPayload;
            const userId = decodedToken.userId;

            fetch(`${process.env.REACT_APP_SERVER_URL}/api/thread/update`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        threadId: threadId,
                        threadCatId: threadCatId,
                        userId: userId,
                        shortQuestion: shortQuestion,
                        detailQuestion: detailQuestion,
                        views: thread?.views,
                        replies: thread?.replies,
                        votes: thread?.votes,
                        status: status,
                        createdAt: '',
                        updatedAt: ''
                    })
                }
            ).then((response) => {
                if (response.ok) {
                    setSuccessNoti("Updated successfully!");
                    setShortQuestion('');
                    setDetailQuestion('');
                } else {
                    setErrorNoti("Error while updated!");
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
                                    Edit Thread
                                </div>
                                <div className="card-body">
                                    <form onSubmit={handleSubmit}>
                                        <div className="form-group mt-3">
                                            <label htmlFor="name">Short Question
                                                <span className="text-danger">(*) {errorShortQuestion}</span>
                                            </label>
                                            <input className="form-control" type="text" name="name" id="name"
                                                value={shortQuestion}
                                                onChange={handleOnChangeShortQuestion}
                                            />
                                        </div>

                                        <div className="form-group mt-3">
                                            <label htmlFor="detail">Detail Question
                                                <span className="text-danger">(*) {errorDetailQuestion}</span>
                                            </label>
                                            <textarea
                                                className="form-control"
                                                value={detailQuestion}
                                                onChange={handleOnChangeDetailQuestion}
                                                rows={4}
                                                cols={60}
                                            />
                                        </div>

                                        <div className="form-group mt-3">
                                            <label htmlFor="detail">Status
                                                <span className="text-danger">(*)</span>
                                            </label>
                                            <select className="form-control" id=""
                                                value={status ? 1 : 0}
                                                onChange={handleOnChangeStatus}
                                            >
                                                <option value={1}>Approved</option>
                                                <option value={0}>Not Approved</option>
                                            </select>
                                        </div>

                                        <div className="form-group mt-3">
                                            <label htmlFor="detail">Belong to Thread Category
                                                <span className="text-danger">(*) {errorThreadCat}</span>
                                            </label>
                                            <select className="form-control" id=""
                                                value={threadCatId}
                                                onChange={handleOnChangeThreadCat}
                                            >
                                                <option value={0}>Choice</option>
                                                {
                                                    threadCats?.map((cat) => (
                                                        <option
                                                            key={cat.threadCatId}
                                                            value={cat.threadCatId}
                                                            selected={threadCatId === cat.threadCatId}
                                                        >{cat.name}
                                                        </option>
                                                    ))
                                                }
                                            </select>
                                        </div>

                                        <div>
                                            {
                                                successNoti && <NavLink to='/admin/thread/list' className="btn btn-info btn-sm w-25 col-md-6 mx-4 mt-4">View list thread category </NavLink>
                                            }
                                            <button type="submit" className="btn btn-primary btn-sm w-25 col-md-6 mt-4">Save</button>
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

export default AdminOrStaffRequire(AdminThreadFormUpdate);
