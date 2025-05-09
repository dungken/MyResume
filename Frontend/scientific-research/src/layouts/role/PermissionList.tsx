import { useEffect, useState } from "react";
import PermissionModel from "../../models/PermissionModel";
import { Pagination } from "../../utils/pagination/Pagination";
import { deletePermission, getPermissions } from "../../api/PermissionAPI";
import SideBar from "../sidebar/SideBar";
import { useNavigate } from "react-router-dom";
import PermissionRow from "./PermissionRow";
import { Button, Modal } from "react-bootstrap";
import RequireAdmin from "../require/AdminRequire";
import AdminRequire from "../require/AdminRequire";


const PermissionList: React.FC<{}> = () => {
    const [permissions, setPermissions] = useState<PermissionModel[] | null>([]);
    const [loadingData, setLoadingData] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [currPage, setCurrPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [notification, setNotification] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        getPermissions(currPage - 1)
            .then(
                res => {
                    setPermissions(res.result);
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
        const deleleted = deletePermission(id);
        if (await deleleted === true) {
            setNotification('Deleted successfully');
            setShowModal(true);
            if (permissions) {
                const newPermissions = permissions.filter(permission => permission.permissionId !== id);
                setPermissions(newPermissions);
            } else {
                setError("There are no records");
            }
        }
    }

    const handleOnUpdate = (id: number) => {
        navigate(`/admin/role/permission/edit/${id}`)
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
                    <main className="mt-4">
                        <div className="card">
                            <div className="card-header font-weight-bold" style={{fontWeight: 'bold'}}>
                                List of permissions
                            </div>
                            <div className="card-body">
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th scope="col">ID</th>
                                            <th scope="col">Permission Name</th>
                                            <th scope="col">Slug</th>
                                            <th scope="col">Description</th>
                                            <th scope="col">Created at</th>
                                            <th scope="col">Updated at</th>
                                            <th scope="col">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            permissions?.map((permission) => (
                                                <PermissionRow key={permission.permissionId} permission={permission} onDelete={handleOnDelete} onUpdate={handleOnUpdate} />
                                            ))
                                        }

                                    </tbody>
                                </table>
                                <nav aria-label="Page navigation example">
                                    <Pagination currentPage={currPage} totalPages={totalPages} paginate={paginate} />
                                </nav>
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

export default AdminRequire(PermissionList);