function Navbar() {
    return <nav className="navbar bg-dark navbar-expand-md py-0" data-bs-theme="dark">
        <div className="container-fluid bg-body-dark bg-dark">
            <a className="navbar-brand px-2 py-3 fs-3 text-light" href="#">Colab Form</a>
            <button className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#nav-nav">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="nav-nav">
                <div className="navbar-nav">
                    <a className="nav-link active h4" href="#">Register</a>
                    <a className="nav-link h4" href='#'>Login</a>
                </div>
            </div>
        </div>
    </nav>
}

export default Navbar