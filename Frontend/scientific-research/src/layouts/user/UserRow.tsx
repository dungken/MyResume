import { jwtDecode } from "jwt-decode";
import UserModel from "../../models/UserModel";
import { useEffect, useState } from 'react';
import JwtPayload from "../../models/JwtPayLoad";
import RequireAdmin from "../require/AdminRequire";
import formatDateTime from "../../utils/datetime/FormatDateTime";
import AdminOrStaffRequire from "../require/AdminOrStaffRequire";

interface UserPropsInterface {
    user: UserModel;
    onDelete: (id: number) => void;
    onUpdate: (id: number) => void;
}

const UserRow: React.FC<UserPropsInterface> = (props) => {
    const [isUserLogin, setIsUserLogin] = useState(false);

    const handleDelete = () => {
        const confirm = window.confirm("Are you sure to delete this record?");
        if (confirm) {
            props.onDelete(props.user.userId);
        }
    }

    const handleUpdate = () => {
        props.onUpdate(props.user.userId);
    }

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token) as JwtPayload;
            const userIdToken = decodedToken.userId;

            if (userIdToken === props.user.userId) {
                setIsUserLogin(true);
            }
        }
    }, [])


    return (
        <tr>
            <th scope="row">{props.user.userId}</th>
            <td><img src={props.user.avatar} alt="" style={{ maxWidth: '80px' }} /></td>
            <td>{props.user.username}</td>
            <td>{props.user.email}</td>
            <td>{props.user.firstname === '' ? "null" : props.user.firstname}</td>
            <td>{props.user.lastname === '' ? "null" : props.user.lastname}</td>
            <td>{props.user.active ? '1' : '0'}</td>
            <td>{formatDateTime(props.user.createdAt)}</td>
            <td>{props.user.updatedAt === null ? 'Not update' : formatDateTime((props.user.updatedAt))}</td>
            <td>
                {
                    !isUserLogin &&
                    <div>
                        <button className="btn btn-success btn-sm rounded-0 text-white mx-2" type="button" data-toggle="tooltip" data-placement="top" title="Edit" onClick={handleUpdate}><i className="fa fa-edit"></i></button>
                        <button className="btn btn-danger btn-sm rounded-0 text-white mx-2" type="button" data-toggle="tooltip" data-placement="top" title="Delete" onClick={handleDelete}><i className="fa fa-trash"></i></button>
                    </div>
                }
            </td>
        </tr>

    )
}
export default AdminOrStaffRequire(UserRow);