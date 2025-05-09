import { useEffect, useState } from "react";
import SideBar from "../../sidebar/SideBar";
import { jwtDecode } from "jwt-decode";
import JwtPayload from "../../../models/JwtPayLoad";
import { NavLink, useParams } from "react-router-dom";
import ThreadCommentModel from "../../../models/ThreadCommentModel";
import { getThreadCommentById } from "../../../api/ThreadCommentAPI";
import ThreadModel from "../../../models/ThreadModel";
import { getThreadByThreadCommentId } from "../../../api/ThreadAPI";
import AdminOrStaffRequire from "../../require/AdminOrStaffRequire";

function AdminThreadCommentFormUpdate() {
    const { commentIdParam } = useParams();

    let commentId = 0;
    try {
        commentId = parseInt(commentIdParam + '');
    } catch (error) {
        commentId = 0;
        console.log('Error', error);
    }
    if (Number.isNaN(commentId))
        commentId = 0;

    const [threadComment, setThreadComment] = useState<ThreadCommentModel | null>(null);
    const [thread, setThread] = useState<ThreadModel | null>(null);
    const [status, setStatus] = useState<boolean>(false);

    const [successNoti, setSuccessNoti] = useState("");
    const [errorNoti, setErrorNoti] = useState("");


    useEffect(() => {
        getThreadCommentById(commentId)
            .then((result) => {
                if (result) {
                    setThreadComment(result);
                }
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
    }, [commentId]);

    useEffect(() => {
        getThreadByThreadCommentId(commentId)
            .then((result) => {
                if (result) {
                    setThread(result);
                }
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
    }, [commentId]);

    useEffect(() => {
        if (threadComment !== null) {
            setStatus(threadComment.status);
        }
    }, [threadComment]);

    const handleOnChangeStatus = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setStatus(parseInt(event.target.value) ? true : false);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token) as JwtPayload;
            const userId = decodedToken.userId;

            fetch(`${process.env.REACT_APP_SERVER_URL}/api/thread/comment/update`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        commentId: commentId,
                        commentParentId: threadComment?.commentParentId,
                        userId: userId,
                        threadId: thread?.threadId,
                        level: threadComment?.level,
                        comment: threadComment?.comment,
                        status: status,
                        createdAt: '',
                        updatedAt: '',
                    })
                }
            ).then((response) => {
                if (response.ok) {
                    setSuccessNoti("Updated successfully!");
                } else {
                    setErrorNoti("Error while updated!");
                    console.log({
                        commentId: commentId,
                        commentParentId: threadComment?.commentParentId,
                        userId: userId,
                        threadId: threadComment?.threadId,
                        level: threadComment?.level,
                        comment: threadComment?.comment,
                        status: status,
                        createdAt: '',
                        updatedAt: '',
                    });
                    
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
                                    Edit Thread Comment
                                </div>
                                <div className="card-body">
                                    <form onSubmit={handleSubmit}>

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
                                        <div>
                                            {
                                                successNoti && <NavLink to='/admin/thread/comment/list' className="btn btn-info btn-sm w-25 col-md-6 mx-4 mt-4">View list thread comment</NavLink>
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

export default AdminOrStaffRequire(AdminThreadCommentFormUpdate);
