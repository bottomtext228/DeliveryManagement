import { ScrollAnimation } from "../components/Animation/ScrollAppear";


export default function About() {
    return (
        <div className="overflow-hidden">
            <div className="max-w-[1440px] w-[90%] mx-auto h-fit flex flex-col gap-8 font-mono md:text-2xl">
                <h1 className="mx-auto my-4 text-3xl font-bold md:my-4 w-fit">О нас</h1>


                <div className="flex flex-col justify-center md:flex-row">
                    <ScrollAnimation duration={1000} visibleClasses={'opacity-100 translate-x-0'} hiddenClasses={'opacity-0 translate-x-50'}>
                        <div className="flex flex-row flex-wrap items-center ml-auto gap-x-2 w-fit h-fit">
                            <strong className="md:text-4xl text-lg">Terrapin</strong><span> - проект команды </span><strong>Stronghold</strong><span>для хакатона CodeRocks 2024</span>
                        </div>
                    </ScrollAnimation>
                    <ScrollAnimation duration={1000} delay={600} visibleClasses={'opacity-100 translate-x-0'} hiddenClasses={'opacity-0 translate-x-50'}>
                        <img className="lg:w-md w-sm" src="Img-page1.png"></img>
                    </ScrollAnimation>
                </div>


                <ScrollAnimation duration={1000} visibleClasses={'opacity-100 translate-y-0'} hiddenClasses="opacity-0 translate-y-[100%]">
                    <div className="mx-auto my-24 font-mono text-wrap w-fit">
                        Сервис имеет базовую систему регистрации, позволяя зарегистрироваться как покупатель или как продавец-компания.
                    </div>
                </ScrollAnimation>

                <div className="flex flex-col justify-center md:flex-row">
                    <ScrollAnimation duration={1000} delay={600} visibleClasses="opacity-100 translate-x-0" hiddenClasses="opacity-0 -translate-x-50">
                        <img className="lg:w-md w-sm" src="right_top.png"></img>
                    </ScrollAnimation>
                    <ScrollAnimation duration={1000} visibleClasses="opacity-100 translate-x-0" hiddenClasses="opacity-0 -translate-x-50">
                        <div className="mr-auto w-fit h-fit text-wrap">
                            Компания может создавать товары и указать на интерактивной карте города, где находятся склады и пункты выдачи заказов.
                        </div>
                    </ScrollAnimation>
                </div>

                <div className="flex flex-col justify-center h-64 my-24 md:flex-row">
                    <ScrollAnimation duration={1000} visibleClasses="opacity-100 translate-x-0" hiddenClasses="opacity-0 translate-x-50">
                        <div className="ml-auto w-fit h-fit text-wrap">
                            Покупатель может "заказать" товар, выбрав нужный доступный пункт выдачи заказов компании, которая является владельцем этого товара.
                        </div>
                    </ScrollAnimation>
                    <ScrollAnimation duration={1000} delay={600} visibleClasses="opacity-100 translate-x-0" hiddenClasses="opacity-0 translate-x-50">
                        <img className="object-contain w-sm" src="left_top.png"></img>
                    </ScrollAnimation>
                </div>

                <div className="flex flex-col justify-center my-24">
                    <ScrollAnimation duration={1000} visibleClasses="opacity-100 translate-y-0" hiddenClasses="opacity-0 translate-y-50">
                        <div className="ml-auto w-fit h-fit text-wrap">
                            Затем пользователю будет предложено на выбор два возможных маршрута - самый быстрый и самый дешёвый.
                            Стоимость и время маршрута вычисляются с помощью теории графов.
                        </div>
                    </ScrollAnimation>
                    <ScrollAnimation duration={1000} delay={600} visibleClasses="opacity-100 translate-y-0" hiddenClasses="opacity-0 translate-y-50">
                        <img className="lg:w-md w-sm" src="turtle 3page.png"></img>
                    </ScrollAnimation>
                </div>
          
            </div >
        </div >
    )

}