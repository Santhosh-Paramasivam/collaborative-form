function FormDetails({ form_id, form_name, form_path }) {
    return <div className="container-fluid">
        <div className="row w-100 mt-2">
            <div className="col-2"><p className="fs-5">{form_id}</p></div>
            <div className="col-6"><p className="fs-5">{form_name}</p></div>
            <div className="col-4"><p className="fs-5">{form_path}</p></div>
        </div>
    </div>
}

export default FormDetails