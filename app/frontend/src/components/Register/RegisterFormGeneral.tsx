import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

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
            <div className='flex items-center justify-between mb-6'>
                <h3 className="text-2xl font-bold text-neutral-800">Зарегистрируйтесь в Terrapin</h3>
                <Link className='w-4 h-4' to='/'><img className='duration-150 opacity-50 transient-colors hover:opacity-70' src="/cross.svg"></img></Link>
            </div>
            <div className="flex justify-between">
                <button onClick={() => handleChangeIsCompany(false)} className={`${!isCompany ? 'bg-neutral-500' : 'hover:bg-neutral-400 bg-amber-400'} transition-colors duration-150 ease-in-out text-white md:text-xl text-sm font-semibold rounded-xl md:p-2 md:w-47 min-[375px]:w-34 w-28 h-12`}>Как покупатель</button>
                <button onClick={() => handleChangeIsCompany(true)} className={`${isCompany ? 'bg-neutral-500' : 'hover:bg-neutral-400 bg-amber-400'} transition-colors duration-150 ease-in-out text-white md:text-xl text-sm font-semibold rounded-xl md:p-2 md:w-47 min-[375px]:w-34 w-28 h-12`}>Как продавец</button>
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
                    {isCompany ?
                        <button type='submit' className="p-2 mt-5 text-xl text-white rounded-lg bg-amber-400 hover:bg-amber-500">Продолжить</button>
                        : <> <button type='submit' className="p-2 mt-5 text-xl text-white rounded-lg bg-amber-400 hover:bg-amber-500">Регистрация</button>
                        </>
                    }

                    <div className={`${!isCompany ? 'md:h-12 h-16' : 'h-0'} transition-height duration-700 overflow-hidden`}>
                        <hr className={`${!isCompany ? 'opacity-20' : 'opacity-0 invisible pointer-events-none'} transition-all duration-700 my-4 mx-auto w-[75%]`}></hr>
                        <div className={`${!isCompany ? 'opacity-100' : 'opacity-0 invisible pointer-events-none'} transition-all duration-700 mt-auto text-gray-500 text-xs text-center`}>Нажимая Регистрация, вы соглашаетесь с <Link to='/terms' target='_blank' rel="noopener noreferrer" className='text-blue-600 cursor-pointer hover:underline hover:brightness-90'>условиями пользования.</Link></div>
                    </div>
                </form>
            </div>
        </div>
    )
}