import { jwtDecode } from "jwt-decode";
import ThreadModel from "../../models/ThreadModel";
import UserModel from "../../models/UserModel";
import JwtPayload from "../../models/JwtPayLoad";
import { useEffect, useState } from "react";
import { getUserById } from "../../api/UserAPI";
import UserLoginRequire from "../require/UserLoginRequire";
import capitalize from "../../utils/string/CapitalizeString";

interface FormCommentProps {
    thread: ThreadModel;
    comment: string;
    setComment: (comment: string) => void;
    handleSubmit: (e: React.FormEvent) => void;
}

const FormComment: React.FC<FormCommentProps> = (props) => {
    const [user, setUser] = useState<UserModel | null>(null);

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


    return (
        <div className="d-flex flex-row add-comment-section mt-4 mb-4">
            <div className="container">
                <div className="row">
                    <div className="col-md-1 my-1">
                        <img className="img-fluid img-responsive rounded-circle" src={user?.avatar} width={30} height={30} />
                    </div>
                    <div className="col-md-10 my-1">
                        <textarea
                            className="form-control"
                            placeholder="Add comment"
                            value={props.comment}
                            onChange={(e) => props.setComment(e.target.value)}
                        />
                    </div>
                    <div className="col-md-1 my-1">
                        <button className="btn btn-primary" onClick={props.handleSubmit} type="submit">Comment</button>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default UserLoginRequire(FormComment);