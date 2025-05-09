import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import JwtPayload from "../../models/JwtPayLoad";
import { NavLink } from "react-router-dom";
import ThreadCatModel from "../../models/ThreadCatModel";
import { getThreadCats } from "../../api/ThreadCatAPI";
import getBase64 from "../../utils/base64/Base64";
import UserLoginRequire from "../require/UserLoginRequire";

function ForumFormQuestion() {
    const [threadCats, setThreadCats] = useState<ThreadCatModel[]>([]);

    const [shortQuestion, setShortQuestion] = useState<string>('');
    const [detailQuestion, setDetailQuestion] = useState<string>('');
    const [threadCatId, setThreadCatId] = useState<number>(0);
    // const [img, setImg] = useState<File | null>(null);

    const [errorShortQuestion, setErrorShortQuestion] = useState<string>('');
    const [errorDetailQuestion, setErrorDetailQuestion] = useState<string>('');
    const [errorThreadCatId, setErrorThreadCatId] = useState<string>('');
    const [successNoti, setSuccessNoti] = useState("");
    const [errorNoti, setErrorNoti] = useState("");


    useEffect(() => {
        getThreadCats()
            .then(
                result => {
                    setThreadCats(result);
                }
            )
    }, [])

    const handleOnChangeShortQuestion = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value) {
            setShortQuestion(e.target.value);
            setErrorShortQuestion('');
        } else {
            setShortQuestion('');
            setErrorShortQuestion('This field cannot be left blank!');
        }
    }

    const handleOnChangeDetailQuestion = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (e.target.value) {
            setDetailQuestion(e.target.value);
            setErrorDetailQuestion('');
        } else {
            setDetailQuestion('');
            setErrorDetailQuestion('This field cannot be left blank!');
        }
    }

    const handleThreadCatId = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const threadId = parseInt(event.target.value);
        if (threadId === 0) {
            setThreadCatId(0);
            setErrorThreadCatId('This field cannot be left blank!');
        } else {
            setThreadCatId(threadId);
            setErrorThreadCatId('');
        }
    }

    // const handleImageOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     if (e.target.files) {
    //         const file = e.target.files[0];
    //         setImg(file);
    //     }
    // };

    const handleSubmit = async (e: React.FormEvent) => {
        // Clear 
        setErrorShortQuestion('');
        setErrorDetailQuestion('');
        setErrorThreadCatId('');

        // Prevent default
        e.preventDefault();

        const token = localStorage.getItem('token');
        if (shortQuestion && detailQuestion && threadCatId && token) {
            // const base64Image = img ? await getBase64(img) : null;
            const decodedToken = jwtDecode(token) as JwtPayload;
            const userId = decodedToken.userId;

            fetch(`${process.env.REACT_APP_SERVER_URL}/api/thread/add`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        threadId: 0,
                        threadCatId: threadCatId,
                        userId: userId,
                        shortQuestion: shortQuestion,
                        detailQuestion: detailQuestion,
                        views: 0,
                        votes: 0,
                        replies: 0,
                        status: false,
                        createdAt: '',
                        updatedAt: '',
                    })
                }
            ).then((response) => {
                if (response.ok) {
                    setSuccessNoti("Added successfully!");
                    setShortQuestion('');
                    setDetailQuestion('');
                    setThreadCatId(0);
                    return response.json();
                } else {
                    setErrorNoti("An error occurred while adding!");
                }
                // })
                //     .then((data) => {
                //         fetch(`${process.env.REACT_APP_SERVER_URL}/api/thread/image/add`,
                //             {
                //                 method: 'POST',
                //                 headers: {
                //                     'Content-Type': 'application/json',
                //                     'Authorization': `Bearer ${token}`
                //                 },
                //                 body: JSON.stringify({
                //                     imgId: 0,
                //                     name: img?.name,
                //                     path: base64Image,
                //                     threadId: data,
                //                     createdAt: '',
                //                     updatedAt: '',
                //                 })
                //             }
                //         ).then((response) => {
                //             if (response.ok) {
                //                 setSuccessNoti("Added successfully!");
                //             } else {
                //                 setErrorNoti("An error occurred while adding!");
                //             }
                //         })
                //     })
            })
        }
    }

    return (
        <div className="container text-start my-4 mx-auto px-2">
            <div className="row">
                <NavLink to="/forum" className="mx-2 text-decoration-none text-danger fs-2">
                    <i className="bi bi-arrow-left"></i>
                </NavLink>
            </div>
            <div className="row mx-2">
                <div className="card bg-light">
                    <div className="card-header font-weight-bold" style={{ fontWeight: 'bold' }}>
                        Add Question
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="title">Short Question
                                    <span className="text-danger">(*) {errorShortQuestion}</span>
                                </label>
                                <input className="form-control" type="text" name="name" id="title"
                                    value={shortQuestion}
                                    onChange={handleOnChangeShortQuestion}
                                />
                            </div>

                            <div className="form-group mt-2">
                                <label htmlFor="detail">Detail Question
                                    <span className="text-danger">(*) {errorDetailQuestion}</span>
                                </label>
                                <textarea
                                    className="form-control"
                                    value={detailQuestion}
                                    onChange={handleOnChangeDetailQuestion}
                                    rows={11}
                                    cols={80}
                                />
                            </div>

                            <div className="form-group mt-2">
                                <label htmlFor="">Belong to Category <span className="text-danger">(*) {errorThreadCatId}</span></label>
                                <select className="form-control" id=""
                                    value={threadCatId}
                                    onChange={handleThreadCatId}
                                >
                                    <option value={0}>Choose</option>
                                    {
                                        threadCats.map((threadCat) => (
                                            <option
                                                key={threadCat.threadCatId}
                                                value={threadCat.threadCatId}
                                            >{threadCat.name}</option>
                                        ))
                                    }
                                </select>
                            </div>

                            {/* <div className="d-flex flex-row align-items-center my-4 text-start">
                                            <div className="form-outline flex-fill mb-0">
                                                <label className="form-label" htmlFor="avatar">Image</label>
                                                <input type="file" id="avatar" className="form-control"
                                                    accept='images/*'
                                                    onChange={handleImageOnChange}
                                                />
                                            </div>
                                        </div> */}

                            {successNoti && <div className="text-success text-center mt-2">{successNoti}</div>}
                            {errorNoti && <div className="text-danger">{errorNoti}</div>}

                            <div>
                                <button type="submit" className="btn btn-primary btn-sm w-100 col-md-6 mt-4">Add New</button>
                                {
                                    successNoti && <NavLink to='/forum' className="btn btn-success btn-sm w-100 col-md-6 mt-4">View forum</NavLink>
                                }
                            </div>

                        </form>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default UserLoginRequire(ForumFormQuestion);