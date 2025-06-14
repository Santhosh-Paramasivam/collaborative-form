import { useState } from 'react'
import AddComponent from "../AddComponent"
import axios from 'axios'

function CreateForm() {
    const [formElements, setFormElements] = useState([])
    const [formName, setFormName] = useState('')

    function saveForm() {
        axios.post(`${import.meta.env.VITE_serverUrl}/create_form`, { "form_name": formName }, { headers: { 'Authorization': `Bearer ${sessionStorage.getItem('jwtToken')}` } }
        ).then((data) => {
            console.log(data)
            var form_id = data.data.form_id
            for (let form_element of formElements) {
                axios.post(`${import.meta.env.VITE_serverUrl}/append_to_form`, {
                    "form_id": form_id,
                    "input_type": form_element.input_type,
                    "form_item_value": form_element.form_item_value
                }, { headers: { "Authorization": `Bearer ${sessionStorage.getItem('jwtToken')}` } })
                    .then((data) => console.log(data))
                    .catch((error) => console.log(error))
            }
        }
        )
            .catch((error) => console.log(error))
    }

    return <div className="container-fluid w-100">
        <div className="d-flex flex-column mt-2 mx-2">
            <label className="form-label">Form Name</label>
            <input className="form-control" value={formName} onChange={(e) => { setFormName(e.target.value) }} placeholder="Enter form name"></input>
            <button className="btn btn-secondary mt-2" style={{ height: "50px" }} data-bs-toggle="modal" data-bs-target="#exampleModal">Add Form Element</button>
            <button className="btn btn-outline-primary mt-2" style={{ height: "50px" }} onClick={saveForm}>Save form</button>
        </div>

        <AddComponent setFormElements={setFormElements} formElements={formElements}></AddComponent>

        <p className='fs-4 mt-2'>Form Preview : </p>
        <hr></hr>

        {formElements && formElements.map((form_item) => {
            if (form_item.input_type == 'text_label') {
                return <p className='fs-4' key={form_item.input_type + form_item.form_item_value}>{form_item.form_item_value}</p>
            }
            if (form_item.input_type == 'text_input') {
                return <input key={form_item.input_type + form_item.form_item_value} className='form-control' placeholder={form_item.form_item_value} />
            }
            if (form_item.input_type == 'dropdown_input') {
                return <select className='form-select' key={form_item.input_type + form_item.form_item_value}>
                    {form_item.form_item_value.split(',').map((value) => { return <option value={value}>{value}</option> })}
                </select>
            }

            return <h1 key={form_item}>{form_item.a} + {form_item.b}</h1>
        })}
    </div>
}

export default CreateForm