import { useEffect, useState } from "react";
import PostModel from "../../../models/PostModel";
import { getPostCatByPostId } from "../../../api/PostCatAPI";
import formatDateTime from "../../../utils/datetime/FormatDateTime";
import AdminOrStaffRequire from "../../require/AdminOrStaffRequire";

interface PostRowInterface {
    post: PostModel;
    onDelete: (id: number) => void;
    onUpdate: (id: number) => void;
}

const AdminPostRow: React.FC<PostRowInterface> = (props) => {
    const [postCatName, setPostCatName] = useState<string>('');

    useEffect(() => {
        getPostCatByPostId(props.post.postId)
            .then((result) => {
                if (result != null) {
                    setPostCatName(result.postCatName);
                }
            })
    })

    const handleOnDelete = () => {
        const confirm = window.confirm("Are you sure to delete this record?");
        if (confirm) {
            props.onDelete(props.post.postId);
        }
    }

    const handleOnUpdate = () => {
        props.onUpdate(props.post.postId);
    }



    return (
        <tr>
            <td scope="row">{props.post.postId}</td>
            <td><img src={props.post.thumbnail} alt="" style={{ maxWidth: '80px' }} /></td>
            <td>{props.post.title}</td>
            <td>{postCatName}</td>
            <td>{props.post.desc}</td>
            <td>{formatDateTime(props.post.createdAt)}</td>
            <td>{props.post.updatedAt === null ? 'Not update' : formatDateTime(props.post.updatedAt)}</td>
            <td><div>
                <button className="btn btn-success btn-sm rounded-0 text-white mx-2" type="button" data-toggle="tooltip" data-placement="top" title="Edit" onClick={handleOnUpdate}><i className="fa fa-edit"></i></button>
                <button className="btn btn-danger btn-sm rounded-0 text-white mx-2" type="button" data-toggle="tooltip" data-placement="top" title="Delete" onClick={handleOnDelete}><i className="fa fa-trash"></i></button>
            </div>
            </td>

        </tr>
    )
}

export default AdminOrStaffRequire(AdminPostRow)