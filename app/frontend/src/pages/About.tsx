import { ScrollAppear } from "../components/Animation/ScrollAppear";


export default function About() {
    return (
        <div className="overflow-hidden">
            <div className="max-w-[1440px] w-[90%] mx-auto h-fit flex flex-col gap-20">
                <h1 className="mx-auto my-4 text-3xl font-bold md:my-8 w-fit">О нас</h1>

                <ScrollAppear duration={1000} visibleClasses={'opacity-100 translate-x-0'} hiddenClasses={'opacity-0 translate-x-100'}>
                    <div className="flex flex-col justify-center md:flex-row">
                        <pre className="flex flex-row flex-wrap ml-auto w-fit h-fit">
                            <div className="text-lg font-semibold">Terrapin</div> - проект команды <div className="font-semibold">Stronghold</div> для хакатона CodeRocks 2024
                        </pre>
                        <img className="lg:w-md w-sm" src="Img-page1.png"></img>
                    </div>
                </ScrollAppear>

                <ScrollAppear duration={1000} visibleClasses={'opacity-100 translate-y-0'} hiddenClasses="opacity-0 translate-y-100">
                    <pre className="mx-auto my-24 text-wrap w-fit">
                        Сервис имеет базовую систему регистрации, позволяя зарегистрироваться как покупатель или как продавец-компания.
                    </pre>
                </ScrollAppear>



                <ScrollAppear duration={1000} visibleClasses="opacity-100 translate-x-0" hiddenClasses="opacity-0 -translate-x-100">
                    <div className="flex flex-col justify-center md:flex-row">
                        <img className="lg:w-md w-sm" src="right_top.png"></img>
                        <pre className="mr-auto w-fit h-fit text-wrap">
                            Компания может создавать товары и указать на интерактивной карте города, где находятся склады и пункты выдачи заказов.
                        </pre>

                    </div>
                </ScrollAppear>



                <ScrollAppear duration={1000} visibleClasses="opacity-100 translate-x-0" hiddenClasses="opacity-0 translate-x-100">

                    <div className="flex flex-col justify-center h-64 my-24 md:flex-row">
                        <pre className="ml-auto w-fit h-fit text-wrap">
                            Покупатель может "заказать" товар, выбрав нужный доступный пункт выдачи заказов компании, которая является владельцем этого товара.
                        </pre>
                        <img className="w-sm" src="left_top.png"></img>
                    </div>
                </ScrollAppear>




                <ScrollAppear duration={1000} visibleClasses="opacity-100 translate-y-0" hiddenClasses="opacity-0 translate-y-100">
                    <div className="flex flex-col justify-center my-24">
                        <pre className="ml-auto w-fit h-fit text-wrap">
                            Затем пользователю будет предложено на выбор два возможных маршрута - самый быстрый и самый дешёвый.
                            Стоимость и время маршрута вычисляются с помощью теории графов.
                        </pre>
                        <img className="lg:w-md w-sm" src="turtle 3page.png"></img>
                    </div>
                </ScrollAppear>
                {/*  <img className="mx-auto pt-36" src="/logo.png"></img> */}

            </div >
        </div>
    )

}