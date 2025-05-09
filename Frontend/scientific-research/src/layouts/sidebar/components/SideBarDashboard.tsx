import { NavLink } from "react-router-dom";

function SideBarDashboard() {
    return (
        <div>
            <NavLink to="/admin/dashboard" className='nav-link d-flex'>
                <div className="sb-nav-link-icon mx-1"><i className="fas fa-tachometer-alt"></i></div>
                Dashboard
            </NavLink>
        </div>
    )
}

export default SideBarDashboard;