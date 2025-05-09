import { NavLink } from "react-router-dom";


function Page500() {
    return (
        <div id="layoutError" style={{minHeight: '700px'}}>
            <div id="layoutError_content">
                <main>
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-lg-6">
                                <div className="text-center mt-4">
                                    <h1 className="display-1">500</h1>
                                    <p className="lead">Internal Server Error</p>
                                    <NavLink to="/">
                                        <i className="fas fa-arrow-left me-1"></i>
                                        Return to Home
                                    </NavLink>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

        </div>
    )
}

export default Page500;