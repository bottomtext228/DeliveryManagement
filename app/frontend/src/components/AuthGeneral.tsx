import React, { BaseSyntheticEvent, useState } from 'react'
import { IHtppValidationProblemDetails } from '../types/types';
import { SubmitHandler, useForm } from 'react-hook-form';

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



function AuthGeneral({ handleGeneralSubmit, isCompany, handleChangeIsCompany, formData, setFormData }: Props) {
  const [serverError, setServerError] = useState<IHtppValidationProblemDetails | null>(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({defaultValues: formData});

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
      <div className="my-16 rounded-2xl shadow-xl h-116 border border-gray-300 p-6">
        <div>
          <h3 className="text-neutral-800 text-2xl font-bold">Зарегистрируйтесь в Terrapin</h3>
          <button></button>
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


              <button type='submit' className="rounded-lg bg-amber-400 text-white text-xl mt-3 p-2">Продолжить</button>
              : <> <button type='submit' className="rounded-lg bg-amber-400 hover:bg-amber-500 text-white text-xl mt-3 p-2">Регистрация</button>
                <span className="text-gray-500 p-4">Нажимая Регистрация, вы соглашаетесь с условиями использования.</span></>
            }
          </form>
        </div>
      </div>
    </div>
  )
}

export default AuthGeneral