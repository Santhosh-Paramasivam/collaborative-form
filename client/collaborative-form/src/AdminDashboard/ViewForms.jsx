import FormDetails from "../FormDetails"

function ViewForms({formList}) {
    return <div className="container-fluid">
        <div className="row w-100 mt-2">
            <div className="col-2 border-end"><p className="fs-5">Form Id</p></div>
            <div className="col-6 border-end"><p className="fs-5">Form Name</p></div>
            <div className="col-4 border-end"><p className="fs-5">Form Link</p></div>
        </div>
        {formList && formList.map((form) => { return <FormDetails key={form.id} form_id={form.id} form_name={form.name} form_path={form.path} /> })}
        {/* <FormDetails form_id="1" form_name="SRM Placement" form_path="asdsadwdsads"></FormDetails> */}
    </div>
}

export default ViewForms