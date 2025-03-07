import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { setTokenToLocalStorage } from "../../helpers/localstorage.helper";
import { useAuth } from "../../hooks/useAuth";
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
    const isAuth = useAuth();
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
            login({ email: loginData.email } as IUser);
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



    if (isAuth) {
        return <div className="text-center border rounded p-4 bg-neutral-600">
            <div>
                <div className="text-white">You already logged in.</div>
                <Link className="text-blue-400 hover:underline" to='/'>Home page</Link>
            </div>
        </div>
    }


    return (<>

        {serverError ?
            <div className="border border-gray-300 rounded-2xl shadow-md h-fit p-4 text-black my-4">
                {serverError.status === 401 ? /** Unauthorized - wrong password/username*/
                    <div>
                        Неправильная почта и/или пароль
                    </div> : /** Bad Request - validation errors*/
                    <div>
                        {serverError.errors && Object.values(serverError.errors).map(e => <li>{e[0]}</li>)}
                    </div>}
            </div> : <></>}
        <div className="w-md mx-auto">


            <div className="my-16 rounded-2xl shadow-xl h-116 border border-gray-300 p-6">
                <div>
                    <h3 className="text-neutral-800 text-2xl font-bold">Войти в Terrapin</h3>
                    <button></button>
                </div>
                <div>
                    <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
                        <label>Эл. адрес</label>
                        <input id="email" className="outline-none border border-gray-300 rounded-lg mt-4 p-3" {...register('email', { required: 'Почта не может быть пустой' })} />
                        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                        <label>Пароль</label>
                        <div className="flex relative mt-4">
                            <input type={isPasswordVisible ? "text" : "password"} id="password" className="w-full outline-none border border-gray-300 rounded-lg p-3 pr-10" {...register('password', {
                                required: 'Пароль не может быть пустым'
                            })} />
                            <button type='button' className="absolute right-2 top-1/2 -translate-y-1/2 w-6 flex items-center justify-around group" onClick={() => { setIsPasswordVisible(!isPasswordVisible) }}>
                                <img className="w-6 h-6 filter opacity-30 hover:opacity-85" src={isPasswordVisible ? '/eye-on.svg' : '/eye-off.svg'}></img>
                                <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-sm rounded py-1 px-2 whitespace-nowrap">
                                    Показать пароль
                                </span>
                            </button>
                        </div>
                        {errors.password && <div className="text-red-500">{errors.password.message}</div>}
                        <button type='submit' className="rounded-lg bg-amber-400 hover:bg-amber-500 text-white text-xl mt-3 p-2">Войти</button>
                        <div>
                            Нет аккаунта?<Link to='/auth/register' className="hover:text-blue-700 hover:underline">Зарегистрироваться</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </>)
}