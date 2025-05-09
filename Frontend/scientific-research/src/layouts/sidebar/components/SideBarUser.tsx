import { NavLink } from "react-router-dom";


function SideBarUser() {
    return (
        <div>
            <a className="nav-link collapsed d-flex" href="#" data-bs-toggle="collapse" data-bs-target="#user"
                aria-expanded="false" aria-controls="user">
                <div className="sb-nav-link-icon mx-1"><i className="bi bi-people"></i></div>
                User
                <div className="sb-sidenav-collapse-arrow m-1"><i className="fas fa-angle-down"></i></div>
            </a>
            <div className="collapse" id="user" aria-labelledby="headingTwo"
                data-bs-parent="#sidenavAccordion">
                <nav className="sb-sidenav-menu-nested nav accordion flex-column" id="sidenavAccordionPages" style={{textAlign: 'left', marginLeft: '30px'}}>
                    <NavLink to="/admin/user/add" className='nav-link'>Add New</NavLink>
                    <NavLink to="/admin/user/list" className='nav-link'>User List</NavLink>
                </nav>
            </div>
        </div>
    )
}

export default SideBarUser;