import React, { useEffect, useState } from 'react'
import { deleteUser, getUser, User } from '../../../services/auth'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { MdDelete } from "react-icons/md";
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

    const removeUser = async (_id: string) => {
        try {
            const isConfirmed = window.confirm("Are you sure you want to remove");
            if (isConfirmed) {
                setUser((prevUser) => prevUser.filter((user) => user._id !== _id));
                await deleteUser(_id);
                toast.success("User deleted successfully");
            }
        } catch (error) {
            console.log(error);
            toast.error("Error deleting user");
        }
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
                                <button className='btn btn-danger' onClick={() => removeUser(u._id)}> <MdDelete /></button>
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