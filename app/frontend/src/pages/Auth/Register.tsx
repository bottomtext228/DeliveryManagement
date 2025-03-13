import { useState } from "react";
import { AuthService } from "../../services/AuthService";
import { IHtppValidationProblemDetails, ILoginResponse, IUser } from "../../types/types";
import { setTokenToLocalStorage } from "../../helpers/localstorage.helper";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import useUserStore from "../../store/user/userStore";
import RegisterFormGeneral from "../../components/Register/RegisterFormGeneral";
import RegisterFormCompany from "../../components/Register/RegisterFormCompany";

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
    const [serverError, setServerError] = useState<IHtppValidationProblemDetails | null>(null);
    const navigate = useNavigate();
    const isAuth = useAuth();
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

            if (Object.prototype.hasOwnProperty.call(response, 'token')) {
                const loginData = response as ILoginResponse;
                setTokenToLocalStorage(loginData.token);
                login({ email: loginData.email } as IUser);
                navigate(location.state?.returnUrl ? location.state.returnUrl : '/');
            } else {
                const problemDetails = response as IHtppValidationProblemDetails;
                setServerError(problemDetails);
            }

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

    const handleGeneralSubmit = async (data: FormValues) => {
        if (isCompany) {
            try {
                let response = await AuthService.checkEmail(data.email);
                if (response.data.available) {
                    setFormState(FormState.COMPANY);
                    setServerError(null);
                } else {
                    setServerError({ errors: { Email: response.data.message } });
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
        <div className="my-16 w-md mx-auto">
            {serverError ?
                <div className="border border-gray-300 rounded-2xl shadow-md h-fit p-4 text-black my-4">
                    {serverError.status === 401 ? /** Unauthorized - wrong password/username*/
                        <div>
                            Неправильная почта и/или пароль
                        </div> : /** Bad Request - validation errors*/
                        <div>
                            {serverError.errors && Object.keys(serverError.errors).map(key => <li key={key}>{(serverError.errors as any)[key]}</li>)}
                        </div>}
                </div> : <></>}
            {formState == FormState.GENERAL ?
                <RegisterFormGeneral handleGeneralSubmit={handleGeneralSubmit} isCompany={isCompany} handleChangeIsCompany={handleChangeIsCompany} formData={formData} setFormData={setFormData}></RegisterFormGeneral>
                : <RegisterFormCompany handleCompanySubmit={handleCompanySubmit} handleGoBack={handleGoBack} formData={formData} setFormData={setFormData} ></RegisterFormCompany>
            }
        </div>
    </>)
}