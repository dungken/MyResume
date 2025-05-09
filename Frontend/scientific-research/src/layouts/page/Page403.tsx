import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import JwtPayload from "../../models/JwtPayLoad";


function Page403() {
    const navigate = useNavigate();
    const [url, setUrl] = useState<string>('/');
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate("/login");
            return;
        } else {
            // Giải mã token
            const decodedToken = jwtDecode(token) as JwtPayload;

            // Lấy thông tin cụ thể
            const isStaff = decodedToken.isStaff;
            if (isStaff) {
                setUrl('/admin')
            }
        }
    }, [navigate]);

    return (
        <div id="layoutError" style={{ minHeight: '700px' }}>
            <div id="layoutError_content">
                <main>
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-lg-6">
                                <div className="text-center mt-4">
                                    <h1 className="display-1">403</h1>
                                    <p className="lead">Forbidden</p>
                                    <p>Access to this resource on the server is denied.</p>
                                    <NavLink to={url}>
                                        <i className="fas fa-arrow-left me-1"></i>
                                        Return to Home
                                    </NavLink>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default Page403;