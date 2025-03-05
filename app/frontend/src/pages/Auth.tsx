import { useState } from "react";
import { AuthService } from "../services/AuthService";
import { IHtppValidationProblemDetails, ILoginData, IUser } from "../types/types";
import { setTokenToLocalStorage } from "../helpers/localstorage.helper";
import userStore from "../store/user/userStore";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useForm, SubmitHandler } from "react-hook-form";
import useUserStore from "../store/user/userStore";
import AuthGeneral from "../components/AuthGeneral";

type FormValues = {
    email: string
    password: string
}

export default function Auth() {
    const [serverError, setServerError] = useState<IHtppValidationProblemDetails | null>(null);
    const navigate = useNavigate();
    const isAuth = useAuth();
    const location = useLocation();
    const [isLogin, setIsLogin] = useState(false/* location.state?.action !== 'register' */); // login is the default action, unless if we go here from the 'Sign up' button
    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isCompany, setIsCompany] = useState(false);
    const [isGeneral, setIsGeneral] = useState(false); 

    const login = useUserStore(state => state.login);
   
    const loginRequest = async ({ email, password }: FormValues) => {

        const data = await AuthService.login({ email, password });

        if (Object.prototype.hasOwnProperty.call(data, 'token')) {
            const loginData = data as ILoginData;
            setTokenToLocalStorage(loginData.token);
            login({ email: loginData.email } as IUser);
            navigate(location.state?.returnUrl ? location.state.returnUrl : '/');

        } else {
            const problemDetails = data as IHtppValidationProblemDetails;
            setServerError(problemDetails);
        }
    }
    const registrationHandler = async ({ email, password }: FormValues) => {
        try {
            const data = await AuthService.registration({ email, password });

            if (Object.prototype.hasOwnProperty.call(data, 'token')) {
                const loginData = data as ILoginData;
                setTokenToLocalStorage(loginData.token);
                login({ email: loginData.email } as IUser);
                navigate(location.state?.returnUrl ? location.state.returnUrl : '/');
            } else {
                const problemDetails = data as IHtppValidationProblemDetails;
                setServerError(problemDetails);
            }

        }
        catch (error: any) {
            console.error(error);
        }

    }

    const loginHandler = async (data: FormValues) => {
        try {
            loginRequest(data);
        }
        catch (error: any) {
            console.error(error);
        }
    }



    if (isAuth) {
        return <div className="text-center border rounded p-4 bg-neutral-600">
            <div>
                <div className="text-white">You already logged in.</div>
                <Link className="text-blue-400 hover:underline" to='/'>Home page</Link>
            </div>
        </div>
    }

    const onSubmit: SubmitHandler<FormValues> = (data, e) => {
        e?.preventDefault();
        isLogin ? loginHandler(data) : registrationHandler(data);
    }


    return (<>
        
        
        <AuthGeneral handleSubmit={handleSubmit(onSubmit)}></AuthGeneral>

    </>)
    return <div className="w-72">
        {serverError ?
            <div className="border border-white rounded h-fit p-4 text-white bg-neutral-600 my-4">
                {serverError.status === 401 ? /** Unauthorized - wrong password/username*/
                    <div>
                        Incorrect username or password.
                    </div> : /** Bad Request - validation errors*/
                    <div>
                        {serverError.errors && Object.values(serverError.errors).map(e => <li>{e[0]}</li>)}
                    </div>}
            </div> : <></>}
        <div className="border border-white rounded p-4 h-54 bg-neutral-600">
            <div className="text-white">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <label htmlFor="email">Email</label>
                    <input id="email" className="bg-white w-full my-1 rounded outline-none text-black p-1" {...register('email', { required: 'Email is required' })} />
                    {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                    <label htmlFor="password">Password</label>
                    <div className="flex">
                        <input type={isPasswordVisible ? "text" : "password"} id="password" className="bg-white w-full my-1 rounded outline-none text-black p-1 pr-10" {...register('password', {
                            required: 'Password is required', minLength: {
                                value: 6,
                                message: 'Password must be at least 6 characters.'
                            }/* ,
                            pattern: {
                                value: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).+$/,
                                message: 'Password must contain at least one lowercase character, at least one uppercase character, at least one non alphanumeric characher.'
                            } */
                        })} />
                        <button type='button' className="flex items-center justify-around group" onClick={() => { setIsPasswordVisible(!isPasswordVisible) }}>
                            <img className="absolute mr-10 w-6 h-6 filter opacity-30 hover:opacity-85" src={isPasswordVisible ? '/eye-on.svg' : '/eye-off.svg'}></img>
                            <div className="absolute mr-10 -mt-14 p-1 rounded border bg-neutral-800 transition-opacity opacity-0 group-hover:opacity-100">Show password</div>
                        </button>
                    </div>
                    {errors.password && <div className="text-red-500">{errors.password.message}</div>}
                    <button type="submit" className="w-full rounded mt-4 bg-green-500 hover:bg-green-600 h-10">{isLogin ? "Login" : "Register"}</button>
                </form>
            </div>
        </div>
        <div className="border border-white rounded my-4 h-16 flex justify-center items-center text-center bg-neutral-600 text-white">
            {
                isLogin ?
                    <div>
                        <div>New here?</div>
                        <button className="text-blue-400 hover:underline" onClick={() => { setIsLogin(false); setServerError(null) }}>Create an account</button>
                    </div> :
                    <div>
                        <div>Already have an account?</div>
                        <button className="text-blue-400 hover:underline" onClick={() => { setIsLogin(true); setServerError(null) }}>Login to account</button>
                    </div>
            }
        </div>
    </div>
}