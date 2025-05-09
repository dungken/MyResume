import { useEffect, useState } from "react";
import SideBar from "../../sidebar/SideBar";
import { NavLink } from "react-router-dom";
import TheoryModel from "../../../models/TheoryModel";
import { jwtDecode } from "jwt-decode";
import JwtPayload from "../../../models/JwtPayLoad";
import { getAllTheories } from "../../../api/TheoryAPI";
import AdminOrStaffRequire from "../../require/AdminOrStaffRequire";

function AdminTheoryKeywordForm() {
    const [theories, setTheories] = useState<TheoryModel[]>([]);
    const [keyword, setKeyword] = useState<string>('');
    const [theoryId, setTheoryId] = useState<number>(1);

    const [errorKeyword, setErrorKeyword] = useState<string>('');
    const [successNoti, setSuccessNoti] = useState("");
    const [errorNoti, setErrorNoti] = useState("");

    useEffect(() => {
        getAllTheories()
            .then(
                result => {
                    setTheories(result);
                }
            )
    }, [])

    const handleOnChangeKeyword = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

    const handleSubmit = (e: React.FormEvent) => {
        // Clear 
        setErrorKeyword('');
        e.preventDefault();

        const token = localStorage.getItem('token');
        if (keyword && theoryId && token) {
            const decodedToken = jwtDecode(token) as JwtPayload;
            const userId = decodedToken.userId;
            fetch(`${process.env.REACT_APP_SERVER_URL}/api/theory/keyword/add`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        keywordId: 0,
                        theoryDetailId: theoryId,
                        userId: userId,
                        keyword: keyword
                    })
                }
            ).then((response) => {
                if (response.ok) {
                    setSuccessNoti("Added successfully!");
                    setKeyword('');
                    // setTheoryId(1);
                } else {
                    setErrorNoti("An error occurred while adding!");
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
                            <div className="row">
                                <div className="col-12">
                                    <div className="card">
                                        <div className="card-header font-weight-bold" style={{fontWeight: 'bold'}}>
                                            Add Theory Keyword
                                        </div>
                                        <div className="card-body">
                                            <form onSubmit={handleSubmit}>
                                                <div className="form-group mt-2">
                                                    <label htmlFor="name">Keyword
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
                                                        successNoti && <NavLink to='/admin/theory/keyword/list' className="btn btn-info btn-sm w-25 col-md-6 mx-4 mt-4">View Theory Keyword</NavLink>
                                                    }
                                                    <button type="submit" className="btn btn-primary btn-sm w-25 col-md-6 mt-4">Add New</button>
                                                </div>
                                                {successNoti && <div className="text-success">{successNoti}</div>}
                                                {errorNoti && <div className="text-danger">{errorNoti}</div>}
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}

export default AdminOrStaffRequire(AdminTheoryKeywordForm);