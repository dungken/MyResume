
function Banner() {
    return (
        <div className="container px-5">
            <div className="row gx-5 align-items-center justify-content-center">
                <div className="col-xl-6 col-xxl-6 d-xl-block d-none">
                    <div className="my-5 text-center text-xl-start">
                        <h1 className="display-5 fw-bolder text-white mb-5 text-center">
                            Discrete mathematics support.
                        </h1>
                        <p className="lead fw-normal text-white-50 mb-4 text-center">
                            We're here to help you with queries, problem-solving, and knowledge exchange in discrete mathematics
                        </p>
                    </div>
                </div>
                <div className="col-xl-6 col-xxl-6 d-xl-block d-none">
                    <img className="img-fluid rounded-3 my-5" src={'./../../../images/discrete-math-support-utc2.jpg'} alt="..." style={{ width: '450px' }} />
                </div>
            </div>

        </div>
    )
}

export default Banner;