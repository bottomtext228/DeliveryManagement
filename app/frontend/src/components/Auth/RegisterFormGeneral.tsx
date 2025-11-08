import { SubmitHandler, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import Button from '../Common/Button';
import { CloseButton } from '../Common/CloseButton';
import InputPasswordField from '../Common/Form/InputPasswordField';
import InputField from '../Common/Form/InputField';
import LinkText from '../Common/LinkText';

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
    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({ defaultValues: formData });

    const onSubmit: SubmitHandler<FormValues> = (data, e) => {
        e?.preventDefault();
        setFormData({ ...formData, ...data });
        handleGeneralSubmit(data);

    }

    return (
        <div className={`${isCompany ? 'max-h-105' : 'max-h-120'} h-fit rounded-2xl shadow-xl transition-all duration-700 ease-out border border-gray-300 p-6 flex flex-col`}>
            <div className='flex items-center justify-between mb-6'>
                <h3 className="text-2xl font-bold text-neutral-800">Зарегистрируйтесь в Terrapin</h3>
                <Link className='w-4 h-4' to='/'><CloseButton /></Link>
            </div>
            <div className="flex justify-between">
                <button onClick={() => handleChangeIsCompany(false)} className={`${!isCompany ? 'bg-neutral-500' : 'hover:bg-neutral-400 active:bg-neutral-600 bg-amber-400'} transition-colors duration-150 ease-in-out text-white md:text-xl text-sm font-semibold rounded-xl md:p-2 md:w-47 min-[375px]:w-34 w-28 h-12`}>Как покупатель</button>
                <button onClick={() => handleChangeIsCompany(true)} className={`${isCompany ? 'bg-neutral-500' : 'hover:bg-neutral-400 active:bg-neutral-600 bg-amber-400'} transition-colors duration-150 ease-in-out text-white md:text-xl text-sm font-semibold rounded-xl md:p-2 md:w-47 min-[375px]:w-34 w-28 h-12`}>Как продавец</button>
            </div>
            <div>
                <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
                    <InputField id="email" label="Эл. адрес" type="email" error={errors.email} autoComplete="on"
                        {...register('email', {
                            required: 'Почта не может быть пустой!',
                            maxLength: { value: 254, message: 'Почта не должна превышать длину в 254 символов.' }
                        })}
                    />
                    <InputPasswordField id="password" label="Пароль" error={errors.password} autoComplete="off"
                        {...register('password', {
                            required: 'Пароль не может быть пустым!',
                            minLength: { value: 5, message: 'Пароль должен иметь длину минимум в 5 символов.' },
                            maxLength: { value: 100, message: 'Пароль не должен превышать длину в 100 символов.' }
                        })}
                    />
                    <div className='mt-5'>
                        <Button label={isCompany ? "Продолжить" : "Регистрация"} />
                    </div>
                    <div className={`${!isCompany ? 'md:h-12 h-16' : 'h-0'} transition-height duration-700 overflow-hidden`}>
                        <hr className={`${!isCompany ? 'opacity-20' : 'opacity-0 invisible pointer-events-none'} transition-all duration-700 my-4 mx-auto w-[75%]`}></hr>
                        <div
                            className={`${!isCompany ? 'opacity-100' : 'opacity-0 invisible pointer-events-none'} transition-all duration-700 mt-auto text-gray-500 text-xs text-center`}
                        >
                            Нажимая Регистрация, вы соглашаетесь с <LinkText to='/terms' target='_blank' rel="noopener noreferrer">условиями пользования.</LinkText></div>
                    </div>
                </form>
            </div>
        </div>
    )
}