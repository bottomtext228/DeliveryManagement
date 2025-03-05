import React, { BaseSyntheticEvent } from 'react'

interface Props {
  handleSubmit: (e?: BaseSyntheticEvent<object, any, any> | undefined) => Promise<void>
}

function AuthGeneral({ handleSubmit }: Props) {
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
          <button className="bg-amber-400 text-white text-xl font-semibold rounded-xl p-2 w-47 h-12">Как покупатель</button>
          <button className="bg-neutral-400 text-white text-xl font-semibold rounded-xl p-2 w-47 h-12">Как продавец</button>
        </div>
        <div>
          <form className="flex flex-col" onSubmit={handleSubmit}>
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

            <button type='submit' className="rounded-lg bg-amber-400 text-white text-xl mt-3 p-2">{isLogin ? 'Войти' : 'Регистрация'}</button>
            {isLogin ?? <span className="text-gray-500 p-4">Нажимая Регистрация, вы соглашаетесь с условиями использования.</span>}
          </form>
        </div>
      </div>
    </div>
  )
}

export default AuthGeneral