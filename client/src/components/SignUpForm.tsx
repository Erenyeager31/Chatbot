import { useState } from 'react'
import logo from '../assets/logo/logo.svg'
import { Link, useNavigate } from 'react-router-dom'
import { emailValidity } from '../utils/Formvalidation';
import { useUserSignupMutation } from '../../redux/slices/authSlice';

interface credentials {
    email: string;
    username: string;
    password: string;
}

interface Response{
    data:{
        status:boolean;
        message:string;
    }
}

export default function SignUpForm() {
    const navigate = useNavigate()
    const [userSignup] = useUserSignupMutation();

    const imgClass = 'w-[75px] h-[75px]'
    const titleClass = 'w-full font-semibold text-[42px] text-title'
    const inputClass = 'w-[387px] h-[60px] border-none outline-none bg-inputBG rounded-[8px] mt-[20px] px-[10px] text-[white] placeholder-[#ffffff9a]'
    const buttonClass = 'w-[387px] h-[60px] border-none outline-none bg-secondaryBG rounded-[8px] mt-[20px] tracking-wider font-semibold text-[white] placeholder-[#ffffff9a]'
    const formClass = 'flex flex-col mt-[40px]'

    //? state management
    const [credentials, setCredentials] = useState<credentials>({
        email: '',
        username: '',
        password: ''
    })

    const handleSubmit = async () => {
        console.log(credentials)
        const emailStatus = await emailValidity(credentials.email)
        if (!emailStatus) {
            alert('Invalid Email')
            return;
        }
        if (credentials.password.length < 8) {
            alert('Password length does not match the criteria')
            return;
        }

        const response = await userSignup(credentials)

        const {status,message} = (response as Response)?.data

        if(status){
            alert(message)
            navigate('/')
        }else{
            alert(message)
        }

    }

    return (
        <div className='h-fit flex flex-col justify-between items-center'>
            <img className={imgClass} src={logo} alt="" />
            <p className={titleClass}>Hey There ! Let’s Create your account</p>
            <form action="" className={formClass}>
                <input type="text" className={inputClass} placeholder='Email Address' name='email' value={credentials.email} required
                    onChange={(e) => { setCredentials({ ...credentials, email: e.target.value }) }} />
                <input type="text" className={inputClass} placeholder='Username' name='username' value={credentials.username} required
                    onChange={(e) => { setCredentials({ ...credentials, username: e.target.value }) }} />

                <input type="password" className={inputClass} placeholder='Password' name='password' value={credentials.password} required
                    onChange={(e) => { setCredentials({ ...credentials, password: e.target.value }) }}
                />

                <button type='button' className={buttonClass} onClick={handleSubmit}>
                    Sign-up
                </button>
                <p className='w-full flex justify-center mt-[20px] text-white'>
                    Already have an account?
                    &nbsp;
                    <Link to='/login' className='text-secondaryBG cursor-pointer'
                    >Login</Link>
                </p>
            </form>
        </div>
    )
}
