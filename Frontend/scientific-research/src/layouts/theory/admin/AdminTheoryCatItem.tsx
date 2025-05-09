import TheoryCatModel from "../../../models/TheoryCatModel";
import formatDateTime from "../../../utils/datetime/FormatDateTime";
import AdminOrStaffRequire from "../../require/AdminOrStaffRequire";

interface TheoryCatRowProps {
    theoryCat: TheoryCatModel;
    onDelete: (id: number) => void;
    onUpdate: (id: number) => void;
}
const AdminTheoryCatItem: React.FC<TheoryCatRowProps> = (props) => {
    const handleOnDelete = () => {
        const confirm = window.confirm("Are you sure to delete this record?");
        if (confirm) {
            props.onDelete(props.theoryCat.theoryCatId);
        }
    }

    const handleOnUpdate = () => {
        props.onUpdate(props.theoryCat.theoryCatId);
    }

    return (
        <tr>
            <th scope="row">{props.theoryCat.theoryCatId}</th>
            <td>{props.theoryCat.theoryParentCatId}</td>
            <td>{props.theoryCat.name}</td>
            <td>{props.theoryCat.shortDesc}</td>
            <td>{formatDateTime(props.theoryCat.createdAt)}</td>
            <td>{props.theoryCat.updatedAt === null ? 'Not update' : formatDateTime(props.theoryCat.updatedAt)}</td>
            <td><div>
                <div>
                    <button className="btn btn-success btn-sm rounded-0 text-white mx-2" type="button" data-toggle="tooltip" data-placement="top" title="Edit" onClick={handleOnUpdate}><i className="fa fa-edit"></i></button>
                    <button className="btn btn-danger btn-sm rounded-0 text-white mx-2" type="button" data-toggle="tooltip" data-placement="top" title="Delete" onClick={handleOnDelete}><i className="fa fa-trash"></i></button>
                </div>
            </div></td>
        </tr>
    )
}

export default AdminOrStaffRequire(AdminTheoryCatItem);