import TheoryModel from "../../../models/TheoryModel";
import formatDateTime from "../../../utils/datetime/FormatDateTime";
import AdminOrStaffRequire from "../../require/AdminOrStaffRequire";

interface TheoryRowInterface {
    theory: TheoryModel;
    onUpdate: (id: number) => void;
}
const AdminTheoryRow: React.FC<TheoryRowInterface> = (props) => {
    const handleOnUpdate = () => {
        props.onUpdate(props.theory.theoryDetailId);
    }

    return (
        <tr>
            <td scope="row">{props.theory.theoryDetailId}</td>
            <td>{props.theory.title}</td>
            <td>{formatDateTime(props.theory.createdAt)}</td>
            <td>{props.theory.updatedAt === null ? 'Not update' : formatDateTime(props.theory.updatedAt)}</td>
            <td><div>
                <button className="btn btn-success btn-sm rounded-0 text-white mx-2" type="button" data-toggle="tooltip" data-placement="top" title="Edit" onClick={handleOnUpdate}><i className="fa fa-edit"></i></button>
            </div>
            </td>
        </tr>
    )
}

export default AdminOrStaffRequire(AdminTheoryRow);