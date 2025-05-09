import { useEffect, useState } from "react";
import SideBar from "../../sidebar/SideBar";
import { NavLink } from "react-router-dom";
import TheoryModel from "../../../models/TheoryModel";
import { jwtDecode } from "jwt-decode";
import JwtPayload from "../../../models/JwtPayLoad";
import { getTheories } from "../../../api/TheoryAPI";
import AdminOrStaffRequire from "../../require/AdminOrStaffRequire";

function AdminTheoryExampleForm() {
    const [theories, setTheories] = useState<TheoryModel[]>([]);
    const [name, setName] = useState<string>('');
    const [answer, setAnswer] = useState<string>('');
    const [theoryId, setTheoryId] = useState<number>(1);

    const [errorName, setErrorName] = useState<string>('');
    const [errorAnswer, setErrorAnswer] = useState<string>('');
    const [successNoti, setSuccessNoti] = useState("");
    const [errorNoti, setErrorNoti] = useState("");

    useEffect(() => {
        getTheories()
            .then(
                result => {
                    setTheories(result);
                }
            )
    }, [])

    const handleOnChangeName = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value) {
            setName(e.target.value);
            setErrorName('');
        } else {
            setName('');
            setErrorName('This field cannot be left blank!');
        }
    }

    const handleOnChangeAnswer = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (e.target.value) {
            setAnswer(e.target.value);
            setErrorAnswer('');
        } else {
            setAnswer('');
            setErrorAnswer('This field cannot be left blank!');
        }
    }

    const handleTheoryId = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setTheoryId(parseInt(event.target.value));
    }

    const handleSubmit = (e: React.FormEvent) => {
        // Clear 
        setErrorName('');
        setErrorAnswer('');

        e.preventDefault();

        const token = localStorage.getItem('token');
        if (name && answer && theoryId && token) {
            const decodedToken = jwtDecode(token) as JwtPayload;
            const userId = decodedToken.userId;
            fetch(`${process.env.REACT_APP_SERVER_URL}/api/theory/example/add`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        exampleId: 0,
                        theoryDetailId: theoryId,
                        userId: userId,
                        name: name,
                        answer: answer
                    })
                }
            ).then((response) => {
                if (response.ok) {
                    setSuccessNoti("Added successfully!");
                    setName('');
                    setAnswer('');
                    setTheoryId(1);
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
                                            Add Theory Example
                                        </div>
                                        <div className="card-body">
                                            <form onSubmit={handleSubmit}>
                                                <div className="form-group mt-2">
                                                    <label htmlFor="name">Question
                                                        <span className="text-danger">(*) {errorName}</span>
                                                    </label>
                                                    <input className="form-control" type="text" name="name" id="name"
                                                        value={name}
                                                        onChange={handleOnChangeName}
                                                    />
                                                </div>

                                                <div className="form-group mt-2">
                                                    <label htmlFor="desc">Answer
                                                        <span className="text-danger">(*) {errorAnswer}</span>
                                                    </label>
                                                    <textarea
                                                        className="form-control"
                                                        value={answer}
                                                        onChange={handleOnChangeAnswer}
                                                        rows={4}
                                                        cols={50}
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
                                                        successNoti && <NavLink to='/admin/theory/example/list' className="btn btn-info btn-sm w-25 col-md-6 mx-4 mt-4">View Theory Example</NavLink>
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

export default AdminOrStaffRequire(AdminTheoryExampleForm);