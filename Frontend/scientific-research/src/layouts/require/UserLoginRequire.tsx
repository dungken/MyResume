import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import JwtPayload from "../../models/JwtPayLoad";

const UserLoginRequire = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
    const WithAdminCheck: React.FC<P> = (props) => {
        const navigate = useNavigate();
        useEffect(() => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate("/login");
                return;
            } else {
                // Giải mã token
                const decodedToken = jwtDecode(token) as JwtPayload;

                // Lấy thông tin cụ thể
                const isAdmin = decodedToken.isAdmin;
                const isStaff = decodedToken.isStaff;
                const isUser = decodedToken.isUser;

                if (!isAdmin && !isStaff && !isUser) {
                    navigate("/login");
                    return;
                }
            }
        }, [navigate]);
        return <WrappedComponent {...props} />
    }
    return WithAdminCheck;
}

export default UserLoginRequire;