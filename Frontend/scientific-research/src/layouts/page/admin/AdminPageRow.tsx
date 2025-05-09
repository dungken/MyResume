import PageModel from "../../../models/PageModel";
import formatDateTime from "../../../utils/datetime/FormatDateTime";

interface PageRowInterface {
    page: PageModel;
    onDelete: (id: number) => void;
    onUpdate: (id: number) => void;
}

const AdminPageRow: React.FC<PageRowInterface> = (props) => {
    const handleOnDelete = () => {
        const confirm = window.confirm("Are you sure to delete this record?");
        if (confirm) {
            props.onDelete(props.page.pageId);
        }
    }

    const handleOnUpdate = () => {
        props.onUpdate(props.page.pageId);
    }

    console.log(props.page.updatedAt);
    
    return (
        <tr>
            <td scope="row">{props.page.pageId}</td>
            <td>{props.page.pageName}</td>
            <td>{props.page.shortDesc}</td>
            <td>{formatDateTime(props.page.createdAt)}</td>
            <td>{props.page.updatedAt===null ? 'Not update' : formatDateTime(props.page.updatedAt)}</td>
            <td><div>
                <button className="btn btn-success btn-sm rounded-0 text-white mx-2" type="button" data-toggle="tooltip" data-placement="top" title="Edit" onClick={handleOnUpdate}><i className="fa fa-edit"></i></button>
                <button className="btn btn-danger btn-sm rounded-0 text-white mx-2" type="button" data-toggle="tooltip" data-placement="top" title="Delete" onClick={handleOnDelete}><i className="fa fa-trash"></i></button>
            </div>
            </td>
        </tr>
    )
}

export default AdminPageRow;