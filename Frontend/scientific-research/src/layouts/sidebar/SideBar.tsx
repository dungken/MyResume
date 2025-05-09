import SideBarPage from "./components/SideBarPage";
import SideBarPost from "./components/SideBarPost";
import SideBarUser from "./components/SideBarUser";
import SideBarRolePermission from "./components/SideBarRolePermission";
import SideBarThread from "./components/SideBarThread";
import SideBarTheory from "./components/SideBarTheory";
import AdminOrStaffRequire from "../require/AdminOrStaffRequire";

function SideBar() {
    return (
        <div id="layoutSidenav_nav">
            <nav className="sb-sidenav accordion sb-sidenav-light" id="sidenavAccordion">
                <div className="sb-sidenav-menu">
                    <div className="nav py-2">
                        <div className="sb-sidenav-menu-heading text-start text-dark fs-6" style={{ fontWeight: 'bold', width: '100%' }}>Core</div>
                        {/* Dashboard */}
                        {/* <SideBarDashboard /> */}
                        {/* Page */}
                        <SideBarPage />
                        {/* Post */}
                        <SideBarPost />
                        {/* Thread */}
                        <SideBarThread />
                        {/* Theory */}
                        <SideBarTheory />
                        <div className="sb-sidenav-menu-heading text-start text-dark fs-6" style={{ fontWeight: 'bold', width: '100%' }}>Account - User</div>
                        {/* User */}
                        <SideBarUser />
                        {/* RolePermission */}
                        <SideBarRolePermission />
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default AdminOrStaffRequire(SideBar);