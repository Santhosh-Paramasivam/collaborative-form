import React, { useState } from 'react';

function FormDetails({ form_id, form_name, form_path }) {
    const [copyStatus, setCopyStatus] = useState('Copy');

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText('hello');
            setCopyStatus('Copied!');
            setTimeout(() => setCopyStatus('Copy'), 1500); 
        } catch (err) {
            console.error('Failed to copy text: ', err);
            setCopyStatus('Failed');
        }
    };

    return <div className="container-fluid">
        <div className="row w-100 mt-2">
            <div className="col-2"><p className="fs-5">{form_id}</p></div>
            <div className="col-6"><p className="fs-5">{form_name}</p></div>
            <div className="col-4"><button className="btn btn-light w-100" onClick={handleCopy}>{copyStatus}</button></div>
        </div>
    </div>
}

export default FormDetails