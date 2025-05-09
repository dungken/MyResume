function About() {
    return (
        <div>
            <section className="" style={{minHeight: '700px'}}>
                <div className="container px-5 my-5">
                    <div className="text-center">
                        <h2 className="fw-bolder">Our team</h2>
                        <p className="lead fw-normal text-muted mb-5">Dedicated to quality and your success</p>
                    </div>
                    <div className="row gx-5 row-cols-1 row-cols-sm-2 row-cols-xl-4 justify-content-center">
                        <div className="col mb-5 mb-5 mb-xl-0">
                            <div className="text-center">
                                <img className="img-fluid rounded-circle mb-4 px-4" src={'./../../../images/cat-1.jpg'} alt="..." width={250} height={250}/>
                                <h5 className="fw-bolder">Ngoc Oanh</h5>
                            </div>
                        </div>
                        <div className="col mb-5 mb-5 mb-xl-0">
                            <div className="text-center">
                                <img className="img-fluid rounded-circle mb-4 px-4" src={'./../../../images/cat-2.jpg'} alt="..." width={250} height={250} />
                                <h5 className="fw-bolder">Van Dung</h5>
                            </div>
                        </div>
                        <div className="col mb-5 mb-5 mb-sm-0">
                            <div className="text-center">
                                <img className="img-fluid rounded-circle mb-4 px-4" src={'./../../../images/cat-3.jpg'} alt="..." width={250} height={250} />
                                <h5 className="fw-bolder">Thanh Duoc</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default About;