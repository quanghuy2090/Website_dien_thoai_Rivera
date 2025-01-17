import React, { useEffect, useState } from "react";
import { auth } from "../../firebase";
import { sendSignInLinkToEmail } from 'firebase/auth';
import { toast } from "react-toastify";

const RegisterComplete = ({ history }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        setEmail(window.localStorage.getItem('emailRegister'));
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await sendSignInLinkToEmail(auth, email);
        }
        catch {

        }
    };

    const completeRegisterform = () => (<form onSubmit={handleSubmit}>
        <input type="email" className="form-control" value={email} disabled />
        <input
            type="password"
            className="form-control" value={password}
            onChange={e => setPassword(e.target.value)}
            autoFocus
            placeholder="Password"
        />
        <button type="submit" className="btn shadow mt-2">Complete Register</button>
    </form>)

    return (
        <div className="conatiner p-5" >
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <h4>Register Complete</h4>
                    {completeRegisterform()}
                </div>
            </div>
        </div>
    )
}

export default RegisterComplete