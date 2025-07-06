import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { setTokenToLocalStorage } from "../../helpers/localstorage.helper";
import { AuthState, useAuthState } from "../../hooks/useAuthState";
import { AuthService } from "../../services/AuthService";
import useUserStore from "../../store/user/userStore";
import { ILoginResponse } from "../../types/types";
import { useForm, SubmitHandler } from "react-hook-form";
import ServerError from "../../components/Error/ServerError";
import AlreadyLoggedIn from "./AlreadyLoggedIn";

interface FormValues {
    email: string
    password: string
};


export default function Login() {
    const [serverError, setServerError] = useState<unknown>(null);
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

        try {
            const response = await AuthService.login({ email, password });

            const loginData = response.data as ILoginResponse;
            setTokenToLocalStorage(loginData.token);
            login(loginData.user);
            navigate(location.state?.returnUrl ? location.state.returnUrl : '/');
        }
        catch (error) {
            setServerError(error);
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

    if (authState == AuthState.AUTHORIZED) return <AlreadyLoggedIn />

    return (<>
        <div className="my-4 md:my-16 max-w-md w-[90%] mx-auto">
            {serverError !== null && <ServerError error={serverError} />}
            <div className="p-6 border border-gray-300 shadow-xl rounded-2xl h-fit">
                <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-neutral-800">Войти в Terrapin</h3>
                    <Link className='w-4 h-4' to='/'><img className='duration-150 opacity-50 transient-colors hover:opacity-70' src="/cross.svg"></img></Link>
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
                        <div className="relative flex mt-4">
                            <input type={isPasswordVisible ? "text" : "password"} id="password" placeholder=" " className="block w-full h-14.5 outline-none border border-gray-300 focus:outline-none focus:ring-4 focus:border-blue-400 duration-150 focus:ring-blue-200 rounded-lg p-3 pt-6.5 pb-2.5 peer" {...register('password', {
                                required: 'Пароль не может быть пустым'
                            })} />
                            <button type='button' className="absolute flex items-center justify-around w-6 -translate-y-1/2 right-2 top-1/2 group" onClick={() => { setIsPasswordVisible(!isPasswordVisible) }}>
                                <img className="w-6 h-6 filter opacity-30 hover:opacity-85" src={isPasswordVisible ? '/eye-on.svg' : '/eye-off.svg'}></img>
                                <span className="absolute px-2 py-1 mb-1 text-sm text-white transition-opacity -translate-x-1/2 bg-gray-800 rounded opacity-0 left-1/2 bottom-full group-hover:opacity-100 whitespace-nowrap">
                                    Показать пароль
                                </span>
                            </button>
                            <label htmlFor="password" className="absolute pointer-events-none text-md text-black duration-100 peer-placeholder-shown:opacity-100 peer-focus:opacity-70 opacity-70 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">
                                Пароль
                            </label>
                        </div>
                        {errors.password && <div className="text-red-500">{errors.password.message}</div>}
                        <button type='submit' className="p-2 mt-5 text-xl text-white rounded-lg bg-amber-400 hover:bg-amber-500">Войти</button>
                    </form>
                </div>
            </div>
            <div className="w-full p-4 mx-auto my-4 text-center border border-gray-300 rounded-2xl">
                Нет аккаунта? <Link to='/auth/register' className="text-blue-600 hover:brightness-90 hover:underline">Создать</Link>
            </div>
        </div>
    </>)
}