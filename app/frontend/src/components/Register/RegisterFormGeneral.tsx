import { useState } from 'react'
import { IHtppValidationProblemDetails } from '../../types/types';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

interface Props {
    handleGeneralSubmit: (e: FormValues) => void,
    isCompany: boolean,
    handleChangeIsCompany: (isCompany: boolean) => void,
    setFormData: (data: FormValues) => void,
    formData: FormValues
}

interface FormValues {
    email: string
    password: string,
    companyName: string,
    companyDescription: string
};



export default function RegisterFormGeneral({ handleGeneralSubmit, isCompany, handleChangeIsCompany, formData, setFormData }: Props) {
    const [serverError, setServerError] = useState<IHtppValidationProblemDetails | null>(null);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({ defaultValues: formData });
    const navigate = useNavigate();
    const onSubmit: SubmitHandler<FormValues> = (data, e) => {
        e?.preventDefault();
        setFormData({ ...formData, ...data });
        handleGeneralSubmit(data);
    }


    return (
        <div className="w-md mx-auto">

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
            <div className="my-16 rounded-2xl shadow-xl h-fit border border-gray-300 p-6">
                <div className='flex justify-between items-center mb-6'>
                    <h3 className="text-neutral-800 text-2xl font-bold">Зарегистрируйтесь в Terrapin</h3>
                    <Link className='w-4 h-4' to='/'><img className='opacity-50 transient-colors duration-150 hover:opacity-70' src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23000'><path d='M.293.293a1 1 0 0 1 1.414 0L8 6.586 14.293.293a1 1 0 1 1 1.414 1.414L9.414 8l6.293 6.293a1 1 0 0 1-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 0 1-1.414-1.414L6.586 8 .293 1.707a1 1 0 0 1 0-1.414z'/></svg>"></img></Link>
                </div>
                <div className="flex justify-between">
                    <button onClick={() => handleChangeIsCompany(false)} className={`${!isCompany ? 'bg-neutral-500' : 'hover:bg-neutral-400 bg-amber-400'} transition-colors duration-150 ease-in-out text-white text-xl font-semibold rounded-xl p-2 w-47 h-12`}>Как покупатель</button>
                    <button onClick={() => handleChangeIsCompany(true)} className={`${isCompany ? 'bg-neutral-500' : 'hover:bg-neutral-400 bg-amber-400'} transition-colors duration-150 ease-in-out text-white text-xl font-semibold rounded-xl p-2 w-47 h-12`}>Как продавец</button>
                </div>
                <div>
                    <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
                        <label>Эл. адрес</label>
                        <input id="email" className="border border-gray-300 rounded-lg mt-4 p-3" {...register('email', { required: 'Почта не может быть пустой' })} />
                        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                        <label>Пароль</label>
                        <input type={isPasswordVisible ? "text" : "password"} id="password" className="border border-gray-300 rounded-lg mt-4 p-3" {...register('password', {
                            required: 'Пароль не может быть пустым', minLength: {
                                value: 6,
                                message: 'Пароль должен быть минимум 6 символов'
                            }/* ,
                        pattern: {
                            value: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).+$/,
                            message: 'Password must contain at least one lowercase character, at least one uppercase character, at least one non alphanumeric characher.'
                        } */
                        })} />
                        {errors.password && <div className="text-red-500">{errors.password.message}</div>}

                        {isCompany ?
                            <button type='submit' className="rounded-lg bg-amber-400 hover:bg-amber-500 text-white text-xl mt-3 p-2">Продолжить</button>
                            : <> <button type='submit' className="rounded-lg bg-amber-400 hover:bg-amber-500 text-white text-xl mt-3 p-2">Регистрация</button>
                               </>
                        }
                    </form>
                </div>
              
                <hr className='my-4 mx-auto opacity-20 w-[75%]'></hr>
                <span className="text-gray-500 text-xs mx-auto">Нажимая Регистрация, вы соглашаетесь с <Link to='/terms' target='_blan' rel="noopener noreferrer" className='text-blue-600 hover:underline cursor-pointer'>условиями пользования.</Link></span>
            </div>
        </div>
    )
}