import { ChangeEvent, useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import SideBar from '../sidebar/SideBar';
import UserModel from '../../models/UserModel';
import { getUserById } from '../../api/UserAPI';
import Page404 from '../page/Page404';
import getBase64 from '../../utils/base64/Base64';
import RequireAdmin from '../require/AdminRequire';
import RoleModel from '../../models/RoleModel';
import { getRole } from '../../api/RoleAPI';
import AdminOrStaffRequire from '../require/AdminOrStaffRequire';

function UserFormUpdate() {
    const { userIdParam } = useParams();
    let userId = 0;
    try {
        userId = parseInt(userIdParam + '');
    } catch (error) {
        userId = 0;
        console.log('Error', error);
    }
    if (Number.isNaN(userId))
        userId = 0;

    const [user, setUser] = useState<UserModel | null>(null);
    // Khởi tạo state cho các trường dữ liệu người dùng
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [usernameTemp, setUsernameTemp] = useState('');
    const [emailTemp, setEmailTemp] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [gender, setGender] = useState(1);
    const [address, setAddress] = useState('');
    const [avatarBase64, setAvatarBase64] = useState<string | null | undefined>(null);
    const [roles, setRoles] = useState<RoleModel[] | null>([]);
    const [selectedRoles, setSelectedRoles] = useState<number[]>([]);


    // Các biến báo lỗi
    const [errorUsername, setErrorUsername] = useState("");
    const [errorEmail, setErrorEmail] = useState("");
    const [successNoti, setSuccessNoti] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        // Gọi API để lấy thông tin người dùng dựa trên userId
        getUserById(userId)
            .then((res) => {
                setUser(res);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
    }, [userId]);

    useEffect(() => {
        getRole(`${process.env.REACT_APP_SERVER_URL}/role`)
            .then(
                res => {
                    setRoles(res.result);
                }
            )
    }, [])


    useEffect(() => {
        if (user !== null) {
            setUsername(user.username === undefined ? '' : user.username)
            setEmail(user.email === undefined ? '' : user.email);
            setUsernameTemp(user.username === undefined ? '' : user.username)
            setEmailTemp(user.email === undefined ? '' : user.email);
            setFirstname(user.firstname === undefined ? '' : user.firstname);
            setLastname(user.lastname === undefined ? '' : user.lastname);
            setPhoneNumber(user.phoneNumber === undefined ? '' : user.phoneNumber);
            setGender(user.gender === true ? 1 : 0);
            setAddress(user.address === undefined ? '' : user.address);
            setAvatarBase64(user.avatar === null ? null : user.avatar);
        }
    }, [user]);

    const handleRoleChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = event.target.selectedOptions;
        const selectedRoleIds: number[] = [];
        for (let i = 0; i < selectedOptions.length; i++) {
            selectedRoleIds.push(parseInt(selectedOptions[i].value));
        }
        setSelectedRoles(selectedRoleIds);
    };

    // Handle submit form
    const handleSubmit = async (e: React.FormEvent) => {
        // Clear any previous error messages
        setErrorUsername('');
        setErrorEmail('');

        // Tránh click liên tục
        e.preventDefault();

        // Kiểm tra các điều kiện và gán kết quả vào biến
        const isUsernameValid = !await checkExistedUsername(username);
        const isEmailValid = !await checkExistedEmail(email);

        // Kiểm tra tất cả các điều kiện
        if (isUsernameValid && isEmailValid) {

            const token = localStorage.getItem('token');
            fetch(`${process.env.REACT_APP_SERVER_URL}/api/user/update`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        userId: userId,
                        username: username,
                        email: email,
                        firstname: firstname,
                        lastname: lastname,
                        phoneNumber: phoneNumber,
                        gender: gender,
                        active: 0,
                        activeCode: "",
                        avatar: avatarBase64,
                        address: address,
                        createdAt: '',
                        roles: selectedRoles
                    })

                }
            ).then((response) => {
                if (response.ok) {
                    setSuccessNoti("User updated successfully!");

                    setUsername('');
                    setEmail('');
                    setFirstname('');
                    setLastname('');
                    setPhoneNumber('');
                    setGender(1);
                    setAddress('');
                    setAvatarBase64(null);

                } else {
                    setError("Error while updating user!");
                }
            })
        }

    }

    //////////////======CHECK USERNAME========///////////////////
    const checkExistedUsername = async (username: string) => {
        // Endpoint
        const url = `${process.env.REACT_APP_SERVER_URL}/user/search/existsByUsername?username=${username}`;
        // Call API
        try {
            const response = await fetch(url);
            const data = await response.text();
            if (data === 'true' && username !== usernameTemp) {
                setErrorUsername('Username already existsi!');
                return true;
            }
        } catch (error) {
            console.error("Lỗi khi kiểm tra tên đăng nhập: " + error);
            return false;
        }
    }

    const handleUsernameOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
        setErrorUsername('');
        return checkExistedUsername(e.target.value);
    }

    //////////////======CHECK EMAIL ========///////////////////
    const checkExistedEmail = async (email: string) => {
        // Endpoint
        const url = `${process.env.REACT_APP_SERVER_URL}/user/search/existsByEmail?email=${email}`;
        // Call API
        try {
            const response = await fetch(url);
            const data = await response.text();
            if (data === 'true' && email !== emailTemp) {
                setErrorEmail('Email address already exists!');
                return true;
            }
        } catch (error) {
            console.error("Lỗi khi kiểm tra email: " + error);
            return false;
        }
    }

    const handleEmailOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        setErrorEmail('');
        return checkExistedEmail(e.target.value);
    }

    //////////////====== HANDLE AVATAR ========///////////////////
    const handleAvatarOnChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const file = e.target.files[0];
            setAvatarBase64(await getBase64(file));
        }
    };

    if (userId === 0) {
        return (
            <Page404 />
        )
    }


    return (
        <div id="layoutSidenav" className="container-fluid" style={{ minHeight: '700px', textAlign: 'left' }}>
            <div className="row">
                <div className="col-md-2">
                    <SideBar />
                </div>
                <div id="layoutSidenav_content" className="col-md-10">
                    <main>
                        <div id="content" className="container">
                            <div className="card">
                                <div className="card-header" style={{ fontWeight: 'bold' }}>
                                    Edit user
                                </div>
                                <div className="card-body w-75 mx-auto">
                                    <form onSubmit={handleSubmit}>
                                        {/* User ID */}
                                        <input
                                            type='hidden'
                                            id='userId'
                                            value={userId}
                                        />
                                        {/* Username */}
                                        <div className="d-flex flex-row align-items-center mb-4  text-start">
                                            <i className="fas fa-user fa-lg me-3 fa-fw"></i>
                                            <div className="form-outline flex-fill mb-0">
                                                <label className="form-label" htmlFor="username">Username <span className="text-danger">(*)</span>
                                                    <span style={{ color: "red", marginLeft: '10px' }}>{errorUsername}</span>
                                                </label>
                                                <input type="text" id="username"
                                                    value={username}
                                                    onChange={handleUsernameOnChange}
                                                    className="form-control" />
                                            </div>
                                        </div>

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

                                        {/* Firstname */}
                                        <div className="d-flex flex-row align-items-center mb-4  text-start">
                                            <i className="fa-solid fa-signature me-3"></i>
                                            <div className="form-outline flex-fill mb-0">
                                                <label className="form-label" htmlFor="firstname">Firstname</label>
                                                <input type="text" id="firstname" className="form-control"
                                                    value={firstname}
                                                    onChange={(e) => setFirstname(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        {/* Lastname */}
                                        <div className="d-flex flex-row align-items-center mb-4  text-start">
                                            <i className="fa-solid fa-signature me-3"></i>
                                            <div className="form-outline flex-fill mb-0">
                                                <label className="form-label" htmlFor="lastname">Lastname </label>
                                                <input type="text" id="lastname" className="form-control"
                                                    value={lastname}
                                                    onChange={(e) => setLastname(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        {/* Phone number */}
                                        <div className="d-flex flex-row align-items-center mb-4  text-start">
                                            <i className="fa-solid fa-phone-volume me-3"></i>
                                            <div className="form-outline flex-fill mb-0">
                                                <label className="form-label" htmlFor="phoneNumber">Phone Number </label>
                                                <input type="text" id="phoneNumber" className="form-control"
                                                    value={phoneNumber}
                                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        {/* Address */}
                                        <div className="d-flex flex-row align-items-center mb-4  text-start">
                                            <i className="fa-solid fa-phone-volume me-3"></i>
                                            <div className="form-outline flex-fill mb-0">
                                                <label className="form-label" htmlFor="address">Address</label>
                                                <input type="text" id="address" className="form-control"
                                                    value={address}
                                                    onChange={(e) => setAddress(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        {/* Gender */}
                                        <div className="d-flex flex-row align-items-center mb-4  text-start">
                                            <i className="fa-solid fa-venus-mars me-3"></i>
                                            <div className="form-outline flex-fill mb-0">
                                                <label className="form-label" htmlFor="gender">Gender</label>
                                                <div className="container row">
                                                    <div className="form-check col-md-3">
                                                        <input className="form-check-input" type="radio" name="exampleRadios" id="male"
                                                            value={1} checked={gender === 1}
                                                            onChange={(e) => setGender(parseInt(e.target.value))}
                                                        />
                                                        <label className="form-check-label" htmlFor="male">
                                                            Male
                                                        </label>
                                                    </div>
                                                    <div className="form-check col-md-3">
                                                        <input className="form-check-input" type="radio" name="exampleRadios" id="female"
                                                            value={0} checked={gender === 0}
                                                            onChange={(e) => setGender(parseInt(e.target.value))}
                                                        />
                                                        <label className="form-check-label" htmlFor="female">
                                                            Female
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Avatar */}
                                        <div className="d-flex flex-row align-items-center mb-4  text-start">
                                            <i className="fa-regular fa-image me-3"></i>
                                            <div className="form-outline flex-fill mb-0">
                                                <label className="form-label" htmlFor="avatar">Avatar</label>
                                                <input type="file" id="avatar" className="form-control"
                                                    accept='images/*'
                                                    onChange={handleAvatarOnChange}
                                                />
                                            </div>
                                        </div>
                                        <div className='text-center'>
                                            <img className='img-thumbnail w-50' src={avatarBase64 + ''} alt="" />
                                        </div>

                                        {/* Roles */}
                                        <div className="d-flex flex-row align-items-center my-4 text-start">
                                            <i className="bi bi-person-check me-3 fa-fw"></i>
                                            <select
                                                className="form-select"
                                                multiple aria-label="multiple select example"
                                                value={selectedRoles.map(roleId => String(roleId))}
                                                onChange={handleRoleChange}
                                            >
                                                <option selected>Choose role</option>
                                                {
                                                    roles?.map((role) => (
                                                        <option
                                                            key={role.roleId}
                                                            value={role.roleId}
                                                        >
                                                            {role.roleName}
                                                        </option>
                                                    ))
                                                }
                                            </select>
                                        </div>

                                        <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                                            <div className="container">
                                                <div className="row">
                                                    {
                                                        successNoti && <NavLink to='/admin/user/list' className="btn btn-info btn-lg w-25 col-md-6 mx-4">View list user</NavLink>
                                                    }
                                                    <button type="submit" className="btn btn-primary btn-lg w-25 col-md-6">Save</button>
                                                </div>
                                            </div>

                                        </div>
                                        <div style={{ color: "green" }}>{successNoti ? successNoti : error}</div>
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

export default AdminOrStaffRequire(UserFormUpdate);