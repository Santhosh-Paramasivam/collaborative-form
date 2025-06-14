function UserDashboard() {
    return <div className="d-flex flex-row bg-white">
        <div className="d-flex flex-column bg-dark border-secondary border-1 border-top" style={{ width: "230px", height: "calc(100vh - 70px)" }}>
            <button className="btn btn-dark fs-5" style={{ height: "100px" }} onClick={() => setPage('view-response')}>View Form Responses</button>
            <div className="flex-grow-1"></div>
            <button className="btn btn-dark fs-5 mb-2" style={{ height: "50px" }}>Log Out</button>
        </div>
    </div>
}

export default UserDashboard