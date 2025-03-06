import { SubmitHandler, useForm } from "react-hook-form";


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


function AuthCompany({ handleCompanySubmit, handleGoBack, formData, setFormData }: Props) {
    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({ defaultValues: formData });

    const onSubmit: SubmitHandler<FormValues> = (data, e) => {
        e?.preventDefault();
        setFormData({ ...formData, ...data });
        handleCompanySubmit(data);
    }






    return (
        <div className="w-md mx-auto">

            <div className="my-16 rounded-2xl shadow-xl h-116 border border-gray-300 p-6">
                <button onClick={() => handleGoBack()}>back</button>
                <div>
                    <h3 className="text-neutral-800 text-2xl font-bold">Зарегистрируйтесь в Terrapin</h3>
                    <button></button>
                </div>

                <div>
                    <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
                        <label>Название компании</label>
                        <input className="border border-gray-300 rounded-lg mt-4 p-3" {...register('companyName', { required: 'Название не может быть пустым' })} />
                        {errors.companyName && <p className="text-red-500">{errors.companyName.message}</p>}
                        <label>Описание</label>
                        <input className="border border-gray-300 rounded-lg mt-4 p-3" {...register('companyDescription', {
                            required: 'Описание не может быть пустым', minLength: {
                                value: 30,
                                message: 'Описание должно быть минимум 30 символов'
                            }/* ,
                  pattern: {
                      value: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).+$/,
                      message: 'Password must contain at least one lowercase character, at least one uppercase character, at least one non alphanumeric characher.'
                  } */
                        })} />
                        {errors.companyDescription && <div className="text-red-500">{errors.companyDescription.message}</div>}

                        <button type='submit' className="rounded-lg bg-amber-400 hover:bg-amber-500 text-white text-xl mt-3 p-2">Регистрация</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AuthCompany