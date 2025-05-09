import { useEffect, useState } from "react";
import SideBar from "../../sidebar/SideBar";
import { jwtDecode } from "jwt-decode";
import JwtPayload from "../../../models/JwtPayLoad";
import { NavLink, useParams } from "react-router-dom";
import TheoryKeywordModel from "../../../models/TheoryKeywordModel";
import { getTheories } from "../../../api/TheoryAPI";
import { getTheoryKeywordById } from "../../../api/TheoryKeywordAPI";
import TheoryModel from "../../../models/TheoryModel";
import AdminOrStaffRequire from "../../require/AdminOrStaffRequire";

function AdminTheoryKeywordFormUpdate() {
    const { theoryKeywordIdParam } = useParams();

    let keywordId = 0;
    try {
        keywordId = parseInt(theoryKeywordIdParam + '');
    } catch (error) {
        keywordId = 0;
        console.log('Error', error);
    }
    if (Number.isNaN(keywordId))
        keywordId = 0;


    const [theoryKeyword, setTheoryKeyword] = useState<TheoryKeywordModel | null>(null);
    const [theories, setTheories] = useState<TheoryModel[]>([]);
    const [theoryId, setTheoryId] = useState<number>(0);
    const [keyword, setKeyword] = useState<string>('');
    const [errorKeyword, setErrorKeyword] = useState<string>('');
    const [successNoti, setSuccessNoti] = useState("");
    const [errorNoti, setErrorNoti] = useState("");

    useEffect(() => {
        getTheoryKeywordById(keywordId)
            .then(
                result => {
                    setTheoryKeyword(result);
                }
            ).catch(error => {
                console.error('Error fetching user data:', error);
            });
    }, [keywordId]);

    useEffect(() => {
        getTheories()
            .then(
                result => {
                    setTheories(result);
                }
            )
    }, [])


    useEffect(() => {
        if (theoryKeyword !== null) {
            setKeyword(theoryKeyword.keyword === undefined ? '' : theoryKeyword.keyword);
            setTheoryId(theoryKeyword.keywordId);
        }
    }, [theoryKeyword]);

    const handleOnChangeKeyword = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value) {
            setKeyword(e.target.value);
            setErrorKeyword('');
        } else {
            setKeyword('');
            setErrorKeyword('This field cannot be left blank!');
        }
    }


    const handleTheoryId = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setTheoryId(parseInt(event.target.value));
    }

    const handleSubmit = async (e: React.FormEvent) => {
        // Clear 
        setErrorKeyword('');
        // Prevent default
        e.preventDefault();

        const token = localStorage.getItem('token');
        if (keyword && token) {
            const decodedToken = jwtDecode(token) as JwtPayload;
            const userId = decodedToken.userId;

            fetch(`${process.env.REACT_APP_SERVER_URL}/api/theory/keyword/update`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        keywordId: keywordId,
                        theoryDetailId: theoryId,
                        keyword: keyword,
                        userId: userId,
                    })
                }
            ).then((response) => {
                if (response.ok) {
                    setSuccessNoti("Updated successfully!");
                    setKeyword('');
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
                        <div id="keyword" className="container-fluid">
                            <div className="card">
                                <div className="card-header font-weight-bold" style={{fontWeight: 'bold'}}>
                                    Update Theory Keyword
                                </div>
                                <div className="card-body">
                                    <form onSubmit={handleSubmit}>
                                        <div className="form-group">
                                            <label htmlFor="name">Name
                                                <span className="text-danger">(*) {errorKeyword}</span>
                                            </label>
                                            <input className="form-control" type="text" name="name" id="name"
                                                value={keyword}
                                                onChange={handleOnChangeKeyword}
                                            />
                                        </div>

                                        <div className="form-group mt-2">
                                            <label htmlFor="">Belong to Topic</label>
                                            <select className="form-control" id=""
                                                value={theoryId}
                                                onChange={handleTheoryId}
                                            >
                                                <option value={0}>Chọn</option>
                                                {
                                                    theories.map((theory) => (
                                                        <option
                                                            key={theory.theoryDetailId}
                                                            value={theory.theoryDetailId}
                                                        >{theory.title}</option>
                                                    ))
                                                }
                                            </select>
                                        </div>


                                        <div>
                                            {
                                                successNoti && <NavLink to='/admin/theory/keyword/list' className="btn btn-info btn-sm w-25 col-md-6 mx-4 mt-4">View theory keyword list</NavLink>
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

export default AdminOrStaffRequire(AdminTheoryKeywordFormUpdate);