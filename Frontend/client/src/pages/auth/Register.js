import React, { useState } from "react";
import { auth } from "../../firebase";
import { sendSignInLinkToEmail } from 'firebase/auth';
import { toast } from "react-toastify";

const Register = () => {
    const [email, setEmail] = useState('')
    const handleSubmit = async (e) => {
        e.preventDefault();
        const config = {
            url: process.env.REACT_APP_REGISTER_REDIRECT_URL,
            handleCodeInApp: true,
        };

        await sendSignInLinkToEmail(auth, email, config);
        toast.success(`Email is sent to ${email}. Click to complete registration`);
        //save email to local storage
        window.localStorage.setItem('emailRegister', email)
        //clear state
        setEmail('');
    };

    const registerform = () => (<form onSubmit={handleSubmit}>
        <input
            type="email"
            className="form-control"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoFocus
        />
        <button type="submit" className="btn shadow mt-2">Register</button>
    </form>)

    return (
        <div className="conatiner p-5" >
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <h4>Register</h4>
                    {registerform()}
                </div>
            </div>
        </div>
    )
}

export default Register