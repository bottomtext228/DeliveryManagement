import { Link, useLocation, useNavigate } from "react-router-dom";
import { setTokenToLocalStorage } from "../../helpers/localstorage.helper";
import { AuthState, useAuthState } from "../../hooks/useAuthState";
import { AuthService } from "../../services/AuthService";
import useUserStore from "../../store/user/userStore";
import { ILoginResponse } from "../../types/types";
import { useForm, SubmitHandler } from "react-hook-form";
import ServerError from "../../components/Error/ServerError";
import AlreadyLoggedIn from "./AlreadyLoggedIn";
import { CloseButton } from "../../components/Common/CloseButton";
import Button from "../../components/Common/Button";
import InputField from "../../components/Common/Form/InputField";
import InputPasswordField from "../../components/Common/Form/InputPasswordField";
import { useState } from "react";

interface FormValues {
    email: string
    password: string
};


export default function Login() {
    const [serverError, setServerError] = useState<unknown>(null);
    const navigate = useNavigate();
    const authState = useAuthState();
    const location = useLocation();


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
            navigate(location.state?.returnUrl ? location.state.returnUrl : '/', { replace: true });
        }
        catch (error) {
            setServerError(error);
        }
    }


    const loginHandler = async (data: FormValues) => {
        try {
            loginRequest(data);
        }
        catch (error) {
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
                    <Link className='w-4 h-4' to='/'>
                        <CloseButton />
                    </Link>
                </div>
                <div>
                    <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
                        <InputField id="email" label="Эл. адрес" type="email" error={errors.email} autoComplete="on"
                            {...register('email', { required: 'Почта не может быть пустой' })}
                        />
                        <InputPasswordField id="password" label="Пароль" error={errors.password} autoComplete="off"
                            {...register('password', {
                                required: 'Пароль не может быть пустым'
                            })}
                        />
                        <div className="pt-5">
                            <Button label="Войти" />
                        </div>
                    </form>
                </div>
            </div>
            <div className="w-full p-4 mx-auto my-4 text-center border border-gray-300 rounded-2xl">
                Нет аккаунта? <Link to='/auth/register' className="text-blue-600 hover:brightness-90 hover:underline">Создать</Link>
            </div>
        </div>
    </>)
}