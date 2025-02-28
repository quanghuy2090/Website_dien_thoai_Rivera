import React, { useEffect, useState } from 'react'
import { getUser, User } from '../../../services/auth'

import { Link } from 'react-router-dom'

import { FaEye } from "react-icons/fa";
const ListUser = () => {
    const [user, setUser] = useState<User[]>([])

    console.log(user)
    useEffect(() => {
        (async () => {
            fetchUsers();
        })()
    }, [])
    const fetchUsers = async () => {
        const res = await getUser();
        setUser(res.data.data);
    }


    return (
        <div className='col-md-10 ms-sm-auto px-md-4 mt-4 '>

            <table className="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th scope="col">id</th>
                        <th scope="col">username</th>
                        <th scope="col">email</th>
                        <th scope="col">address</th>
                        <th scope="col">phone</th>
                        <th scope="col">role</th>
                        <th scope="col">action</th>


                    </tr>
                </thead>
                <tbody>
                    {user.map((u) => (
                        <tr>
                            <td>{u._id}</td>
                            <td>{u.userName}</td>
                            <td>{u.email}</td>
                            <td>{u.address}</td>
                            <td>{u.phone}</td>
                            <td>{u.role}</td>
                            <td>
                               
                                <Link to={`/admin/user/${u._id}`} className='btn btn-warning'><FaEye /></Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default ListUser