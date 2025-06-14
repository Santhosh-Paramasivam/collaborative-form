import axios from 'axios'
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom'
import { io } from 'socket.io-client';

function UserDashboard() {
    const [formName, setFormName] = useState('')
    const [formElements, setFormElements] = useState([])
    const { form_path } = useParams();
    const [lockedElements, setLockedElements] = useState({})

    const socketRef = useRef(null);

    useEffect(() => {
        socketRef.current = io("http://localhost:8080", {
            withCredentials: true,
            transports: ["websocket"]
        });

        socketRef.current.on("connect", () => {
            console.log("Connected to server");
        });

        socketRef.current.on("locked", (data) => {
            console.log("locked element:", data);
            const id = data.form_element_id;
            setLockedElements((prev) => ({ ...prev, [id]: true }));
        });

        socketRef.current.on('disconnect', () => {
            console.log('Disconnected from server');
        });

        return () => {
            socketRef.current.off('connect');
            socketRef.current.off('message');
            socketRef.current.off('disconnect');
            socketRef.current.disconnect();
        };
    }, []);

    function getForm() {
        axios
            .get(`${import.meta.env.VITE_serverUrl}/get_form_by_path`, { params: { 'form_path': form_path }, headers: { "Authorization": `Bearer ${sessionStorage.getItem('jwtToken')}` } })
            .then((data) => {
                console.log(data)
                setFormElements(data.data.form_items)
                for (let form_item of data.data.form_items) {
                    setLockedElements((prevObj) => ({
                        ...prevObj,
                        [form_item]: false
                    }));

                }
                setFormName(data.data.form_name)
            })
            .catch((error) => console.log(error))
    }

    useEffect(() => { getForm() }, [])

    return <div className="d-flex flex-row bg-white">
        <div className="d-flex flex-column bg-dark border-secondary border-1 border-top" style={{ width: "230px", height: "calc(100vh - 70px)" }}>
            <button className="btn btn-dark fs-5" style={{ height: "100px" }} onClick={() => setPage('view-response')}>Form</button>
            <div className="flex-grow-1"></div>
            <button className="btn btn-dark fs-5 mb-2" style={{ height: "50px" }}>Log Out</button>
        </div>

        <div className='d-flex flex-column mt-2 mx-2'>
            {formElements && formElements.map((form_item) => {
                let color = ''

                if (form_item.id == 14) {
                    color = " border-2 border-black"
                }

                if (form_item.input_type == 'text_label') {
                    return <p className={'fs-4' + color} key={form_item.input_type + form_item.form_item_value}>{JSON.parse(form_item.form_item_value)[0]}</p>
                }
                if (form_item.input_type == 'text_input') {
                    return <input key={form_item.input_type + form_item.form_item_value} className={'form-control' + color} placeholder={JSON.parse(form_item.form_item_value)} />
                }
                if (form_item.input_type == 'dropdown_input') {
                    return <select className={'form-select' + color} key={form_item.input_type + form_item.form_item_value}>
                        {String(JSON.parse(form_item.form_item_value)).split(',').map((value) => { return <option value={value}>{value}</option> })}
                    </select>
                }

                // return <h1 key={form_item}>{form_item.a} + {form_item.b}</h1>
            })}
        </div>
    </div>
}

export default UserDashboard