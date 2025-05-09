import { useEffect, useState } from "react";
import PostCatModel from "../../../models/PostCatModel";
import { getPostCatById } from "../../../api/PostCatAPI";
import formatDateTime from "../../../utils/datetime/FormatDateTime";
import AdminOrStaffRequire from "../../require/AdminOrStaffRequire";

interface PostCatRowProps {
    postCat: PostCatModel;
    onDelete: (id: number) => void;
    onUpdate: (id: number) => void;
}


const AdminPostCatItem: React.FC<PostCatRowProps> = (props) => {
    const [parentPostCat, setParentPostCat] = useState<string>('');
    useEffect(() => {
        getPostCatById(props.postCat.postCatParentId)
            .then((result) => {
                if (result)
                    setParentPostCat(result?.postCatName);
            })
    })

    const handleOnDelete = () => {
        const confirm = window.confirm("Are you sure to delete this record?");
        if (confirm) {
            props.onDelete(props.postCat.postCatId);
        }
    }

    const handleOnUpdate = () => {
        props.onUpdate(props.postCat.postCatId);
    }

    return (
        <tr>
            <th scope="row">{props.postCat.postCatId}</th>
            <td>{props.postCat.postCatName}</td>
            <td>{parentPostCat}</td>
            <td>{props.postCat.desc}</td>
            <td>{formatDateTime(props.postCat.createdAt)}</td>
            <td>{props.postCat.updatedAt === null ? 'Not update' : formatDateTime(props.postCat.updatedAt)}</td>
            <td><div>
                <div>
                    <button className="btn btn-success btn-sm rounded-0 text-white mx-2" type="button" data-toggle="tooltip" data-placement="top" title="Edit" onClick={handleOnUpdate}><i className="fa fa-edit"></i></button>
                    <button className="btn btn-danger btn-sm rounded-0 text-white mx-2" type="button" data-toggle="tooltip" data-placement="top" title="Delete" onClick={handleOnDelete}><i className="fa fa-trash"></i></button>
                </div>
            </div></td>
        </tr>
    )
}

export default AdminOrStaffRequire(AdminPostCatItem);