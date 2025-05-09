import React, { useState, useEffect } from 'react';
import { NavLink, useParams } from "react-router-dom";

function ActiveAccount() {
    const { email } = useParams();
    const { activeCode } = useParams();
    const [active, setActive] = useState(false);
    const [noti, setNoti] = useState('');

    useEffect(() => {
        if (email && activeCode) {
            activeAccount();
        }
    }, [])

    const activeAccount = async () => {
        try {
            const url: string = `${process.env.REACT_APP_SERVER_URL}/api/account/active?email=${email}&activeCode=${activeCode}`;
            const response = await fetch(url, { method: 'GET' })
            if (response.ok) {
                setActive(true);
            } else {
                setNoti(response.text + '');
            }
        } catch (error) {
            console.log("Lỗi khi kích hoạt: ", error);
        }
    }

    return (
        <section className="py-5" style={{ backgroundColor: '#eee', minHeight: '700px' }}>
            <div className="container h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-lg-12 col-xl-11">
                        <div className="card text-black" style={{ borderRadius: '25px' }}>
                            <div className="card-body p-md-5">
                                <div className="row justify-content-center">
                                    <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                                        {active
                                            ? <div>
                                                <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Account activation successful <i className="bi bi-check-circle text-success"></i></p>
                                                <NavLink className="btn btn-success" to="/login">Log in now</NavLink>
                                            </div>
                                            : <div>
                                                <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Account activation error<i className="bi bi-exclamation-circle text-danger"></i></p>
                                                <NavLink className="btn btn-primary" to="/register">Please register again</NavLink>
                                            </div>
                                        }
                                    </div>
                                    <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">
                                        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp"
                                            className="img-fluid" alt="Sample image" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ActiveAccount;