import { SubmitHandler, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import Button from "../Common/Button";
import GoBackArrow from "../Common/GoBackArrow";
import InputField from "../Common/Form/InputField";
import TextAreaField from "../Common/Form/TextAreaField";



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
                <button onClick={handleClick}><GoBackArrow /></button>
            </div>

            <div>
                <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
                    <InputField id="companyName" label="Название" error={errors.companyName} autoComplete="on"
                        {...register('companyName', {
                            required: 'Название не может быть пустым',
                            minLength: {value: 2, message: 'Название не может быть меньше 2 символов'},
                            maxLength: {value: 200, message: 'Название не может превышать длину в 200 символов'}
                        })}
                    />
                    <TextAreaField id="companyDescription" label="Описание" error={errors.companyName} rows={5}
                        {...register('companyDescription', { required: 'Описание не может быть пустым' })}
                    />
                    <div className="pt-5">
                        <Button label="Регистрация" />
                    </div>
                    <hr className='my-4 mx-auto opacity-20 w-[75%]'></hr>
                    <span className="mx-auto text-xs text-gray-500">Нажимая Регистрация, вы соглашаетесь с <Link to='/terms' target='_blank' rel="noopener noreferrer" className='text-blue-600 cursor-pointer hover:underline hover:brightness-90'>условиями пользования.</Link></span>
                </form>
            </div>
        </div>
    )
}
