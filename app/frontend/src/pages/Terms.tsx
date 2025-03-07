import { Link } from "react-router-dom";

export default function Terms() {
    return (
        <>
            <div className="w-5xl my-8 mx-auto rounded-2xl border border-gray-200">

                <h1 className="text-3xl font-bold text-center border-b border-b-gray-200 p-2">Условия пользования</h1>
                <div className="px-4 mt-4">
                    <div className="font-semibold uppercase text-2xl text-center">
                        Данный сайт не является реальным сервисом
                    </div>
                    <pre className="mt-4 text-wrap">
                        Cайт является доработанной версией проекта для хакатона CodeRock 2024 и существует исключительно в обучающих целях.
                        Представители этого сайта ("сервиса") не несут ответственности за любое содержимое, создаваемое пользователями, и за учётные записи. 
                        Представленные материалы выражают только мнения их авторов. 
                        Если Вы не согласны с этими условиями, пожалуйста, не регистрируйтесь и не используйте наш сервис.
                    </pre>
                </div>
            </div>
        </>
    )
}