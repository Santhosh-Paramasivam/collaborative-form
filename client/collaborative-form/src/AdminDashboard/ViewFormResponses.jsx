import { useState } from 'react'
import axios from 'axios'

function ViewFormResponses() {
    const [formId, setFormId] = useState('')
    const [formName, setFormName] = useState('')
    const [formElements, setFormElements] = useState([])

    function getForm() {
        axios.get(`${import.meta.env.VITE_serverUrl}/get_form`, { headers: { 'Authorization': `Bearer ${sessionStorage.getItem('jwtToken')}` }, params: { 'form_id': formId } })
            .then((data) => {
                console.log(data)
                setFormElements(data.data.form_items)
                setFormName(data.data.form_name)
            })
            .catch((error) => console.log(error))
    }

    return <div className="d-flex flex-column w-100 pt-2 px-2">
        <input className="form-control mb-2" placeholder="Enter form id" value={formId} onChange={(e) => { setFormId(e.target.value) }}></input>
        <button className="btn btn-secondary" style={{ height: "50px" }} onClick={getForm}>View Form Responses</button>

        {formElements && formElements.map((form_item) => {
            if (form_item.input_type == 'text_label') {
                return <p className='fs-4' key={form_item.input_type + form_item.form_item_value}>{JSON.parse(form_item.form_item_value)[0]}</p>
            }
            if (form_item.input_type == 'text_input') {
                return <input key={form_item.input_type + form_item.form_item_value} className='form-control' placeholder={JSON.parse(form_item.form_item_value)} />
            }
            if (form_item.input_type == 'dropdown_input') {
                return <select className='form-select' key={form_item.input_type + form_item.form_item_value}>
                    {String(JSON.parse(form_item.form_item_value)).split(',').map((value) => { return <option value={value}>{value}</option> })}
                </select>
            }

            return <h1 key={form_item}>{form_item.a} + {form_item.b}</h1>
        })}

    </div>
}

export default ViewFormResponses