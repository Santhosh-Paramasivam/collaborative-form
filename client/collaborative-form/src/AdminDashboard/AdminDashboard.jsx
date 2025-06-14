import axios from "axios"
import { useEffect, useState } from "react"
import FormDetails from "../FormDetails"
import ViewForms from './ViewForms'
import CreateForm from "./CreateForm"
import ViewFormResponses from "./ViewFormResponses"

function AdminDashboard() {
    const [formList, setFormList] = useState([])
    const [page, setPage] = useState('view-all')


    function getForms() {
        let token = sessionStorage.getItem('jwtToken')

        axios
            .get(`${import.meta.env.VITE_serverUrl}/get_all_forms`, { headers: { Authorization: `Bearer ${token}` } })
            .then((data) => {
                console.log(data)
                setFormList(data.data)
            })
            .catch((error) => console.log(error))
    }

    useEffect(() => { getForms() }, [])

    return <div className="d-flex flex-row bg-white">
        <div className="d-flex flex-column bg-dark border-secondary border-1 border-top" style={{ width: "230px", height: "calc(100vh - 70px)" }}>
            <button className="btn btn-dark fs-5" style={{ height: "50px" }} onClick={() => setPage('view-all')}>View All Forms</button>
            <button className="btn btn-dark fs-5" style={{ height: "50px" }} onClick={() => setPage('create')}>Create Form</button>
            <button className="btn btn-dark fs-5" style={{ height: "100px" }} onClick={() => setPage('view-response')}>View Form Responses</button>
            <div className="flex-grow-1"></div>
            <button className="btn btn-dark fs-5 mb-2" style={{ height: "50px" }}>Log Out</button>
        </div>

        {page == 'view-all' && <ViewForms formList={formList}></ViewForms>}
        {page == 'create' && <CreateForm></CreateForm>}
        {page == 'view-response' && <ViewFormResponses></ViewFormResponses>}
    </div>
}

export default AdminDashboard