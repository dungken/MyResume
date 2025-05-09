import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import JwtPayload from '../../models/JwtPayLoad';

function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Xử lý đăng nhập 
    const handleLogin = () => {
        const loginRequest = {
            username: username,
            password: password
        }

        fetch(`${process.env.REACT_APP_SERVER_URL}/api/account/login`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginRequest)
            }).then(
                (response) => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        setError('System login error!');
                    }
                }
            ).then(
                (data) => {
                    const { jwt } = data;
                    localStorage.setItem('token', jwt);
                    const decodedToken = jwtDecode(jwt) as JwtPayload;

                    // Nếu là admin hoặc staff thì điều hướng đến trang admin
                    if (decodedToken.isAdmin || decodedToken.isStaff) {
                        navigate('/admin');
                        window.location.reload()

                    } else if (decodedToken.isUser) { // Nếu là user thì điều hướng đến trang home
                        navigate('/');
                        window.location.reload()
                    }
                }
            ).catch((error) => {
                console.error('Đăng nhập thất bại: ', error);
                setError('Login failed. Please check your username and password again!')
            }
            );
    }


    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleLogin();
        }
    };

    return (
        <section className='m-4'>
            <div className="container justify-content-center h-custom" style={{ minHeight: '700px', marginTop: '80px' }}>
                <div className="row d-flex align-items-center h-100">
                    <div className="col-md-9 col-lg-6 col-xl-5">
                        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
                            className="img-fluid" alt="Sample image" />
                    </div>
                    <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
                        <div className="d-flex flex-row align-items-center justify-content-center">
                            <button type="button" className="btn btn-primary btn-floating mx-1">
                                <i className="fab fa-facebook-f"></i>
                            </button>
                            <button type="button" className="btn btn-primary btn-floating mx-1">
                                <i className="fab fa-twitter"></i>
                            </button>
                            <button type="button" className="btn btn-primary btn-floating mx-1">
                                <i className="fab fa-linkedin-in"></i>
                            </button>
                        </div>
                        <div className="divider d-flex align-items-center my-4">
                            <p className="text-center fw-bold mx-3 mb-0">Or</p>
                        </div>
                        <form action="">
                            {/* Username */}
                            <div className="form-outline mb-4 text-start">
                                <i className="fas fa-user fa-lg me-3 fa-fw"></i>
                                <label className="form-label" htmlFor="username">Username <span className="text-danger">(*)</span></label>
                                <input type="email" id="username" className="form-control form-control-lg"
                                    placeholder="Enter a valid username"
                                    value={username} onChange={(e) => setUsername(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                />
                            </div>

                            {/* Password */}
                            <div className="form-outline mb-3 text-start">
                                <i className="fa-solid fa-key fa-lg me-3 fa-fw"></i>
                                <label className="form-label" htmlFor="password">Password <span className="text-danger">(*)</span></label>
                                <input type="password" id="password" className="form-control form-control-lg"
                                    placeholder="Enter password" required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                />
                            </div>

                            {/* Remember me */}
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="form-check mb-0">
                                    <input className="form-check-input me-2" type="checkbox" value="" id="form2Example3" />
                                    <label className="form-check-label" htmlFor="form2Example3">
                                        Remember me
                                    </label>
                                </div>
                                <NavLink to="/password-recovery" className="text-body">Forgot password?</NavLink>
                            </div>

                            {/* Báo lỗi */}
                            <div className='mt-2'>
                                {
                                    error && <div className='text-danger'>{error}</div>
                                }
                            </div>

                            <div className="text-center text-lg-start mt-4 pt-2">
                                <button
                                    type="button"
                                    className="btn btn-primary btn-lg w-100"
                                    style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                                    onClick={handleLogin}
                                >Login
                                </button>
                                <p className="small fw-bold mt-2 pt-1 mb-0 text-center">Don't have an account?
                                    <NavLink
                                        to="/register"
                                        className="link-danger p-2">
                                        Register
                                    </NavLink>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default LoginForm;