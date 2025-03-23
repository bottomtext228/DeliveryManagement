import { useEffect, useState } from 'react'
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
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({ defaultValues: formData });

    const onSubmit: SubmitHandler<FormValues> = (data, e) => {
        e?.preventDefault();
        setFormData({ ...formData, ...data });
        handleGeneralSubmit(data);

    }

    return (
        <div className={`${isCompany ? 'max-h-100' : 'max-h-120'} h-fit rounded-2xl shadow-xl transition-all duration-700 ease-out border border-gray-300 p-6 flex flex-col`}>
            <div className='flex justify-between items-center mb-6'>
                <h3 className="text-neutral-800 text-2xl font-bold">Зарегистрируйтесь в Terrapin</h3>
                <Link className='w-4 h-4' to='/'><img className='opacity-50 transient-colors duration-150 hover:opacity-70' src="/cross.svg"></img></Link>
            </div>
            <div className="flex justify-between">
                <button onClick={() => handleChangeIsCompany(false)} className={`${!isCompany ? 'bg-neutral-500' : 'hover:bg-neutral-400 bg-amber-400'} transition-colors duration-150 ease-in-out text-white md:text-xl text-sm font-semibold rounded-xl md:p-2 md:w-47 min-[375px]:w-34 w-28 h-12`}>Как покупатель</button>
                <button onClick={() => handleChangeIsCompany(true)} className={`${isCompany ? 'bg-neutral-500' : 'hover:bg-neutral-400 bg-amber-400'} transition-colors duration-150 ease-in-out text-white md:text-xl text-sm font-semibold rounded-xl md:p-2 md:w-47 min-[375px]:w-34 w-28 h-12`}>Как продавец</button>
            </div>
            <div className=''>
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
                    {isCompany ?
                        <button type='submit' className="rounded-lg bg-amber-400 hover:bg-amber-500 text-white text-xl mt-5  p-2">Продолжить</button>
                        : <> <button type='submit' className="rounded-lg bg-amber-400 hover:bg-amber-500 text-white text-xl mt-5 p-2">Регистрация</button>
                        </>
                    }

                    <div className={`${!isCompany ? 'md:h-12 h-16' : 'h-0'} transition-height duration-700 overflow-hidden`}>
                        <hr className={`${!isCompany ? 'opacity-20' : 'opacity-0 invisible pointer-events-none'} transition-all duration-700 my-4 mx-auto w-[75%]`}></hr>
                        <div className={`${!isCompany ? 'opacity-100' : 'opacity-0 invisible pointer-events-none'} transition-all duration-700 mt-auto text-gray-500 text-xs text-center`}>Нажимая Регистрация, вы соглашаетесь с <Link to='/terms' target='_blank' rel="noopener noreferrer" className='text-blue-600 hover:underline cursor-pointer'>условиями пользования.</Link></div>
                    </div>
                </form>

            </div>


        </div>
    )
}