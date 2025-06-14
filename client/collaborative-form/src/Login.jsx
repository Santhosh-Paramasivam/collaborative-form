import './Register.css'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'

function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('admin')
    const navigate = useNavigate()
    const serverUrl = import.meta.env.VITE_serverUrl

    function login() {
        console.log(role)

        if (!username.trim() || !password.trim()) {
            alert("Username and password cannot be empty")
        }
        else if (username.length < 8 || password.length < 8) {
            alert("Username and password cannot be less than eight characters")
        }

        console.log(serverUrl)
        axios.post(`${serverUrl}/login`, {
            "username": username,
            "password": password,
            "role": role
        }, {
            "Content-Type": "application/json"
        })
            .then((data) => {
                console.log(data)
                alert(`${Object.entries(data.data)[0]}`)
                let jwtToken = data.data.token
                console.log(jwtToken)
                sessionStorage.setItem('jwtToken', jwtToken);
                navigate(`/${role}_dashboard`)
            })
            .catch((error) => console.log(error))
    }

    return <div className="container-fluid" id="main-page">
        <div className='d-flex align-items-center justify-content-center'>
            <div className='card' style={{ width: "460px" }}>
                <h2 className='card-title px-3 pt-3'>Login</h2>
                <div className='card-body'>
                    <p className='card-text fs-5'>Login as an admin to create forms or a user to fill them out</p>
                    <input className='form-control mb-3' type='text' placeholder='Username' value={username} onChange={(e) => { setUsername(e.target.value) }}></input>
                    <input className='form-control mb-3' type='password' placeholder='Password' value={password} onChange={(e) => { setPassword(e.target.value) }}></input>
                    <select className='form-select mb-3' value={role} onChange={(e) => { setRole(e.target.value) }}>
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                    </select>
                    <button className='btn btn-dark' onClick={login}>Login</button>
                </div>
            </div>
        </div>
    </div>
}

export default Login