import { useEffect, useState, ChangeEvent } from "react";
import SideBar from "../sidebar/SideBar";
import { deleteUser, findUser, getUsers } from "../../api/UserAPI";
import UserRow from "./UserRow";
import UserModel from "../../models/UserModel";
import { Pagination } from "../../utils/pagination/Pagination";
import { Button, Modal } from "react-bootstrap";
import { jwtDecode } from "jwt-decode";
import JwtPayload from "../../models/JwtPayLoad";
import { useNavigate } from "react-router-dom";
import RequireAdmin from "../require/AdminRequire";
import AdminOrStaffRequire from "../require/AdminOrStaffRequire";


const UserList: React.FC<{}> = () => {
    const [userIdLogin, setUserIdLogin] = useState(0);
    const [userIdDelete, setUserIdDelete] = useState(0);
    const [listUser, setListUser] = useState<UserModel[] | null>(null);
    const [loadingData, setLoadingData] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [currPage, setCurrPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [keyword, setKeyword] = useState('');
    const [temKeyword, setTemKeyword] = useState('');

    const [showModal, setShowModal] = useState(false);
    const [notification, setNotification] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        if (keyword === '') {
            getUsers(currPage - 1)
                .then(
                    res => {
                        setListUser(res.result);
                        setTotalPages(res.totalPages);
                        setLoadingData(false);
                    }
                )
                .catch((error) => {
                    setLoadingData(true);
                    setError(error.message);
                })
        } else {
            findUser(keyword)
                .then(
                    res => {
                        setListUser(res.result);
                        setTotalPages(res.totalPages);
                        setLoadingData(false);
                    }
                )
                .catch((error) => {
                    setLoadingData(true);
                    setError(error.message);
                })
        }

        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token) as JwtPayload;
            const userId = decodedToken.userId;
            setUserIdLogin(userId);
        }

    }, [currPage, keyword])

    const paginate = (currPage: number) => {
        setCurrPage(currPage);
    }

    const onSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setTemKeyword(e.target.value);
    }

    const handleSearch = () => {
        setKeyword(temKeyword);
    }

    const handleOnDelete = async (id: number) => {
        setUserIdDelete(id);
        if (userIdLogin === id) {
            setNotification('You cannot delete the currently logged in user!');
            setShowModal(true);
            return;
        }
        const deleleted = deleteUser(id);
        if (await deleleted === true) {
            setNotification('Deleted successfully');
            setShowModal(true);
            if (listUser) {
                const updatedUser = listUser.filter(user => user.userId !== id);
                setListUser(updatedUser);
            } else {
                setError("There are no records");
            }
        }
    }

    const handleOnUpdate = (id: number) => {
        navigate(`/admin/user/edit/${id}`)
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
                                <div className="card-header font-weight-bold d-flex justify-content-between align-items-center" >
                                    <h5 className="m-0 " style={{ fontWeight: 'bold' }}>List User</h5>
                                    <div className="form-search form-inline">
                                        {/* <form action="#">
                                            <input type="" className="form-control form-search" placeholder="Tìm kiếm"
                                                onChange={onSearchInputChange}
                                                value={temKeyword}
                                            />
                                            <button className="btn btn-outline-success" type="button" onClick={handleSearch}>
                                                Search
                                            </button>
                                        </form> */}
                                    </div>
                                </div>
                                <div className="card-body">
                                    {/* <div className="analytic">
                                        <a href="" className="text-primary">Trạng thái 1<span className="text-muted">(10)</span></a>
                                        <a href="" className="text-primary">Trạng thái 2<span className="text-muted">(5)</span></a>
                                        <a href="" className="text-primary">Trạng thái 3<span className="text-muted">(20)</span></a>
                                    </div>
                                    <div className="form-action form-inline py-3 row">
                                        <div className="col-md-2">
                                            <select className="form-control mr-1" id="">
                                                <option>Action</option>
                                                <option>Delete</option>
                                                <option>Order By Name</option>
                                            </select>
                                        </div>
                                    </div> */}
                                    <table className="table table-striped table-checkall">
                                        <thead>
                                            <tr>
                                                <th scope="col">ID</th>
                                                <th scope="col">Avatar</th>
                                                <th scope="col">Username</th>
                                                <th scope="col">Email</th>
                                                <th scope="col">First name</th>
                                                <th scope="col">Last name</th>
                                                <th scope="col">Active</th>
                                                <th scope="col">Created At</th>
                                                <th scope="col">Updated At</th>
                                                <th scope="col">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                listUser?.map((user) => (
                                                    <UserRow key={user.userId} user={user} onDelete={handleOnDelete} onUpdate={handleOnUpdate} />
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
                                    <p className="text-center fs-2 font-weight-bold"> <i className={`bi bi-check-circle text-${userIdDelete === userIdLogin ? 'danger' : 'success'} mx-2`}></i> {notification}</p>
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

export default AdminOrStaffRequire(UserList);