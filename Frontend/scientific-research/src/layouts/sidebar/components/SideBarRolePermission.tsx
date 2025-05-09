import { NavLink } from "react-router-dom";

function SideBarRolePermission() {
    return (
        <div>
            <div>
                <a className="nav-link collapsed d-flex" href="#" data-bs-toggle="collapse" data-bs-target="#rolePermission"
                    aria-expanded="false" aria-controls="rolePermission">
                    <div className="sb-nav-link-icon mx-1"><i className="bi bi-person-check"></i></div>
                    Permission - Role
                    <div className="sb-sidenav-collapse-arrow m-1"><i className="fas fa-angle-down"></i></div>
                </a>
                <div className="collapse" id="rolePermission" aria-labelledby="headingTwo"
                    data-bs-parent="#sidenavAccordion">
                    <nav className="sb-sidenav-menu-nested nav accordion flex-column" style={{textAlign: 'left', marginLeft: '30px'}}>
                        <NavLink to="/admin/role/permission/add" className='nav-link'>Add Permission</NavLink>
                        <NavLink to="/admin/role/permission/list" className='nav-link'>Permission List</NavLink>
                        <NavLink to="/admin/role/add" className='nav-link'>Add Role</NavLink>
                        <NavLink to="/admin/role/list" className='nav-link'>Role List</NavLink>
                    </nav>
                </div>
            </div>
        </div>
    )
}

export default SideBarRolePermission;