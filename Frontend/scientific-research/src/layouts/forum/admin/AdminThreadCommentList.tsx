import { useEffect, useState } from "react";
import SideBar from "../../sidebar/SideBar";
import ThreadCommentModel from "../../../models/ThreadCommentModel";
import { useNavigate } from "react-router-dom";
import { Pagination } from "../../../utils/pagination/Pagination";
import { Button, Modal } from "react-bootstrap";
import { deleteThreadComment, getListThreadComment } from "../../../api/ThreadCommentAPI";
import ThreadCommentRowAdmin from "./AdminThreadCommentRow";
import AdminOrStaffRequire from "../../require/AdminOrStaffRequire";

function AdminThreadCommentList() {
    const [threadComments, setThreadComments] = useState<ThreadCommentModel[] | null>([]);
    const [loadingData, setLoadingData] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [currPage, setCurrPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [notification, setNotification] = useState('');
    const navigate = useNavigate();


    useEffect(() => {
        getListThreadComment(currPage - 1)
            .then(
                res => {
                    setThreadComments(res.result);
                    setTotalPages(res.totalPages);
                    setLoadingData(false);
                }
            )
            .catch((error) => {
                setLoadingData(true);
                setError(error.message);
            })
    }, [currPage])

    const paginate = (currPage: number) => {
        setCurrPage(currPage);
    }

    const handleOnUpdate = (id: number) => {
        navigate(`/admin/thread/comment/edit/${id}`)
    }

    const handleOnDelete = async (id: number) => {
        const deleleted = deleteThreadComment(id);
        if (await deleleted === true) {
            setNotification('Deleted successfully');
            setShowModal(true);
            if (threadComments) {
                const newThreadComments = threadComments.filter(threadComments => threadComments.commentId !== id);
                setThreadComments(newThreadComments);
            } else {
                setError("There are no records");
            }
        }
    }


    const handleClose = () => {
        setShowModal(false);
    }


    if (loadingData) {
        return (
            <div id="layoutSidenav" className="container-fluid mt-4" style={{ minHeight: '700px', textAlign: 'center' }}>
                <div className="spinner-border" role="status">
                    <span className="sr-only"></span>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div>{error}</div>
        )
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
                                <div className="card-header font-weight-bold d-flex justify-content-between align-items-center">
                                    <h5 className="m-0 ">Thread Comment List</h5>
                                </div>
                                <div className="card-body">
                                    <table className="table table-striped table-checkall">
                                        <thead>
                                            <tr>
                                                <th scope="col">ID</th>
                                                <th scope="col">Comment</th>
                                                <th scope="col">Status</th>
                                                <th scope="col">Created at</th>
                                                <th scope="col">Updated at</th>
                                                <th scope="col">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                threadComments?.map((threadComment) => (
                                                    <ThreadCommentRowAdmin key={threadComment.commentId} threadComment={threadComment} onUpdate={handleOnUpdate} onDelete={handleOnDelete} />
                                                ))
                                            }

                                        </tbody>
                                    </table>
                                    <nav aria-label="Page navigation example">
                                        <Pagination currentPage={currPage} totalPages={totalPages} paginate={paginate} />
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </main>
                    <section>
                        <Modal show={showModal} onHide={handleClose}>
                            <Modal.Header closeButton>
                                <Modal.Title>Notification</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div>
                                    <p className="text-center fs-2 font-weight-bold"> <i className="bi bi-check-circle text-success mx-2"></i> {notification}</p>
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose}>
                                    Close
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </section>
                </div>
            </div>
        </div>
    )
}

export default AdminOrStaffRequire(AdminThreadCommentList);