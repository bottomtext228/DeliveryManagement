import { Link } from "react-router-dom";

export default function Home() {
    return <>
        <div className="">
            <div className="bg-linear-to-b from-white to-neutral-300">
                <div className="max-w-[1440px] w-screen h-fit mx-auto md:flex">
                    <div className="bg-orange-200 rounded-2xl min-w-70 w-fit max-w-86 h-52 flex flex-col md:m-8 md:p-4 m-4 p-2">
                        <p className="font-bold text-3xl">Выбирайте товар, </p>
                        <p className="mx-auto font-bold text-3xl">а мы доставим!</p>
                        <p className="mt-auto text-xl">Мы сэкономим ваше время и подберём для вас самый выгодный способ доставки</p>
                    </div>
                    <div className="ml-auto m-8">
                        <img src="/Img-page1.png" className="w-lg h-lg"></img>
                    </div>
                </div>

                <div className="flex mx-auto md:w-6xl max-w-screen justify-between font-semibold md:text-2xl text-lg pb-2">
                    <p className="">Медленно...</p>
                    <p className="">&mdash; это не про черепах!</p>
                </div>
            </div>
            <div className="max-w-[1440px] w-screen mx-auto">
                <div className="md:flex">
                    <div className="flex-1/6 flex flex-col items-center">
                        <img className="w-64 h-64 pt-4" src="/left_top.png" alt=""></img>
                        <img src="/left_main.png" alt=""></img>
                    </div>
                    <div className="flex-4/6 md:flex md:rounded-full md:bg-orange-50">
                        <div className="flex flex-col flex-1/3 justify-around items-start w-fit mx-auto gap-8 md:gap-0 lg:text-lg md:text-md text-lg uppercase font-bold ">
                            <div className="rounded-4xl bg-linear-to-r from-orange-200 to-orange-500 xl:p-4 md:p-3 p-4 xl:w-72 md:w-48 w-72 text-center relative md:bottom-5 md:left-15">надёжность</div>
                            <div className="rounded-4xl bg-linear-to-r from-orange-200 to-orange-500 xl:p-4 md:p-3 p-4 xl:w-72 md:w-48 w-72 text-center">скорость</div>
                            <div className="rounded-4xl bg-linear-to-r from-orange-200 to-orange-500 xl:p-4 md:p-3 p-4 xl:w-72 md:w-48 w-72 text-center">удобность</div>
                            <Link to='/auth/register' state={{ choice: 'customer' }} className="rounded-4xl border-2 bg-linear-to-r from-orange-200 to-orange-500 hover:from-orange-300 shadow-lg p-4 xl:w-72 md:w-62 w-72 text-center font-bold relative md:top-5 lg:left-15">стать покупателем</Link>
                        </div>
                        <div className="flex-1/3 flex justify-center items-center my-8 md:hidden lg:flex">
                            <img className="w-fit h-96 " src="/turtle-logstic.png" alt=""></img>
                        </div>
                        <div className="flex flex-col flex-1/3 justify-around md:items-end w-fit mx-auto gap-8 md:gap-0 lg:text-lg md:text-md text-lg  uppercase font-bold " >
                            <div className="rounded-4xl bg-linear-to-r from-neutral-200 to-neutral-500 xl:p-4 md:p-3 p-4 xl:w-72 md:w-48 w-72 text-center relative md:bottom-5 md:right-15">спрос</div>
                            <div className="rounded-4xl bg-linear-to-r from-neutral-200 to-neutral-500 xl:p-4 md:p-3 p-4 xl:w-72 md:w-48 w-72 text-center">доход</div>
                            <div className="rounded-4xl bg-linear-to-r from-neutral-200 to-neutral-500 xl:p-4 md:p-3 p-4 xl:w-72 md:w-48 w-72 text-center">без переплат</div>
                            <Link to='/auth/register' state={{ choice: 'company' }} className="rounded-4xl border-2 bg-linear-to-r from-neutral-200 to-neutral-500 hover:from-neutral-300 p-4 xl:w-72 md:w-62 w-72 text-center font-bold relative md:top-5 lg:right-15">стать продавцом</Link>
                        </div>
                    </div>
                    <div className="flex-1/6 flex flex-col items-center">
                        <img className="w-full h-full pt-4" src="/right_top.png" alt=""></img>
                        <img src="/right_main.png" alt=""></img>
                    </div>
                </div>
            </div>
            <div className="bg-orange-100 ">
                <div className="max-w-[1440px] w-screen mx-auto h-96 md:my-64 my-24 flex md:flex-row flex-col gap-2 justify-around items-center">
                    <div className="">
                        <div className="rounded-2xl shadow-2xl bg-gray-200 max-w-96 min-w-70 h-38 p-4 text-2xl font-bold">
                            МЫ ВСЕГДА НА СВЯЗИ СО СВОИМИ КЛИЕНТАМИ
                        </div>
                    </div>
                    <div className="md:mb-36 md:max-w-xl max-w-96 h-96 ">

                        <img src="/turtle 3page.png" alt=""></img>
                    </div>
                </div>
            </div>
        </div>
    </>
}