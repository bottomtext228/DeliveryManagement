import { SubmitHandler, useForm } from "react-hook-form";
import { Link } from "react-router-dom";


interface FormValues {
    email: string
    password: string,
    companyName: string,
    companyDescription: string
};


interface Props {
    handleCompanySubmit: (data: FormValues) => void,
    handleGoBack: () => void,
    setFormData: (data: FormValues) => void;
    formData: FormValues
}


export default function RegisterFormCompany({ handleCompanySubmit, handleGoBack, formData, setFormData }: Props) {
    const { register, handleSubmit, formState: { errors }, getValues } = useForm<FormValues>({ defaultValues: formData });

    const onSubmit: SubmitHandler<FormValues> = (data, e) => {
        e?.preventDefault();
        setFormData({ ...formData, ...data });
        handleCompanySubmit(data);
    }


    const handleClick = () => {
        setFormData({ ...formData, ...getValues() }); // save form values before returning to the general form
        handleGoBack();
    }



    return (
        <div className="p-6 border border-gray-300 shadow-xl rounded-2xl h-fit">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-neutral-800">Информация о вашей компании</h3>
                <button className="w-5 h-5 duration-150 opacity-50 transient-colors hover:opacity-70" onClick={handleClick}><img src='/arrow-left.svg'></img></button>
            </div>

            <div>
                <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
                    <div className="relative mt-4">
                        <input id="companyName" className="block w-full h-14.5 outline-none border border-gray-300 focus:outline-none focus:ring-4 focus:border-blue-400 duration-150 focus:ring-blue-200 rounded-lg p-3 pt-6.5 pb-2.5 peer" {...register('companyName', { required: 'Название не может быть пустым' })} placeholder=" " />
                        <label htmlFor="companyName" className="absolute pointer-events-none text-md text-black duration-100 peer-placeholder-shown:opacity-100 peer-focus:opacity-70 opacity-70 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">
                            Название
                        </label>
                    </div>
                    {errors.companyName && <div className="text-red-500">{errors.companyName.message}</div>}
                    <div className="relative mt-4">
                        <textarea id="companyDescription" className="block w-full h-42 outline-none border border-gray-300 focus:outline-none focus:ring-4 focus:border-blue-400 duration-150 focus:ring-blue-200 rounded-lg p-3 pt-6.5 pb-2.5 peer" placeholder=" " {...register('companyDescription', {
                            required: 'Описание не может быть пустым'
                        })} />
                        <label htmlFor="companyDescription" className="absolute pointer-events-none text-md text-black duration-100 peer-placeholder-shown:opacity-100 peer-focus:opacity-70 opacity-70 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">
                            Описание
                        </label>
                    </div>
                    {errors.companyDescription && <div className="text-red-500">{errors.companyDescription.message}</div>}

                    <button type='submit' className="p-2 mt-5 text-xl text-white rounded-lg bg-amber-400 hover:bg-amber-500">Регистрация</button>
                    <hr className='my-4 mx-auto opacity-20 w-[75%]'></hr>
                    <span className="mx-auto text-xs text-gray-500">Нажимая Регистрация, вы соглашаетесь с <Link to='/terms' target='_blank' rel="noopener noreferrer" className='text-blue-600 cursor-pointer hover:underline'>условиями пользования.</Link></span>
                </form>
            </div>
        </div>
    )
}
