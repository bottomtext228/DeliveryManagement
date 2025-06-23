import { useState } from "react";
import { AuthService } from "../../services/AuthService";
import { ILoginResponse } from "../../types/types";
import { setTokenToLocalStorage } from "../../helpers/localstorage.helper";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthState, useAuthState } from "../../hooks/useAuthState";
import useUserStore from "../../store/user/userStore";
import RegisterFormGeneral from "../../components/Register/RegisterFormGeneral";
import RegisterFormCompany from "../../components/Register/RegisterFormCompany";
import ServerError, { IServerError } from "../../components/ServerError";
import AlreadyLoggedIn from "./AlreadyLoggedIn";

interface FormValues {
    email: string
    password: string,
    companyName: string,
    companyDescription: string
};

interface RegistrationData {
    email: string
    password: string,
    asCompany: boolean,
    companyName: string,
    companyDescription: string
};

enum FormState {
    GENERAL = 0,
    COMPANY = 1
};

export default function Register() {
    const [serverError, setServerError] = useState<IServerError | null>(null);
    const navigate = useNavigate();
    const authState = useAuthState();
    const location = useLocation();
    const [isCompany, setIsCompany] = useState(location.state?.choice === 'company');
    const [formState, setFormState] = useState(FormState.GENERAL);
    const [formData, setFormData] = useState<FormValues>({
        email: "",
        password: "",
        companyName: "",
        companyDescription: ""
    });


    const login = useUserStore(state => state.login);



    const registrationHandler = async (data: RegistrationData) => {
        try {
            const response = await AuthService.registration(data);

            const loginData = response.data as ILoginResponse;
            setTokenToLocalStorage(loginData.token);
            login(loginData.user);
            navigate(location.state?.returnUrl ? location.state.returnUrl : '/');
        }
        catch (error: any) {
            setServerError(error);
        }

    }


    if (authState == AuthState.AUTHORIZED) return <AlreadyLoggedIn></AlreadyLoggedIn>

    const handleGeneralSubmit = async (data: FormValues) => {
        if (isCompany) {
            try {
                const response = await AuthService.checkEmail(data.email);
                if (response.data.available) {
                    setFormState(FormState.COMPANY);
                    setServerError(null);
                } else {
                    setServerError(response.data.message);
                }
            } catch (error: any) {
                console.error(error);
            }
        } else {
            registrationHandler({ ...data, asCompany: false });
        }
    }

    const handleChangeIsCompany = (isCompany: boolean) => {
        setIsCompany(isCompany);
    }

    const handleCompanySubmit = (data: FormValues) => {
        registrationHandler({ ...data, asCompany: true });
    }

    const handleGoBack = () => {
        setFormState(FormState.GENERAL);
    }

    return (<>
        <div className="my-4 md:my-16 max-w-md w-[90%] mx-auto">
            {serverError ?
                <div className="p-4 my-4 text-black border border-gray-300 shadow-md rounded-2xl h-fit">
                    <ServerError error={serverError}></ServerError>
                </div> : <></>}
            {formState == FormState.GENERAL ?
                <>
                    <RegisterFormGeneral handleGeneralSubmit={handleGeneralSubmit} isCompany={isCompany} handleChangeIsCompany={handleChangeIsCompany} formData={formData} setFormData={setFormData}></RegisterFormGeneral>
                    <div className="w-full p-4 mx-auto my-4 text-center border border-gray-300 rounded-2xl">
                        Уже есть аккаунт? <Link to='/auth/login' className="text-blue-600 hover:brightness-90 hover:underline">Войти</Link>
                    </div>
                </>
                : <RegisterFormCompany handleCompanySubmit={handleCompanySubmit} handleGoBack={handleGoBack} formData={formData} setFormData={setFormData} ></RegisterFormCompany>
            }
        </div>
    </>)
}