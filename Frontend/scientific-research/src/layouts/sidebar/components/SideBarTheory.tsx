import { NavLink } from "react-router-dom";

function SideBarTheory() {
    return (
        <div>
            <a className="nav-link collapsed d-flex" href="#" data-bs-toggle="collapse" data-bs-target="#theory"
                aria-expanded="false" aria-controls="theory">
                <div className="sb-nav-link-icon mx-1"><i className="bi bi-folder-fill"></i></div>
                Theory
                <div className="sb-sidenav-collapse-arrow m-1"><i className="fas fa-angle-down"></i></div>
            </a>
            <div className="collapse" id="theory" aria-labelledby="headingTwo"
                data-bs-parent="#sidenavAccordion">
                <nav className="sb-sidenav-menu-nested nav accordion flex-column" style={{textAlign: 'left', marginLeft: '30px'}}>
                    <NavLink to="/admin/theory/add" className='nav-link'>Add New</NavLink>
                    <NavLink to="/admin/theory/list" className='nav-link'>Theory List</NavLink>
                    <NavLink to="/admin/theory/topic/add" className='nav-link'>Add New Topic</NavLink>
                    <NavLink to="/admin/theory/topic/list" className='nav-link'>Category List</NavLink>
                    <NavLink to="/admin/theory/example/add" className='nav-link'>Add New Example</NavLink>
                    <NavLink to="/admin/theory/example/list" className='nav-link'>Example List</NavLink>
                    <NavLink to="/admin/theory/keyword/add" className='nav-link'>Add New Keyword</NavLink>
                    <NavLink to="/admin/theory/keyword/list" className='nav-link'>Keyword List</NavLink>
                </nav>
            </div>
        </div>
    )
}

export default SideBarTheory;