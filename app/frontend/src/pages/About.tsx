
export default function About() {
    return (
        <div className="w-8xl mx-auto h-[1500px]">
            <h1 className="w-fit mx-auto font-bold text-3xl pt-6">О нас</h1>

            <div className="pt-6 h-48">
                <pre className="mx-auto w-fit">
                    <span className="font-semibold text-lg">Terrapin</span> - проект команды <span className="font-semibold">Stronghold</span> для хакатона CodeRocks 2024
                </pre>
                <img className="w-xs ml-auto relative bottom-50" src="Img-page1.png"></img>
            </div>


            <pre className="mx-auto text-wrap w-fit">
                Сервис имеет базовую систему регистрации, позволяя зарегистрироваться как покупатель или как продавец-компания.
            </pre>
            <div className="flex items-center">
                <img className="w-xs" src="right_top.png"></img>
                <pre>
                    Компания может создавать товары и указать на интерактивной карте города, где находятся склады и пункты выдачи заказов.
                </pre>

            </div>
            <div className="flex h-64 items-center">
                <pre className="mr-4">
                    Покупатель может "заказать" товар, выбрав нужный доступный пункт выдачи заказов компании, которая является владельцем этого товара.
                </pre>
                <img className="w-2xs mr-auto" src="left_top.png"></img>
            </div>

            <div className="pt-6">
                <pre>
                    Затем пользователю будет предложено на выбор два возможных маршрута - самый быстрый и самый дешёвый.
                    Стоимость и время маршрута вычисляются с помощью теории графов.
                </pre>
                <img className="w-xs pt-4" src="turtle 3page.png"></img>
            </div>
            <img className="mx-auto pt-36" src="/logo.png"></img>

        </div >
    )

}