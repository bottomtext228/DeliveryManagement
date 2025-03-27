import { ScrollAppear } from "../components/Animation/ScrollAppear";


export default function About() {
    return (
        <div className="overflow-hidden">
            <div className="max-w-[1440px] w-[90%] mx-auto h-fit flex flex-col gap-20">
                <h1 className="mx-auto my-4 text-3xl font-bold md:my-8 w-fit">О нас</h1>


                <div className="flex flex-col justify-center md:flex-row">
                    <ScrollAppear duration={1000} visibleClasses={'opacity-100 translate-x-0'} hiddenClasses={'opacity-0 translate-x-100'}>
                        <pre className="flex flex-row flex-wrap ml-auto w-fit h-fit">
                            <div className="text-lg font-semibold">Terrapin</div> - проект команды <div className="font-semibold">Stronghold</div> для хакатона CodeRocks 2024
                        </pre>
                    </ScrollAppear>
                    <ScrollAppear duration={1000} delay={600} visibleClasses={'opacity-100 translate-x-0'} hiddenClasses={'opacity-0 translate-x-100'}>
                        <img className="lg:w-md w-sm" src="Img-page1.png"></img>
                    </ScrollAppear>
                </div>


                <ScrollAppear duration={1000} visibleClasses={'opacity-100 translate-y-0'} hiddenClasses="opacity-0 translate-y-100">
                    <pre className="mx-auto my-24 text-wrap w-fit">
                        Сервис имеет базовую систему регистрации, позволяя зарегистрироваться как покупатель или как продавец-компания.
                    </pre>
                </ScrollAppear>




                <div className="flex flex-col justify-center md:flex-row">
                    <ScrollAppear duration={1000} delay={600} visibleClasses="opacity-100 translate-x-0" hiddenClasses="opacity-0 -translate-x-100">

                        <img className="lg:w-md w-sm" src="right_top.png"></img>
                    </ScrollAppear>
                    <ScrollAppear duration={1000} visibleClasses="opacity-100 translate-x-0" hiddenClasses="opacity-0 -translate-x-100">
                        <pre className="mr-auto w-fit h-fit text-wrap">
                            Компания может создавать товары и указать на интерактивной карте города, где находятся склады и пункты выдачи заказов.
                        </pre>
                    </ScrollAppear>
                </div>




                <div className="flex flex-col justify-center h-64 my-24 md:flex-row">
                    <ScrollAppear duration={1000} visibleClasses="opacity-100 translate-x-0" hiddenClasses="opacity-0 translate-x-100">

                        <pre className="ml-auto w-fit h-fit text-wrap">
                            Покупатель может "заказать" товар, выбрав нужный доступный пункт выдачи заказов компании, которая является владельцем этого товара.
                        </pre>
                    </ScrollAppear>
                    <ScrollAppear duration={1000} delay={600} visibleClasses="opacity-100 translate-x-0" hiddenClasses="opacity-0 translate-x-100">

                        <img className="w-sm" src="left_top.png"></img>
                    </ScrollAppear>
                </div>





                <div className="flex flex-col justify-center my-24">
                    <ScrollAppear duration={1000} visibleClasses="opacity-100 translate-y-0" hiddenClasses="opacity-0 translate-y-100">
                        <pre className="ml-auto w-fit h-fit text-wrap">
                            Затем пользователю будет предложено на выбор два возможных маршрута - самый быстрый и самый дешёвый.
                            Стоимость и время маршрута вычисляются с помощью теории графов.
                        </pre>
                    </ScrollAppear>
                    <ScrollAppear duration={1000} delay={600} visibleClasses="opacity-100 translate-y-0" hiddenClasses="opacity-0 translate-y-100">
                        <img className="lg:w-md w-sm" src="turtle 3page.png"></img>
                    </ScrollAppear>
                </div>

                {/*  <img className="mx-auto pt-36" src="/logo.png"></img> */}

            </div >
        </div >
    )

}