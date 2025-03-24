
export default function About() {
    return (
        <div className="max-w-[1440px] w-[90%] mx-auto h-[1500px]">
            <h1 className="pt-6 mx-auto text-3xl font-bold w-fit">О нас</h1>

        {/*     <div className="relative">
                <pre className="flex mx-auto w-fit">
                    <div className="text-lg font-semibold">Terrapin</div> - проект команды <div className="font-semibold">Stronghold</div> для хакатона CodeRocks 2024
                </pre>
                <img className="absolute w-xs md:ml-auto left-[85%] -top-20" src="Img-page1.png"></img>
            </div>
 */}

                        <pre className="mx-auto text-wrap w-fit">
                Сервис имеет базовую систему регистрации, позволяя зарегистрироваться как покупатель или как продавец-компания.
            </pre>
            <div className="flex items-center">
                <img className="w-xs" src="right_top.png"></img>
                <pre>
                    Компания может создавать товары и указать на интерактивной карте города, где находятся склады и пункты выдачи заказов.
                </pre>

            </div>
            <div className="flex items-center h-64">
                <pre className="mr-4">
                    Покупатель может "заказать" товар, выбрав нужный доступный пункт выдачи заказов компании, которая является владельцем этого товара.
                </pre>
                <img className="mr-auto w-2xs" src="left_top.png"></img>
            </div>

            <div className="pt-6">
                <pre>
                    Затем пользователю будет предложено на выбор два возможных маршрута - самый быстрый и самый дешёвый.
                    Стоимость и время маршрута вычисляются с помощью теории графов.
                </pre>
                <img className="pt-4 w-xs" src="turtle 3page.png"></img>
            </div>
            <img className="mx-auto pt-36" src="/logo.png"></img>

        </div >
    )

}