import ThreadCommentModel from "../../../models/ThreadCommentModel";
import formatDateTime from "../../../utils/datetime/FormatDateTime";
import AdminOrStaffRequire from "../../require/AdminOrStaffRequire";

interface ThreadCommentRowInterface {
    threadComment: ThreadCommentModel;
    onDelete: (id: number) => void;
    onUpdate: (id: number) => void;
}

const AdminThreadCommentRow: React.FC<ThreadCommentRowInterface> = (props) => {
    const handleOnDelete = () => {
        const confirm = window.confirm("Are you sure to delete this record?");
        if (confirm) {
            props.onDelete(props.threadComment.commentId);
        }
    }

    const handleOnUpdate = () => {
        props.onUpdate(props.threadComment.commentId);
    }

    return (
        <tr>
            <td scope="row">{props.threadComment.commentId}</td>
            <td>{props.threadComment.comment}</td>
            <td>{props.threadComment.status ? "Approved" : "Not approved"}</td>
            <td>{formatDateTime(props.threadComment.createdAt)}</td>
            <td>{props.threadComment.updatedAt === null ? 'Not update' : formatDateTime(props.threadComment.updatedAt)}</td>
            <td><div>
                <button className="btn btn-success btn-sm rounded-0 text-white mx-2" type="button" data-toggle="tooltip" data-placement="top" title="Edit" onClick={handleOnUpdate}><i className="fa fa-edit"></i></button>
                <button className="btn btn-danger btn-sm rounded-0 text-white mx-2" type="button" data-toggle="tooltip" data-placement="top" title="Delete" onClick={handleOnDelete}><i className="fa fa-trash"></i></button>
            </div>
            </td>
        </tr>
    )
}

export default AdminOrStaffRequire(AdminThreadCommentRow);