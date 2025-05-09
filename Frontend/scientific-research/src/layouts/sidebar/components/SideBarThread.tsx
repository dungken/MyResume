import { NavLink } from "react-router-dom";

function SideBarThread() {
    return (
        <div>
            <a className="nav-link collapsed d-flex" href="#" data-bs-toggle="collapse" data-bs-target="#thread"
                aria-expanded="false" aria-controls="thread">
                <div className="sb-nav-link-icon mx-1"><i className="bi bi-chat-left-dots"></i></div>
                Forum 
                <div className="sb-sidenav-collapse-arrow m-1"><i className="fas fa-angle-down"></i></div>
            </a>
            <div className="collapse" id="thread" aria-labelledby="headingTwo"
                data-bs-parent="#sidenavAccordion">
                <nav className="sb-sidenav-menu-nested nav accordion flex-column" style={{textAlign: 'left', marginLeft: '30px'}}>
                    <NavLink to="/admin/thread/cat/add" className='nav-link'>Add Thread Category</NavLink>
                    <NavLink to="/admin/thread/cat/list" className='nav-link'>Thread Category List</NavLink>
                    <NavLink to="/admin/thread/list" className='nav-link'>Thread List</NavLink>
                    <NavLink to="/admin/thread/comment/list" className='nav-link'>Thread Comment List</NavLink>
                </nav>
            </div>
        </div>
    )
}

export default SideBarThread;