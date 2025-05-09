import { useEffect, useState } from "react";
import SideBar from "../../sidebar/SideBar";
import { useNavigate } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import TheoryExampleModel from "../../../models/TheoryExampleModel";
import { deleteTheoryExample, getListTheoryExample } from "../../../api/TheoryExampleAPI";
import TheoryExampleRowAdmin from "./AdminTheoryExampleRow";
import { Pagination } from "../../../utils/pagination/Pagination";
import AdminOrStaffRequire from "../../require/AdminOrStaffRequire";

function AdminTheoryExampleList() {
    const [theoryExamples, setTheoryExamples] = useState<TheoryExampleModel[] | null>([]);
    const [loadingData, setLoadingData] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [currPage, setCurrPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [notification, setNotification] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        getListTheoryExample(currPage - 1)
            .then(
                res => {
                    setTheoryExamples(res.result);
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


    const handleOnDelete = async (id: number) => {
        const deleleted = deleteTheoryExample(id);
        if (await deleleted === true) {
            setNotification('Deleted successfully');
            setShowModal(true);
            if (theoryExamples) {
                const newTheoryExamples = theoryExamples.filter(theoryExamples => theoryExamples.exampleId !== id);
                setTheoryExamples(newTheoryExamples);
            } else {
                setError("There are no records");
            }
        }
    }

    const handleOnUpdate = (id: number) => {
        navigate(`/admin/theory/example/edit/${id}`)
    }

    const handleClose = () => {
        setShowModal(false);
    }

    if (loadingData) {
        return (
            <div id="layoutSidenav" className="container-fluid mt-4" style={{ minHeight: '700px', textAlign: 'center' }}>
                <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
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
                                    <h5 className="m-0 ">Show Theory Example List</h5>
                                </div>
                                <div className="card-body">
                                    <table className="table table-striped table-checkall">
                                        <thead>
                                            <tr>
                                                <th scope="col">ID</th>
                                                <th scope="col">Name</th>
                                                <th scope="col">Answer</th>
                                                <th scope="col">Created At</th>
                                                        <th scope="col">Updated At</th>
                                                <th scope="col">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                theoryExamples?.map((theoryExample) => (
                                                    <TheoryExampleRowAdmin key={theoryExample.exampleId} theoryExample={theoryExample} onDelete={handleOnDelete} onUpdate={handleOnUpdate} />
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
                                <Modal.Title>Thông báo</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div>
                                    <p className="text-center fs-2 font-weight-bold"> <i className="bi bi-check-circle text-success mx-2"></i> {notification}</p>
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose}>
                                    Đóng
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </section>
                </div>
            </div>
        </div>
    )
}

export default AdminOrStaffRequire(AdminTheoryExampleList);