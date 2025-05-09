import ThreadCatModel from "../../../models/ThreadCatModel";
import formatDateTime from "../../../utils/datetime/FormatDateTime";
import AdminOrStaffRequire from "../../require/AdminOrStaffRequire";


interface ThreadCatRowInterface {
    threadCat: ThreadCatModel;
    onDelete: (id: number) => void;
    onUpdate: (id: number) => void;
}

const AdminThreadCatRow: React.FC<ThreadCatRowInterface> = (props) => {
    const handleOnDelete = () => {
        const confirm = window.confirm("Are you sure to delete this record?");
        if (confirm) {
            props.onDelete(props.threadCat.threadCatId);
        }
    }

    const handleOnUpdate = () => {
        props.onUpdate(props.threadCat.threadCatId);
    }

    return (
        <tr>
            <td scope="row">{props.threadCat.threadCatId}</td>
            <td>{props.threadCat.name}</td>
            <td>{props.threadCat.description}</td>
            <td>{formatDateTime(props.threadCat.createdAt)}</td>
            <td>{props.threadCat.updatedAt === null ? 'Not update' : formatDateTime(props.threadCat.updatedAt)}</td>
            <td><div>
                <button className="btn btn-success btn-sm rounded-0 text-white mx-2" type="button" data-toggle="tooltip" data-placement="top" title="Edit" onClick={handleOnUpdate}><i className="fa fa-edit"></i></button>
                <button className="btn btn-danger btn-sm rounded-0 text-white mx-2" type="button" data-toggle="tooltip" data-placement="top" title="Delete" onClick={handleOnDelete}><i className="fa fa-trash"></i></button>
            </div>
            </td>
        </tr>
    )
}

export default AdminOrStaffRequire(AdminThreadCatRow);