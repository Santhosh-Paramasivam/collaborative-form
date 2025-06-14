import './Register.css'
import { useState } from 'react'
import axios from 'axios'

function Register() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('admin')
    const serverUrl = import.meta.env.VITE_serverUrl

    function register() {
        console.log(role)

        if (!username.trim() || !password.trim()) {
            alert("Username and password cannot be empty")
        }
        else if (username.length < 8 || password.length < 8) {
            alert("Username and password cannot be less than eight characters")
        }

        console.log(serverUrl)
        axios.post(`${serverUrl}/register`, {
            "username": username,
            "password": password
        }, {
            "Content-Type": "application/json"
        })
            .then((data) => { console.log(data) })
            .catch((error) => console.log(error))
    }

    return <div className="container-fluid" id="main-page">
        <div className='d-flex align-items-center justify-content-center'>
            <div className='card' style={{ width: "300px" }}>
                <h2 className='card-title px-3 pt-3'>Registration</h2>
                <div className='card-body'>
                    <p className='card-text fs-5'>Register as an admin to create forms or a user to fill them out</p>
                    <input className='form-control mb-3' type='text' placeholder='Username' value={username} onChange={(e) => { setUsername(e.target.value) }}></input>
                    <input className='form-control mb-3' type='password' placeholder='Password' value={password} onChange={(e) => { setPassword(e.target.value) }}></input>
                    <select className='form-select mb-3' value={role} onChange={(e) => { setRole(e.target.value) }}>
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                    </select>
                    <button className='btn btn-dark' onClick={register}>Register</button>
                </div>
            </div>
        </div>
    </div>
}

export default Register