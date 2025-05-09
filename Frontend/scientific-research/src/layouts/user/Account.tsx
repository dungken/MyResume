import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import UserModel from "../../models/UserModel";
import { jwtDecode } from "jwt-decode";
import JwtPayload from "../../models/JwtPayLoad";
import { getUserById } from "../../api/UserAPI";
import getBase64 from "../../utils/base64/Base64";
import capitalize from "../../utils/string/CapitalizeString";


function Account() {
    const [user, setUser] = useState<UserModel | null>(null);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [firstname, setFirstname] = useState<string>('');
    const [lastname, setLastname] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [gender, setGender] = useState<number>(0);
    const [successNoti, setSuccessNoti] = useState("");
    const [avatarBase64, setAvatarBase64] = useState<string | null | undefined>(null);
    const [error, setError] = useState("");

    const token = localStorage.getItem('token');
    let userId = 0;
    if (token) {
        const decodedToken = jwtDecode(token) as JwtPayload;
        userId = decodedToken.userId;
    }

    useEffect(() => {
        getUserById(userId)
            .then(result => {
                if (result)
                    setUser(result)
            })
    }, [userId])

    useEffect(() => {
        if (user !== null) {
            setUsername(user.username ?? '');
            setEmail(user.email ?? '');
            setFirstname(user.firstname ?? '');
            setLastname(user.lastname ?? '');
            setPhoneNumber(user.phoneNumber ?? '');
            setAddress(user.address ?? '');
            setGender(user.gender === true ? 1 : 0);
            setAvatarBase64(user.avatar === null ? null : user.avatar);
        }
    }, [user])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        fetch(`${process.env.REACT_APP_SERVER_URL}/api/user/update/info`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userId,
                    username: user?.username,
                    email: user?.email,
                    firstname: firstname,
                    lastname: lastname,
                    phoneNumber: phoneNumber,
                    gender: gender,
                    avatar: user?.avatar,
                    address: address,
                })

            }
        ).then((response) => {
            if (response.ok) {
                setSuccessNoti("Updated successfully!");
                setFirstname(firstname);
                setLastname(lastname);
                setPhoneNumber(phoneNumber);
                setGender(gender);
                setAddress(address);
            } else {
                setError("Error while updating user!");
            }
        })
    }

    return (
        <div className="container" >
            <div className="main-body" style={{ margin: '0px auto', minHeight: '750px' }}>
                <nav aria-label="breadcrumb" className="main-breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><NavLink to="/">Home</NavLink></li>
                        <li className="breadcrumb-item"><NavLink to="/user/account">User</NavLink></li>
                        <li className="breadcrumb-item active" aria-current="page">User Profile</li>
                    </ol>
                </nav>

                <div className="row gutters-sm">
                    <div className="col-md-5 mb-3">
                        <div className="card">
                            <div className="card-body">
                                <div className="d-flex flex-column align-items-center text-center">
                                    {avatarBase64 && <img src={avatarBase64} alt={username} className="rounded-circle" width="150" />
                                    }
                                    <div className="mt-3">
                                        <h4>{capitalize(username)}</h4>
                                        <p className="text-secondary mb-1">Full Stack Developer</p>
                                        <p className="text-muted font-size-sm">Bay Area, San Francisco, CA</p>
                                        <button className="btn btn-primary mx-2">Follow</button>
                                        <button className="btn btn-outline-primary mx-2">Message</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card mt-3">
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                                    <h6 className="mb-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-globe mr-2 icon-inline">
                                            <circle className="mx-2" cx="12" cy="12" r="10"></circle>
                                            <line x1="2" y1="12" x2="22" y2="12"></line>
                                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                                        </svg>
                                        Website
                                    </h6>
                                    <span className="text-secondary">https://bootdey.com</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                                    <h6 className="mb-0"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-github mr-2 icon-inline"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>Github</h6>
                                    <span className="text-secondary">bootdey</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                                    <h6 className="mb-0"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-twitter mr-2 icon-inline text-info"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>Twitter</h6>
                                    <span className="text-secondary">@bootdey</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                                    <h6 className="mb-0"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-instagram mr-2 icon-inline text-danger"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>Instagram</h6>
                                    <span className="text-secondary">bootdey</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                                    <h6 className="mb-0"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-facebook mr-2 icon-inline text-primary"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>Facebook</h6>
                                    <span className="text-secondary">bootdey</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-md-7" style={{ textAlign: 'left' }}>
                        <div className="card">
                            <div className="card-body">
                                {/* User ID */}
                                <input
                                    type='hidden'
                                    id='userId'
                                    value={userId}
                                />

                                <form action="" onSubmit={handleSubmit}>
                                    {/* Username */}
                                    <div className="row mb-3">
                                        <div className="col-sm-3">
                                            <h6 className="mb-0">Username</h6>
                                        </div>
                                        <div className="col-sm-9 text-secondary">
                                            <input type="text" className="form-control" value={user?.username} disabled />
                                        </div>
                                    </div>
                                    {/* Email */}
                                    <div className="row mb-3">
                                        <div className="col-sm-3">
                                            <h6 className="mb-0">Email</h6>
                                        </div>
                                        <div className="col-sm-9 text-secondary">
                                            <input type="email" className="form-control" value={user?.email} disabled />
                                        </div>
                                    </div>
                                    {/* Firstname */}
                                    <div className="row mb-3">
                                        <div className="col-sm-3">
                                            <h6 className="mb-0">First Name</h6>
                                        </div>
                                        <div className="col-sm-9 text-secondary">
                                            <input type="text" className="form-control"
                                                value={firstname}
                                                onChange={(e) => setFirstname(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    {/* Lastname */}
                                    <div className="row mb-3">
                                        <div className="col-sm-3">
                                            <h6 className="mb-0">Last Name</h6>
                                        </div>
                                        <div className="col-sm-9 text-secondary">
                                            <input type="text" className="form-control"
                                                value={lastname}
                                                onChange={(e) => setLastname(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    {/* Phone Number */}
                                    <div className="row mb-3">
                                        <div className="col-sm-3">
                                            <h6 className="mb-0">Phone</h6>
                                        </div>
                                        <div className="col-sm-9 text-secondary">
                                            <input type="text" className="form-control"
                                                value={phoneNumber}
                                                onChange={(e) => setPhoneNumber(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    {/* Address */}
                                    <div className="row mb-3">
                                        <div className="col-sm-3">
                                            <h6 className="mb-0">Address</h6>
                                        </div>
                                        <div className="col-sm-9 text-secondary">
                                            <input type="text" className="form-control"
                                                value={address}
                                                onChange={(e) => setAddress(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    {/* Gender */}
                                    <div className="row mb-3">
                                        <div className="col-sm-3">
                                            <h6 className="mb-0">Gender</h6>
                                        </div>

                                        <div className="col-sm-9 text-secondary">
                                            <div className="container row">
                                                <div className="form-check col-md-3">
                                                    <input className="form-check-input" type="radio" name="exampleRadios" id="male" value={1}
                                                        onChange={e => setGender(parseInt(e.target.value))}
                                                        checked={gender === 1} />
                                                    <label className="form-check-label" htmlFor="male">
                                                        Male
                                                    </label>
                                                </div>
                                                <div className="form-check col-md-3">
                                                    <input className="form-check-input" type="radio" name="exampleRadios" id="female" value={0}
                                                        onChange={e => setGender(parseInt(e.target.value))}
                                                        checked={gender === 0} />
                                                    <label className="form-check-label" htmlFor="female">
                                                        Female
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Submit */}
                                    <div className="row">
                                        <div className="col-md-3"></div>
                                        <div className="col-md-9">
                                            <button type="submit" className="btn btn-primary px-4 mt-4">
                                                Save Changes
                                            </button >
                                            <div className="text-success mt-3">{successNoti}</div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}



export default Account;