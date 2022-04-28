import {useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from '../assets/svg/visibilityIcon.svg';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import {toast} from "react-toastify";
import Oauth from "../components/Oauth/Oauth";

const SignIn = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const {email, password} = formData;
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
            const auth = getAuth()
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            if (userCredential.user) {
                navigate('/')
            }
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
                    <Link to={'/forgot-password'} className={'forgotPasswordLink'} >
                        Forgot Password
                    </Link>
                    <div className={'signInBar'}>
                        <p className={'signInText'}>Sign In</p>
                        <button className={'signInButton'}>
                            <ArrowRightIcon fill='#ffffff' width={'34px'} heigth={'34px'} />
                        </button>
                    </div>
                </form>
                <Oauth />
                <Link to={'/sign-up'} className={'registerLink'} >
                    Sign Up
                </Link>
            </main>
        </div>
       </>
    );
};

export default SignIn;