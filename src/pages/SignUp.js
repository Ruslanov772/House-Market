import React, {useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import {ReactComponent as ArrowRightIcon} from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from '../assets/svg/visibilityIcon.svg';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { db } from "../firebase.config";
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-toastify'
import Oauth from "../components/Oauth/Oauth";

const SignUp = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        password: '',
    });

    const { name, email, password} = formData;
    const navigate = useNavigate();

    const onChange = (e) => {
        setFormData(prevState => ({
            ...prevState,
            [e.target.id]: e.target.value,
        }))
    }

    const onSubmit = async e => {
        e.preventDefault()
        try{
            const auth = getAuth();
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            updateProfile(auth.currentUser, {
                displayName: name,

            });
            const formDataCopy = {...formData};
            delete formDataCopy.password;
            formDataCopy.timestamp = serverTimestamp();
            await setDoc(doc(db, 'users', user.uid), formDataCopy);
            navigate('/')
        } catch (error) {
            toast.error("Error")
        }
    }

    return (
        <>
            <div className={'pageContainer'}>
                <header>
                    <p className={'pageHeader'}>Welcome Back!</p>
                </header>
                <main>
                    <form onSubmit={onSubmit}>
                        <input
                            onChange={onChange}
                            value={name}
                            id={'name'}
                            placeholder={'name'}
                            className={'nameInput'}
                            type="text"/>
                        <input
                            onChange={onChange}
                            value={email}
                            id={'email'}
                            placeholder={'Email'}
                            className={'emailInput'}
                            type="email"/>
                        <div className={'passwordInputDiv'}>
                            <input
                                onChange={onChange}
                                value={password}
                                placeholder={'password'}
                                id={'password'}
                                className={'passwordInput'}
                                type={showPassword ? 'text' : 'password'}/>
                            <img
                                onClick={ () => setShowPassword(prevState => !prevState)}
                                src={visibilityIcon}
                                alt="show Password"
                                className={'showPassword'}/>
                        </div>
                        <div className={'signUpBar'}>
                            <p className={'signUpText'}>Sign Up</p>
                            <button className={'signUpButton'}>
                                <ArrowRightIcon fill='#ffffff' width={'34px'} heigth={'34px'} />
                            </button>
                        </div>
                    </form>
                    <Oauth/>
                    <Link to={'/sign-up'} className={'registerLink'} >
                        Sign in installed
                    </Link>
                </main>
            </div>
        </>
    );
};

export default SignUp;