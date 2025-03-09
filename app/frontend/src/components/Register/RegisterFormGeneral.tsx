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
            <div className="my-16 rounded-2xl shadow-xl h-fit transition duration-1000 border border-gray-300 p-6">
                <div className='flex justify-between items-center mb-6'>
                    <h3 className="text-neutral-800 text-2xl font-bold">Зарегистрируйтесь в Terrapin</h3>
                    <Link className='w-4 h-4' to='/'><img className='opacity-50 transient-colors duration-150 hover:opacity-70' src="/cross.svg"></img></Link>
                </div>
                <div className="flex justify-between">
                    <button onClick={() => handleChangeIsCompany(false)} className={`${!isCompany ? 'bg-neutral-500' : 'hover:bg-neutral-400 bg-amber-400'} transition-colors duration-150 ease-in-out text-white text-xl font-semibold rounded-xl p-2 w-47 h-12`}>Как покупатель</button>
                    <button onClick={() => handleChangeIsCompany(true)} className={`${isCompany ? 'bg-neutral-500' : 'hover:bg-neutral-400 bg-amber-400'} transition-colors duration-150 ease-in-out text-white text-xl font-semibold rounded-xl p-2 w-47 h-12`}>Как продавец</button>
                </div>
                <div>
                    <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
                        <div className="relative mt-4">
                            <input id="email" className="block w-full h-14.5 outline-none border border-gray-300 focus:outline-none focus:ring-4 focus:border-blue-400 duration-150 focus:ring-blue-200 rounded-lg p-3 pt-6.5 pb-2.5 peer" {...register('email', { required: 'Почта не может быть пустой' })} placeholder=" " />
                            <label htmlFor="email" className="absolute pointer-events-none text-md text-black duration-100 peer-placeholder-shown:opacity-100 peer-focus:opacity-70 opacity-70 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">
                                Эл. адрес
                            </label>
                        </div>
                        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
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
                        {isCompany ?
                            <button type='submit' className="rounded-lg bg-amber-400 hover:bg-amber-500 text-white text-xl mt-5 p-2">Продолжить</button>
                            : <> <button type='submit' className="rounded-lg bg-amber-400 hover:bg-amber-500 text-white text-xl mt-5 p-2">Регистрация</button>
                            </>
                        }
                    </form>
                </div>
                {
                    !isCompany &&
                    <>
                        <hr className='my-4 mx-auto opacity-20 w-[75%]'></hr>
                        <span className="text-gray-500 text-xs mx-auto">Нажимая Регистрация, вы соглашаетесь с <Link to='/terms' target='_blank' rel="noopener noreferrer" className='text-blue-600 hover:underline cursor-pointer'>условиями пользования.</Link></span>
                    </>}
            </div>
        </div>
    )
}