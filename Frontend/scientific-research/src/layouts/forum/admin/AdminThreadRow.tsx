import { useEffect, useState } from "react";
import ThreadModel from "../../../models/ThreadModel";
import formatDateTime from "../../../utils/datetime/FormatDateTime";
import ThreadCatModel from "../../../models/ThreadCatModel";
import { getThreadCatByThreadId } from "../../../api/ThreadCatAPI";
import AdminOrStaffRequire from "../../require/AdminOrStaffRequire";

interface ThreadRowInterface {
    thread: ThreadModel;
    onDelete: (id: number) => void;
    onUpdate: (id: number) => void;
}

const AdminThreadRow: React.FC<ThreadRowInterface> = (props) => {
    const [threadCat, setThreadCat] = useState<ThreadCatModel | null>(null);

    useEffect(() => {
        getThreadCatByThreadId(props.thread.threadId)
            .then((result) => {
                if (result) {
                    setThreadCat(result);
                }
            })
    }, [props.thread.threadId])

    const handleOnDelete = () => {
        const confirm = window.confirm("Are you sure to delete this record?");
        if (confirm) {
            props.onDelete(props.thread.threadId);
        }
    }

    const handleOnUpdate = () => {
        props.onUpdate(props.thread.threadId);
    }

    return (
        <tr>
            <td scope="row">{props.thread.threadId}</td>
            <td>{props.thread.shortQuestion}</td>
            <td>{threadCat?.name}</td>
            <td>{props.thread.status ? "Approved" : "Not approved"}</td>
            <td>{props.thread.views}</td>
            <td>{props.thread.votes}</td>
            <td>{props.thread.replies}</td>
            <td>{formatDateTime(props.thread.createdAt)}</td>
            <td>{props.thread.updatedAt === null ? 'Not update' : formatDateTime(props.thread.updatedAt)}</td>
            <td><div>
                <button className="btn btn-success btn-sm rounded-0 text-white mx-2" type="button" data-toggle="tooltip" data-placement="top" title="Edit" onClick={handleOnUpdate}><i className="fa fa-edit"></i></button>
                <button className="btn btn-danger btn-sm rounded-0 text-white mx-2" type="button" data-toggle="tooltip" data-placement="top" title="Delete" onClick={handleOnDelete}><i className="fa fa-trash"></i></button>
            </div>
            </td>
        </tr>
    )
}

export default AdminOrStaffRequire(AdminThreadRow);