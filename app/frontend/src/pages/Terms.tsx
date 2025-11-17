import { useScrollToTop } from "../hooks/useScrollToTop";

export default function Terms() {

    useScrollToTop();

    return (
        <div className="max-w-5xl w-[90%] md:my-10 my-4 mx-auto rounded-2xl border border-gray-200">
            <h1 className="p-2 text-3xl font-bold text-center border-b border-b-gray-200">Условия пользования</h1>
            <div className="p-4 mt-4">
                <div className="text-2xl font-semibold text-center uppercase">
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
    )
}