import { Link } from "react-router-dom";

export default function Home() {
    return <>
        <div className="">
            <div className="bg-linear-to-b from-white to-neutral-300">
                <div className="w-8xl h-fit mx-auto flex ">
                    <div className="bg-orange-200 rounded-2xl w-86 h-52 flex flex-col m-8 p-4 ">
                        <p className="font-bold text-3xl">Выбирайте товар, </p>
                        <p className="mx-auto font-bold text-3xl">а мы доставим!</p>
                        <p className="mt-auto text-xl">Мы сэкономим ваше время и подберём для вас самый выгодный способ доставки</p>
                    </div>
                    <div className="ml-auto m-8">
                        <img src="/Img-page1.png" className="w-lg h-lg"></img>
                    </div>
                </div>

                <div className="flex mx-auto w-6xl justify-between font-semibold text-2xl pb-2">
                    <p className="">Медленно...</p>
                    <p className="">&mdash; это не про черепах!</p>
                </div>
            </div>
            <div className="w-8xl mx-auto">
                <div className="flex">
                    <div className="flex-1/6 flex flex-col items-center">
                        <img className="w-64 h-64 pt-4" src="/left_top.png" alt=""></img>
                        <img src="/left_main.png" alt=""></img>
                    </div>
                    <div className="flex-4/6 flex rounded-full bg-orange-50">
                        <div className="flex flex-col flex-1/3 justify-around items-start text-lg uppercase font-bold ">
                            <div className="rounded-4xl bg-linear-to-r from-orange-200 to-orange-500 p-4 w-72 text-center relative bottom-5 left-15">надёжность</div>
                            <div className="rounded-4xl bg-linear-to-r from-orange-200 to-orange-500 p-4 w-72 text-center">скорость</div>
                            <div className="rounded-4xl bg-linear-to-r from-orange-200 to-orange-500 p-4 w-72 text-center">удобность</div>
                            <Link to='/auth/register' state={{ choice: 'customer' }} className="rounded-4xl border-2 bg-linear-to-r from-orange-200 to-orange-500 hover:from-orange-300 shadow-lg p-4 w-72 text-center font-bold relative top-5 left-15">стать покупателем</Link>
                        </div>
                        <div className="flex-1/3 flex justify-center items-center">
                            <img className="w-fit h-96" src="/turtle-logstic.png" alt=""></img>
                        </div>
                        <div className="flex flex-col flex-1/3 justify-around items-end text-lg  uppercase font-bold " >
                            <div className="rounded-4xl bg-linear-to-r from-neutral-200 to-neutral-500 p-4 w-72 text-center relative bottom-5 right-15">спрос</div>
                            <div className="rounded-4xl bg-linear-to-r from-neutral-200 to-neutral-500 p-4 w-72 text-center">доход</div>
                            <div className="rounded-4xl bg-linear-to-r from-neutral-200 to-neutral-500 p-4 w-72 text-center">без переплат</div>
                            <Link to='/auth/register' state={{ choice: 'company' }} className="rounded-4xl border-2 bg-linear-to-r from-neutral-200 to-neutral-500 hover:from-neutral-300 p-4 w-72 text-center font-bold relative top-5 right-15">стать продавцом</Link>
                        </div>
                    </div>
                    <div className="flex-1/6 flex flex-col items-center">
                        <img className="w-full h-full pt-4" src="/right_top.png" alt=""></img>
                        <img src="/right_main.png" alt=""></img>
                    </div>
                </div>
            </div>
            <div className="bg-orange-100">
                <div className="w-8xl mx-auto h-96 my-64 flex justify-around items-center">
                    <div className="rounded-2xl shadow-2xl bg-gray-200 w-96 h-38 p-4 text-2xl font-bold">
                        МЫ ВСЕГДА НА СВЯЗИ СО СВОИМИ КЛИЕНТАМИ
                    </div>
                    <div className="mb-36 w-xl h-96">
                        <img src="/turtle 3page.png" alt="" width="1000px"></img>
                    </div>
                </div>
            </div>
        </div>
    </>
}