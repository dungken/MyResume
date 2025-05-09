import { NavLink, useParams } from "react-router-dom";
import { useState } from "react";

function RetypePassForm() {
    const { email } = useParams();
    const [password, setPassword] = useState("");
    const [rePassword, setRePassword] = useState("");

    const [errorPassword, setErrorPassword] = useState("");
    const [errorRePassword, setErrorRePassword] = useState("");
    const [notification, setNotification] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        // Clear any previous error messages
        setErrorPassword('');
        setErrorRePassword('');

        // Tránh click liên tục
        e.preventDefault();

        // Kiểm tra các điều kiện và gán kết quả vào biến
        const isPasswordValid = !checkPassword(password);
        const isRePasswordValid = !checkRePassword(rePassword);

        // Kiểm tra tất cả các điều kiện
        if (isPasswordValid && isRePasswordValid) {

            try {
                const url = `${process.env.REACT_APP_SERVER_URL}/api/account/update-password`;

                const response = await fetch(url, {
                    method: 'PUT',
                    headers: {
                        'Content-type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
                );

                if (response.ok) {
                    setNotification("New password updated successfully!!");
                } else {
                    console.log(response.json());
                    setNotification("Password update failed.")
                }
            } catch (error) {
                setNotification("Password update failed.")
            }
        }

    }

    //////////////======CHECK PASSWORD ========///////////////////
    const checkPassword = (password: string) => {
        const passwordRegex = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
        if (!passwordRegex.test(password)) {
            setErrorPassword("Mật khẩu phải có ít nhất 8 ký tự và bao gồm ít nhất 1 ký tự đặc biệt (!@#$%^&*)");
            return true;
        } else {
            setErrorPassword("");
            return false;
        }
    }

    const handlePassOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        setErrorPassword('');
        return checkPassword(e.target.value);
    }

    //////////////======CHECK RE PASSWORD ========///////////////////
    const checkRePassword = (rePassword: string) => {
        if (rePassword !== password) {
            setErrorRePassword("Mật khẩu không trùng khớp.");
            return true;
        } else {
            setErrorRePassword(""); // Mật khẩu trùng khớp
            return false;
        }
    }

    const handleRePassOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRePassword(e.target.value);
        setErrorRePassword('');
        return checkRePassword(e.target.value);
    }


    return (
        <form className="mx-1 mx-md-4" onSubmit={handleSubmit}>
            {/* Password new */}
            <div className="d-flex flex-row align-items-center mb-4  text-start">
                {/* <i className="fa-solid fa-key fa-lg me-3 fa-fw"></i> */}
                <div className="form-outline flex-fill mb-0">
                    <label className="form-label" htmlFor="password">New Password<span className="text-danger">(*)</span>
                        <span style={{ color: "red", marginLeft: '10px' }}>{errorPassword}</span>
                    </label>
                    <input type="password" id="password"
                        value={password}
                        onChange={handlePassOnChange}
                        className="form-control" />
                </div>
            </div>

            {/* Retype Password new */}
            <div className="d-flex flex-row align-items-center mb-4  text-start">
                {/* <i className="fa-solid fa-key fa-lg me-3 fa-fw"></i> */}
                <div className="form-outline flex-fill mb-0">
                    <label className="form-label" htmlFor="rePassword">Retype New Password<span className="text-danger">(*)</span>
                        <span style={{ color: "red", marginLeft: '10px' }}>{errorRePassword}</span>
                    </label>
                    <input type="password" id="rePassword"
                        value={rePassword}
                        onChange={handleRePassOnChange}
                        className="form-control" />
                </div>
            </div>

            <div className="text-end">
                <button type="submit" className="btn btn-primary w-100" >Save</button>
            </div>

            <div style={{ color: "green", marginTop: '10px' }}>{notification}</div>
        </form>
    )
}

export default RetypePassForm;