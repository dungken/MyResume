import { NavLink } from "react-router-dom";
import { useState } from "react";

function ResetPassForm() {
    const [email, setEmail] = useState('');
    const [errorEmail, setErrorEmail] = useState('');
    const [notification, setNotification] = useState("");

    //////////////======CHECK EMAIL ========///////////////////
    const checkExistedEmail = async (email: string) => {
        // Endpoint
        const url = `${process.env.REACT_APP_SERVER_URL}/user/search/existsByEmail?email=${email}`;
        // Call API
        try {
            const response = await fetch(url);
            const data = await response.text();
            if (data !== 'true') {
                setErrorEmail('Địa chỉ email không tồn tại!');
                return false;
            }
        } catch (error) {
            console.error("Lỗi khi kiểm tra email: " + error);
            return false;
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        // Clear any previous error messages
        setErrorEmail('');

        // Tránh click liên tục
        e.preventDefault();

        // Kiểm tra các điều kiện và gán kết quả vào biến
        const isEmailValid = !await checkExistedEmail(email);

        // Kiểm tra tất cả các điều kiện
        if (isEmailValid) {
            try {
                const url = `${process.env.REACT_APP_SERVER_URL}/api/account/reset-password`;

                const response = await fetch(url, {
                    method: 'PUT',
                    headers: {
                        'Content-type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: email
                    })
                }
                );

                if (response.ok) {
                    setNotification("Vui lòng kiểm tra email để lấy lại mật khẩu!");
                } else {
                    console.log(response.json());
                    setNotification("Đã xảy ra lỗi trong quá trình lấy lại mật khẩu.")
                }
            } catch (error) {
                setNotification("Đã xảy ra lỗi trong quá trình lấy lại mật khẩu.")
            }
        }

    }

    const handleEmailOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        setErrorEmail('');
        return checkExistedEmail(e.target.value);
    }


    return (
        <div id="layoutAuthentication" className='m-4' style={{ minHeight: '800px' }}>
            <div id="layoutAuthentication_content">
                <main>
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-lg-5">
                                <div className="card shadow-lg border-0 rounded-lg mt-5">
                                    <div className="card-header"><h3 className="text-center font-weight-light my-4">Password Recovery</h3>
                                    </div>
                                    <div className="card-body">

                                        <div className="small mb-3 text-muted">Enter your email address and we will send you a link to reset your password.</div>

                                        <form className="mx-1 mx-md-4" onSubmit={handleSubmit}>

                                            {/* Email */}
                                            <div className="d-flex flex-row align-items-center mb-4  text-start">
                                                <i className="fa-solid fa-envelope fa-lg me-3 fa-fw"></i>
                                                <div className="form-outline flex-fill mb-0">
                                                    <label className="form-label" htmlFor="email">Email <span className="text-danger">(*)</span>
                                                        <span style={{ color: "red", marginLeft: '10px' }}>{errorEmail}</span>
                                                    </label>
                                                    <input type="email" id="email"
                                                        value={email}
                                                        onChange={handleEmailOnChange}
                                                        className="form-control" />
                                                </div>
                                            </div>

                                            <div className="d-flex align-items-center justify-content-between mt-4 mb-0">
                                                <NavLink className="small" to="/login">Return to login</NavLink>
                                                <button type="submit" className="btn btn-primary" >Reset Password</button>
                                            </div>
                                            <div style={{ color: "green" }}>{notification}</div>
                                        </form>
                                    </div>
                                    <div className="card-footer text-center py-3">
                                        <div className="small"><NavLink to="/register">Need an account? Sign up!</NavLink></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

        </div>
    )
}

export default ResetPassForm;