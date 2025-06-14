import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';

function UserDashboard() {
    const [formName, setFormName] = useState('');
    const [formElements, setFormElements] = useState([]);
    const { form_path } = useParams();
    const [lockedElements, setLockedElements] = useState({});

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
            const id = data.form_element_id;
            setLockedElements((prev) => ({ ...prev, [id]: true }));
        });

        socketRef.current.on("unlocked", (data) => {
            const id = data.form_element_id;
            setLockedElements((prev) => ({ ...prev, [id]: false }));
        });

        socketRef.current.on('disconnect', () => {
            console.log('Disconnected from server');
        });

        return () => {
            socketRef.current.off('connect');
            socketRef.current.off('locked');
            socketRef.current.off('unlocked');
            socketRef.current.off('disconnect');
            socketRef.current.disconnect();
        };
    }, []);

    function getForm() {
        axios
            .get(`${import.meta.env.VITE_serverUrl}/get_form_by_path`, {
                params: { 'form_path': form_path },
                headers: {
                    "Authorization": `Bearer ${sessionStorage.getItem('jwtToken')}`
                }
            })
            .then((data) => {
                setFormElements(data.data.form_items);
                const lockedState = {};
                for (let form_item of data.data.form_items) {
                    lockedState[form_item.id] = false;
                }
                setLockedElements(lockedState);
                setFormName(data.data.form_name);
            })
            .catch((error) => console.log(error));
    }

    useEffect(() => {
        getForm();
    }, []);

    function handleFocus(id) {
        socketRef.current.emit('lock', { form_element_id: id });
    }

    function handleBlur(id) {
        socketRef.current.emit('unlock', { form_element_id: id });
    }

    return (
        <div className="d-flex flex-row bg-white">
            <div className="d-flex flex-column bg-dark border-secondary border-1 border-top" style={{ width: "230px", height: "calc(100vh - 70px)" }}>
                <button className="btn btn-dark fs-5" style={{ height: "100px" }}>Form</button>
                <div className="flex-grow-1"></div>
                <button className="btn btn-dark fs-5 mb-2" style={{ height: "50px" }}>Log Out</button>
            </div>

            <div className='d-flex flex-column mt-2 mx-2'>
                {formElements && formElements.map((form_item) => {
                    const isLocked = lockedElements[form_item.id];
                    const color = isLocked ? ' border-2 border-danger' : '';

                    if (form_item.input_type === 'text_label') {
                        return (
                            <p className={'fs-4' + color} key={form_item.id}>
                                {JSON.parse(form_item.form_item_value)[0]}
                            </p>
                        );
                    }

                    if (form_item.input_type === 'text_input') {
                        return (
                            <input
                                key={form_item.id}
                                className={'form-control' + color}
                                placeholder={JSON.parse(form_item.form_item_value)}
                                onFocus={() => handleFocus(form_item.id)}
                                onBlur={() => handleBlur(form_item.id)}
                                disabled={isLocked}
                            />
                        );
                    }

                    if (form_item.input_type === 'dropdown_input') {
                        return (
                            <select
                                className={'form-select' + color}
                                key={form_item.id}
                                onFocus={() => handleFocus(form_item.id)}
                                onBlur={() => handleBlur(form_item.id)}
                                disabled={isLocked}
                            >
                                {String(JSON.parse(form_item.form_item_value))
                                    .split(',')
                                    .map((value, idx) => (
                                        <option key={idx} value={value}>{value}</option>
                                    ))}
                            </select>
                        );
                    }

                    return null;
                })}
            </div>
        </div>
    );
}

export default UserDashboard;
