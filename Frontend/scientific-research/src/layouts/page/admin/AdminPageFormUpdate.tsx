import { useEffect, useState } from "react";
import SideBar from "../../sidebar/SideBar";
import { jwtDecode } from "jwt-decode";
import JwtPayload from "../../../models/JwtPayLoad";
import { NavLink, useParams } from "react-router-dom";
import PageModel from "../../../models/PageModel";
import { getPageById } from "../../../api/PageAPI";

function AdminPageFormUpdate() {
    const { pageIdParam } = useParams();

    let pageId = 0;
    try {
        pageId = parseInt(pageIdParam + '');
    } catch (error) {
        pageId = 0;
        console.log('Error', error);
    }
    if (Number.isNaN(pageId))
        pageId = 0;

    const [page, setPage] = useState<PageModel | null>(null);
    const [pageName, setPageName] = useState<string>('');
    const [shortDesc, setShortDesc] = useState<string>('');
    const [detail, setDetail] = useState<string>('');

    const [errorPageName, setErrorPageName] = useState<string>('');
    const [errorShortDesc, setErrorShortDesc] = useState<string>('');
    const [errorDetail, setErrorDetail] = useState<string>('');
    const [successNoti, setSuccessNoti] = useState("");
    const [errorNoti, setErrorNoti] = useState("");

    useEffect(() => {
        getPageById(pageId)
            .then(
                result => {
                    setPage(result);
                }
            ).catch(error => {
                console.error('Error fetching user data:', error);
            });
    }, [pageId]);

    useEffect(() => {
        if (page !== null) {
            setPageName(page.pageName === undefined ? '' : page.pageName);
            setShortDesc(page.shortDesc === undefined ? '' : page.shortDesc);
            setDetail(page.detail === undefined ? '' : page.detail);
        }
    }, [page]);

    const handleOnChangePageName = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value) {
            setPageName(e.target.value);
            setErrorPageName('');
        } else {
            setPageName('');
            setErrorPageName('This field cannot be left blank');
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


    const handleOnChangeDetail = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (e.target.value) {
            setDetail(e.target.value);
            setErrorDetail('');
        } else {
            setDetail('');
            setErrorDetail('This field cannot be left blank');
        }
    }


    const handleSubmit = async (e: React.FormEvent) => {
        setErrorPageName('');
        setErrorShortDesc('');
        setErrorDetail('');

        e.preventDefault();

        const token = localStorage.getItem('token');
        if (pageName && shortDesc && detail && token) {
            const decodedToken = jwtDecode(token) as JwtPayload;
            const userId = decodedToken.userId;

            fetch(`${process.env.REACT_APP_SERVER_URL}/api/page/update`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        pageId: pageId,
                        pageName: pageName,
                        shortDesc: shortDesc,
                        detail: detail,
                        userId: userId,
                        createdAt: '',
                    })
                }
            ).then((response) => {
                if (response.ok) {
                    setSuccessNoti("Updated successfully!");
                    setPageName('');
                    setShortDesc('');
                    setDetail('');
                } else {
                    setErrorNoti("An error occurred while updating!");
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
                                <div className="card-header font-weight-bold">
                                    Update Page
                                </div>
                                <div className="card-body">
                                    <form onSubmit={handleSubmit}>

                                        <div className="form-group mt-3">
                                            <label htmlFor="name">Name
                                                <span className="text-danger">(*) {errorPageName}</span>
                                            </label>
                                            <input className="form-control" type="text" name="name" id="name"
                                                value={pageName}
                                                onChange={handleOnChangePageName}
                                            />
                                        </div>

                                        <div className="form-group mt-3">
                                            <label htmlFor="shortDesc">Short Description
                                                <span className="text-danger">(*) {errorShortDesc}</span>
                                            </label>
                                            <input className="form-control" type="text" name="name" id="shortDesc"
                                                value={shortDesc}
                                                onChange={handleOnChangeShortDesc}
                                            />
                                        </div>

                                        <div className="form-group mt-2">
                                            <label htmlFor="detail">Detail
                                                <span className="text-danger">(*) {errorDetail}</span>
                                            </label>
                                            <textarea
                                                className="form-control"
                                                value={detail}
                                                onChange={handleOnChangeDetail}
                                                rows={4}
                                                cols={50}
                                            />
                                        </div>
                                        <div>
                                            {
                                                successNoti && <NavLink to='/admin/page/list' className="btn btn-info btn-sm w-25 col-md-6 mx-4 mt-4">View list page </NavLink>
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

export default AdminPageFormUpdate;
