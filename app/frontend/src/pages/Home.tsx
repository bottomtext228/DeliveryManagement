import { Link } from "react-router-dom";
import { ScrollAnimation } from "../components/Animation/ScrollAppear";



export default function Home() {
    return <>
        <div className="overflow-hidden">
            <div className="bg-linear-to-b from-white to-neutral-300">
                <div className="max-w-[1440px] w-[90%] h-screen min-h-fit mx-auto md:flex">

                    <ScrollAnimation duration={1000} visibleClasses="opacity-100 translate-x-0" hiddenClasses="opacity-0 -translate-x-50">
                        <div className="flex flex-col p-2 m-4 bg-orange-200 rounded-2xl min-w-70 w-fit max-w-86 h-52 md:m-8 md:p-4">
                            <p className="text-3xl font-bold">Выбирайте товар, </p>
                            <p className="mx-auto text-3xl font-bold">а мы доставим!</p>
                            <p className="mt-auto text-xl">Мы сэкономим ваше время и подберём для вас самый выгодный способ доставки</p>
                        </div>
                    </ScrollAnimation>
                    <ScrollAnimation duration={1000} delay={500} visibleClasses="opacity-100 translate-x-0" hiddenClasses="opacity-0 translate-x-50">
                        <div className="m-8 ml-auto">
                            <img src="/Img-page1.png" className="w-lg h-lg"></img>
                        </div>
                    </ScrollAnimation>
                </div>

                <ScrollAnimation duration={1000} visibleClasses="opacity-100 translate-y-0" hiddenClasses="opacity-0 translate-y-5">
                    <div className="flex justify-between px-2 pb-2 mx-auto text-lg font-semibold md:w-6xl max-w-screen md:text-2xl">
                        <p className="">Медленно...</p>
                        <p className="">&mdash; это не про черепах!</p>
                    </div>
                </ScrollAnimation>
            </div>

            <div className="max-w-[1440px] w-[100%] mx-auto">
                <div className="md:flex">
                    <ScrollAnimation duration={1000} delay={250} visibleClasses="opacity-100 translate-x-0" hiddenClasses="opacity-0 -translate-x-[50%]">
                        <div className="flex flex-col items-center flex-1/6">
                            <img className="w-64 h-64 pt-4" src="/left_top.png" alt=""></img>
                            <img src="/left_main.png" alt=""></img>
                        </div>
                    </ScrollAnimation>
                    <div className="lg:flex-4/6 flex-1/2 md:flex md:rounded-full md:bg-orange-50">
                        <ScrollAnimation duration={1000} visibleClasses="opacity-100 translate-x-0" hiddenClasses="opacity-0 -translate-x-50">
                            <div className="z-50 flex flex-col lg:items-start items-end justify-around gap-8 mx-auto text-lg font-bold uppercase flex-1/3 w-fit md:gap-0 lg:text-lg md:text-md ">
                                <div className="relative lg:bottom-5 lg:left-15">
                                    <div className="relative p-4 text-center peer rounded-4xl bg-linear-to-r from-orange-200 to-orange-500 xl:p-4 md:p-3 xl:w-72 md:w-48 w-72">надёжность</div>
                                    <span className="absolute p-2 mb-1 text-sm normal-case transition-opacity -translate-x-1/2 opacity-0 text-neutral-900 w-xl rounded-xl bg-linear-to-r from-orange-200 to-orange-300 left-1/2 bottom-full peer-hover:opacity-100">
                                        С Terrapin вы можете быть уверены в безопасности своих сделок. Мы контролируем качество продукции на нашем сайте, обеспечиваем гарантии и возврат средств. Мы обеспечиваем высокие стандарты защиты данных и конфиденциальности, что гарантирует безопасность ваших финансовых операций и личной информации.
                                    </span>
                                </div>
                                <div className="relative">
                                    <div className="p-4 text-center rounded-4xl bg-linear-to-r from-orange-200 to-orange-500 xl:p-4 md:p-3 xl:w-72 md:w-48 w-72 peer">скорость</div>
                                    <span className="absolute p-2 mb-1 text-sm normal-case transition-opacity -translate-x-1/2 opacity-0 text-neutral-900 w-xl rounded-xl bg-linear-to-r from-orange-200 to-orange-300 left-1/2 bottom-full peer-hover:opacity-100 text-wrap">
                                        Вы сможете легко найти нужные товары или услуги, а процесс оформления заказа займет всего несколько минут. Быстрая доставка и мгнененное подтверждение заказов — это то, что мы можем предложить.
                                    </span>
                                </div>
                                <div className="relative">
                                    <div className="p-4 text-center rounded-4xl bg-linear-to-r from-orange-200 to-orange-500 xl:p-4 md:p-3 xl:w-72 md:w-48 w-72 peer">удобность</div>
                                    <span className="absolute p-2 mb-1 text-sm normal-case transition-opacity -translate-x-1/2 opacity-0 text-neutral-900 w-xl rounded-xl bg-linear-to-r from-orange-200 to-orange-300 left-1/2 bottom-full peer-hover:opacity-100 text-wrap">
                                        Terrapin предлагает интуитивно понятный интерфейс, который позволяет вам легко и быстро ориентироваться в широком ассортименте товаров и услуг. Мы делаем все для того, чтобы ваш опыт покупок был комфортным и приятным, начиная от поиска и заканчивая доставкой.
                                    </span>
                                </div>

                                <Link to='/auth/register' state={{ choice: 'customer' }} className="relative p-4 border-orange-500 font-bold text-center transition-all border-2 shadow-lg rounded-4xl bg-linear-to-r from-orange-200 to-orange-500 hover:from-orange-300 active:scale-98 xl:w-72 md:w-48 w-72 md:text-sm xl:text-lg md:top-5 lg:left-15">стать покупателем</Link>
                            </div>
                        </ScrollAnimation>
                        <ScrollAnimation duration={1000} delay={400} visibleClasses="opacity-100 translate-y-0" hiddenClasses="opacity-0 translate-y-[40%]">
                            <div className="flex items-center justify-center my-8 flex-1/3 md:hidden lg:flex">
                                <img className="w-fit h-96 " src="/turtle-logstic.png" alt=""></img>
                            </div>
                        </ScrollAnimation>
                        <ScrollAnimation duration={1000} visibleClasses="opacity-100 translate-x-0" hiddenClasses="opacity-0 translate-x-50">
                            <div className="z-50 flex flex-col justify-around gap-8 mx-auto text-lg font-bold uppercase flex-1/3 md:items-end w-fit md:gap-0 lg:text-lg md:text-md " >
                                <div className="relative lg:bottom-5 lg:right-15">
                                    <div className="relative p-4 text-center peer rounded-4xl bg-linear-to-r from-neutral-200 to-neutral-500 xl:p-4 md:p-3 xl:w-72 md:w-48 w-72">спрос</div>
                                    <span className="absolute p-2 mb-1 text-sm normal-case transition-opacity -translate-x-1/2 opacity-0 text-neutral-900 w-xl rounded-xl bg-linear-to-r from-neutral-100 to-neutral-300 left-1/2 bottom-full peer-hover:opacity-100 text-wrap">
                                        Платформа Terrapin предоставляет доступ к широкой аудитории покупателей. Это значит, что ваши товары будут видны тысячам потенциальных клиентов, что значительно увеличивает шансы на продажу и позволяет быстро находить свою нишу на рынке.
                                    </span>
                                </div>
                                <div className="relative">
                                    <div className="p-4 text-center peer rounded-4xl bg-linear-to-r from-neutral-200 to-neutral-500 xl:p-4 md:p-3 xl:w-72 md:w-48 w-72">доход</div>
                                    <span className="absolute p-2 mb-1 text-sm normal-case transition-opacity -translate-x-1/2 opacity-0 w-xl text-neutral-900 rounded-xl bg-linear-to-r from-neutral-100 to-neutral-300 left-1/2 bottom-full peer-hover:opacity-100 text-wrap">
                                        Работа с Terrapin открывает новые возможности для увеличения вашего дохода. Вы можете легко масштабировать свой бизнес, предлагая товары и услуги, которые интересуют вашу целевую аудиторию. Гибкие условия и поддержка от нашей команды помогут вам максимизировать прибыль.
                                    </span>
                                </div>

                                <div className="relative">
                                    <div className="p-4 text-center peer rounded-4xl bg-linear-to-r from-neutral-200 to-neutral-500 xl:p-4 md:p-3 xl:w-72 md:w-48 w-72">без переплат</div>
                                    <span className="absolute max-w-xl p-2 mb-1 text-sm normal-case whitespace-pre transition-opacity -translate-x-1/2 opacity-0 text-neutral-900 rounded-xl bg-linear-to-r from-neutral-100 to-neutral-300 left-1/2 bottom-full peer-hover:opacity-100 text-wrap">
                                        Мы предлагаем минимальный процент комиссии из всех маркетплейсов.
                                    </span>
                                </div>
                                <Link to='/auth/register' state={{ choice: 'company' }} className="border-2 border-neutral-500 relative p-4 font-bold text-center transition-all rounded-4xl bg-linear-to-r from-neutral-200 to-neutral-500 hover:from-neutral-300 active:scale-98 xl:w-72 md:w-48 w-72 md:text-sm xl:text-lg md:top-5 lg:right-15">стать продавцом</Link>
                            </div>
                        </ScrollAnimation>
                    </div>
                    <ScrollAnimation duration={1000} delay={250} visibleClasses="opacity-100 translate-x-0" hiddenClasses="opacity-0 translate-x-[50%]">
                        <div className="flex flex-col items-center flex-1/6">
                            <img className="w-full h-full pt-4" src="/right_top.png" alt=""></img>
                            <img src="/right_main.png" alt=""></img>
                        </div>
                    </ScrollAnimation>
                </div>
            </div >
            <div className="bg-orange-100 ">

                <div className="max-w-[1440px] w-[90%] mx-auto h-96 md:my-64 my-24 flex md:flex-row flex-col gap-2 justify-around items-center">
                    <div className="">
                        <ScrollAnimation duration={1000} visibleClasses="opacity-100 translate-y-0" hiddenClasses="opacity-0 translate-y-50" >
                            <div className="p-4 text-2xl font-bold bg-gray-200 shadow-2xl rounded-2xl max-w-96 min-w-70 h-38">
                                МЫ ВСЕГДА НА СВЯЗИ СО СВОИМИ КЛИЕНТАМИ
                            </div>
                        </ScrollAnimation>
                    </div>
                    <ScrollAnimation duration={1000} delay={500} visibleClasses="opacity-100 translate-y-0" hiddenClasses="opacity-0 translate-y-50" >
                        <div className="md:mb-36 md:max-w-xl max-w-96 h-96 ">
                            <img src="/turtle 3page.png" alt=""></img>
                        </div>
                    </ScrollAnimation>
                </div>

            </div>
        </div >
    </>
}