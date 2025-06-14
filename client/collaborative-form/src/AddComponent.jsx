import { useState } from 'react'

function AddComponent({ formElements, setFormElements }) {
    const [inputType, setInputType] = useState('text_label')
    const [formItemValue, setFormItemValue] = useState('')

    function addComponent() {
        console.log(formElements);
        setFormElements((prevFormElements) => [
            ...prevFormElements,
            { input_type: inputType, form_item_value: formItemValue }
        ]);
    }

    return <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <h1 className="modal-title fs-5" id="exampleModalLabel">Give form element details</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    <label className="form-label">Input Type</label>
                    <select className="form-select" value={inputType} onChange={(e) => setInputType(e.target.value)}>
                        <option value="text_label">Text Label</option>
                        <option value="text_input">Text Input</option>
                        <option value="dropdown_input">Dropdown Input</option>
                        <option value="number_input">Number Input</option>
                    </select>
                    <label className="form-label mt-2">Form Item Value</label>
                    <input className="form-control" value={formItemValue} onChange={(e) => setFormItemValue(e.target.value)} placeholder="Enter a single item or many in the format of a,b,c"></input>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" className="btn btn-primary" onClick={addComponent}>Save changes</button>
                </div>
            </div>
        </div>
    </div>
}

export default AddComponent