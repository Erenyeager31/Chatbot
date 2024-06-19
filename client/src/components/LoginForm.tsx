import { useState } from 'react'
import logo from '../assets/logo/logo.svg'
import { Link, useNavigate } from 'react-router-dom'
import { emailValidity } from '../utils/Formvalidation';
import { useUserLoginMutation } from '../../redux/slices/authSlice';
import { base_url } from '../utils/utils';

interface credentials {
    email: string;
    password: string;
}

interface Response {
    data?: {
        status?: boolean;
        message?: string;
    };
}

export default function LoginForm() {
    const [userLogin] = useUserLoginMutation();
    const navigate = useNavigate()

    //! tailwind classes
    const imgClass = 'w-[75px] h-[75px]'
    const titleClass = 'font-semibold text-[48px] text-title'
    const inputClass = 'w-[387px] h-[60px] border-none outline-none bg-inputBG rounded-[8px] mt-[20px] px-[10px] text-[white] placeholder-[#ffffff9a]'
    const buttonClass = 'w-[387px] h-[60px] border-none outline-none bg-secondaryBG rounded-[8px] mt-[20px] tracking-wider font-semibold text-[white] placeholder-[#ffffff9a]'
    const formClass = 'flex flex-col mt-[40px]'

    //? state management
    const [credentials, setCredentials] = useState<credentials>({
        email: '',
        password: ''
    })

    const handleSubmit = async () => {
        let status: boolean | undefined = undefined
        let message: string | undefined = undefined

        const emailStatus = await emailValidity(credentials.email)
        if (!emailStatus) {
            alert('Invalid Email')
            return;
        }
        if (credentials.password.length < 8) {
            alert('Password length does not match the criteria')
            return;
        }

        // const response = await fetch(`${base_url}/auth/login`,{
        //     method:'POST',
        //     credentials:'include',
        //     headers:{
        //         'Content-Type':'application/json',
        //     },
        //     body:JSON.stringify(credentials)
        // })

        // const data = await response.json()
        // console.log(data)

        const response = await userLogin(credentials)

        if(response?.data){
            ({status,message} = response?.data)
        }

        if (status) {
            alert(message)
            navigate('/chat')
        } else {
            alert(message)
        }
    }

    return (
        <div className='w-[387px] h-fit flex flex-col justify-between items-center'>
            <img className={imgClass} src={logo} alt="" />
            <p className={titleClass}>Welcome Back</p>
            <form action="" className={formClass}>
                <input type="text" className={inputClass} placeholder='Email Address' name='email' value={credentials.email} required
                    onChange={(e) => { setCredentials({ ...credentials, email: e.target.value }) }} />
                <input type="password" className={inputClass} placeholder='Password' name='password' value={credentials.password} required
                    onChange={(e) => { setCredentials({ ...credentials, password: e.target.value }) }}
                />
                <button type='button' className={buttonClass} onClick={handleSubmit}>
                    Login
                </button>
                <p className='w-full flex justify-center mt-[20px] text-white'>
                    Don't have an account?
                    &nbsp;
                    <Link to='/signup' className='text-secondaryBG cursor-pointer'>Sign Up</Link>
                </p>
            </form>
        </div>
    )
}
