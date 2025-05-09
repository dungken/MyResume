import { useEffect, useState } from "react";
import SideBar from "../../sidebar/SideBar";
import { jwtDecode } from "jwt-decode";
import JwtPayload from "../../../models/JwtPayLoad";
import { NavLink, useParams } from "react-router-dom";
import TheoryExampleModel from "../../../models/TheoryExampleModel";
import { getTheories } from "../../../api/TheoryAPI";
import { getTheoryExampleById } from "../../../api/TheoryExampleAPI";
import TheoryModel from "../../../models/TheoryModel";
import AdminOrStaffRequire from "../../require/AdminOrStaffRequire";

function AdminTheoryExampleFormUpdate() {
    const { theoryExampleIdParam } = useParams();

    let exampleId = 0;
    try {
        exampleId = parseInt(theoryExampleIdParam + '');
    } catch (error) {
        exampleId = 0;
        console.log('Error', error);
    }
    if (Number.isNaN(exampleId))
        exampleId = 0;


    const [theoryExample, setTheoryExample] = useState<TheoryExampleModel | null>(null);
    const [theories, setTheories] = useState<TheoryModel[]>([]);
    const [theoryId, setTheoryId] = useState<number>(0);
    const [name, setName] = useState<string>('');
    const [answer, setAnswer] = useState<string>('');
    const [errorName, setErrorName] = useState<string>('');
    const [errorrAnswer, setErrorAnswer] = useState<string>('');
    const [successNoti, setSuccessNoti] = useState("");
    const [errorNoti, setErrorNoti] = useState("");

    useEffect(() => {
        getTheoryExampleById(exampleId)
            .then(
                result => {
                    setTheoryExample(result);
                }
            ).catch(error => {
                console.error('Error fetching user data:', error);
            });
    }, [exampleId]);

    useEffect(() => {
        getTheories()
            .then(
                result => {
                    setTheories(result);
                }
            )
    }, [])


    useEffect(() => {
        if (theoryExample !== null) {
            setName(theoryExample.name === undefined ? '' : theoryExample.name);
            setAnswer(theoryExample.answer === undefined ? '' : theoryExample.answer);
            setTheoryId(theoryExample.exampleId);
        }
    }, [theoryExample]);

    const handleOnChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value) {
            setName(e.target.value);
            setErrorName('');
        } else {
            setName('');
            setErrorName('This field cannot be left blank!');
        }
    }

    const handleOnChangeContent = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (e.target.value) {
            setAnswer(e.target.value);
            setErrorAnswer('');
        } else {
            setAnswer('');
            setErrorAnswer('This field cannot be left blank');
        }
    }

    const handleTheoryId = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setTheoryId(parseInt(event.target.value));
    }

    const handleSubmit = async (e: React.FormEvent) => {
        // Clear 
        setErrorName('');
        setErrorAnswer('');

        e.preventDefault();

        const token = localStorage.getItem('token');
        if (name && answer && token) {
            const decodedToken = jwtDecode(token) as JwtPayload;
            const userId = decodedToken.userId;
            fetch(`${process.env.REACT_APP_SERVER_URL}/api/theory/example/update`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        exampleId: exampleId,
                        theoryDetailId: theoryId,
                        name: name,
                        answer: answer,
                        userId: userId,
                    })
                }
            ).then((response) => {
                if (response.ok) {
                    setSuccessNoti("Updated successfully!");
                    setName('');
                    setAnswer('');
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
                        <div id="answer" className="container-fluid">
                            <div className="card">
                                <div className="card-header font-weight-bold" style={{fontWeight: 'bold'}}>
                                    Update Theory Example
                                </div>
                                <div className="card-body">
                                    <form onSubmit={handleSubmit}>
                                        <div className="form-group">
                                            <label htmlFor="name">Name
                                                <span className="text-danger">(*) {errorName}</span>
                                            </label>
                                            <input className="form-control" type="text" name="name" id="name"
                                                value={name}
                                                onChange={handleOnChangeTitle}
                                            />
                                        </div>

                                        <div className="form-group mt-2">
                                            <label htmlFor="detail">Answer
                                                <span className="text-danger">(*) {errorrAnswer}</span>
                                            </label>
                                            <textarea
                                                className="form-control"
                                                value={answer}
                                                onChange={handleOnChangeContent}
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
                                                successNoti && <NavLink to='/admin/theory/example/list' className="btn btn-info btn-sm w-25 col-md-6 mx-4 mt-4">View theory example list</NavLink>
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

export default AdminOrStaffRequire(AdminTheoryExampleFormUpdate);