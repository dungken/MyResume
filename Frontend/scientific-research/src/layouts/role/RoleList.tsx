import { useNavigate } from "react-router-dom";
import RoleModel from "../../models/RoleModel";
import SideBar from "../sidebar/SideBar";
import { useState, useEffect } from 'react';
import RoleItem from "./RoleItem";
import { Button, Modal } from "react-bootstrap";
import { deleteRole, getRoles } from "../../api/RoleAPI";
import { Pagination } from "../../utils/pagination/Pagination";
import RequireAdmin from "../require/AdminRequire";
import AdminRequire from "../require/AdminRequire";


function RoleList() {
    const [roles, setRoles] = useState<RoleModel[] | null>([]);
    const [loadingData, setLoadingData] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [currPage, setCurrPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [notification, setNotification] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        getRoles(currPage - 1)
            .then(
                res => {
                    setRoles(res.result);
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
        const deleleted = deleteRole(id);
        if (await deleleted === true) {
            setNotification('Deleted successfully');
            setShowModal(true);
            if (roles) {
                const newRoles = roles.filter(role => role.roleId !== id);
                setRoles(newRoles);
            } else {
                setError("There are no records");
            }
        }
    }

    const handleOnUpdate = (id: number) => {
        navigate(`/admin/role/edit/${id}`)
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
                        <div id="content" className="container-fluid text-start">
                            <div className="card">
                                <div className="card-header font-weight-bold d-flex justify-content-between align-items-center p-4">
                                    <h5 className="m-0 " style={{fontWeight: 'bold'}}>List of roles</h5>
                                    <div className="form-search form-inline">
                                        <form action="#">
                                            <input type="" className="form-control form-search" placeholder="Tìm kiếm" />
                                        </form>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <table className="table table-striped table-checkall">
                                        <thead>
                                            <tr>
                                                <th scope="col">#</th>
                                                <th scope="col">Role Name</th>
                                                <th scope="col">Desc</th>
                                                <th scope="col">Created At</th>
                                                <th scope="col">Updated At</th>
                                                <th scope="col">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>

                                            {
                                                roles?.map((role) => (
                                                    <RoleItem key={role.roleId} role={role} onDelete={handleOnDelete} onUpdate={handleOnUpdate} />
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

export default AdminRequire(RoleList);