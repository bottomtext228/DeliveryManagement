import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { setTokenToLocalStorage } from "../../helpers/localstorage.helper";
import { AuthState, useAuthState } from "../../hooks/useAuth";
import { AuthService } from "../../services/AuthService";
import useUserStore from "../../store/user/userStore";
import { IHtppValidationProblemDetails, ILoginResponse, IUser } from "../../types/types";
import { useForm, SubmitHandler } from "react-hook-form";


interface FormValues {
    email: string
    password: string
};


export default function Login() {
    const [serverError, setServerError] = useState<IHtppValidationProblemDetails | null>(null);
    const navigate = useNavigate();
    const authState = useAuthState();
    const location = useLocation();
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);


    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();

    const onSubmit: SubmitHandler<FormValues> = (data, e) => {
        e?.preventDefault();
        loginHandler(data);
    }



    const login = useUserStore(state => state.login);

    const loginRequest = async ({ email, password }: FormValues) => {

        const data = await AuthService.login({ email, password });

        if (Object.prototype.hasOwnProperty.call(data, 'token')) {
            const loginData = data as ILoginResponse;
            setTokenToLocalStorage(loginData.token);
            login(loginData as IUser);
            navigate(location.state?.returnUrl ? location.state.returnUrl : '/');

        } else {
            const problemDetails = data as IHtppValidationProblemDetails;
            setServerError(problemDetails);
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



    if (authState == AuthState.AUTHORIZED) {
        return <div className="text-center border rounded p-4 bg-neutral-600">
            <div>
                <div className="text-white">You already logged in.</div>
                <Link className="text-blue-400 hover:underline" to='/'>Home page</Link>
            </div>
        </div>
    }

    return (<>
        <div className="my-16 max-w-md w-[90%] mx-auto">
            {serverError ?
                <div className="border border-gray-300 rounded-2xl shadow-md h-fit p-4 text-black my-4">
                    {serverError.status === 401 ? /** Unauthorized - wrong password/username*/
                        <div>
                            <li>Неправильная почта и/или пароль</li>
                        </div> : /** Bad Request - validation errors*/
                        <div>
                            {serverError.errors && Object.keys(serverError.errors).map(key => <li key={key}>{(serverError.errors as any)[key]}</li>)}
                        </div>}
                </div> : <></>}
            <div className="rounded-2xl shadow-xl h-fit border border-gray-300 p-6">
                <div className="flex justify-between items-center">
                    <h3 className="text-neutral-800 text-2xl font-bold">Войти в Terrapin</h3>
                    <Link className='w-4 h-4' to='/'><img className='opacity-50 transient-colors duration-150 hover:opacity-70' src="/cross.svg"></img></Link>
                </div>
                <div>
                    <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
                        <div className="relative mt-4">
                            <input id="email" className="block w-full h-14.5 outline-none border border-gray-300 focus:outline-none focus:ring-4 focus:border-blue-400 duration-150 focus:ring-blue-200 rounded-lg p-3 pt-6.5 pb-2.5 peer" {...register('email', { required: 'Почта не может быть пустой' })} placeholder=" " />
                            <label htmlFor="email" className="absolute pointer-events-none text-md text-black duration-100 peer-placeholder-shown:opacity-100 peer-focus:opacity-70 opacity-70 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">
                                Эл. адрес
                            </label>
                        </div>
                        {errors.email && <div className="text-red-500">{errors.email.message}</div>}
                        <div className="flex relative mt-4">
                            <input type={isPasswordVisible ? "text" : "password"} id="password" placeholder=" " className="block w-full h-14.5 outline-none border border-gray-300 focus:outline-none focus:ring-4 focus:border-blue-400 duration-150 focus:ring-blue-200 rounded-lg p-3 pt-6.5 pb-2.5 peer" {...register('password', {
                                required: 'Пароль не может быть пустым'
                            })} />
                            <button type='button' className="absolute right-2 top-1/2 -translate-y-1/2 w-6 flex items-center justify-around group" onClick={() => { setIsPasswordVisible(!isPasswordVisible) }}>
                                <img className="w-6 h-6 filter opacity-30 hover:opacity-85" src={isPasswordVisible ? '/eye-on.svg' : '/eye-off.svg'}></img>
                                <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-sm rounded py-1 px-2 whitespace-nowrap">
                                    Показать пароль
                                </span>
                            </button>
                            <label htmlFor="password" className="absolute pointer-events-none text-md text-black duration-100 peer-placeholder-shown:opacity-100 peer-focus:opacity-70 opacity-70 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">
                                Пароль
                            </label>
                        </div>
                        {errors.password && <div className="text-red-500">{errors.password.message}</div>}
                        <button type='submit' className="rounded-lg bg-amber-400 hover:bg-amber-500 text-white text-xl mt-5 p-2">Войти</button>
                    </form>
                </div>
            </div >
        </div>
    </>)
}