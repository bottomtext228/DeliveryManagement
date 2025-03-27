import { Link } from "react-router-dom";
import { ScrollAppear } from "../components/Animation/ScrollAppear";

export default function Home() {
    return <>
        <div className="">
            <div className="bg-linear-to-b from-white to-neutral-300">
                <div className="max-w-[1440px] w-[90%] h-fit mx-auto md:flex">

                    {/* <ScrollAppear duration={1000} visibleClasses={'opacity-100 translate-x-0'} hiddenClasses={'opacity-0 -translate-x-20'}> */}
                    <div className="flex flex-col p-2 m-4 bg-orange-200 rounded-2xl min-w-70 w-fit max-w-86 h-52 md:m-8 md:p-4">
                        <p className="text-3xl font-bold">Выбирайте товар, </p>
                        <p className="mx-auto text-3xl font-bold">а мы доставим!</p>
                        <p className="mt-auto text-xl">Мы сэкономим ваше время и подберём для вас самый выгодный способ доставки</p>
                    </div>

                    {/* <ScrollAppear duration={1000} visibleClasses="opacity-100 translate-x-0" hiddenClasses="opacity-0 translate-x-20"> */}
                    <div className="m-8 ml-auto">
                        <img src="/Img-page1.png" className="w-lg h-lg"></img>
                    </div>
                    {/*     </ScrollAppear>  */}
                </div>

                <div className="flex justify-between pb-2 px-2 mx-auto text-lg font-semibold md:w-6xl max-w-screen md:text-2xl">
                    <p className="">Медленно...</p>
                    <p className="">&mdash; это не про черепах!</p>
                </div>
            </div>
<div className="w-8 h-[1000px]"></div>

             <div className="relative">
                 
                 <ScrollAppear duration={1000} visibleClasses="opacity-100 translate-x-0" hiddenClasses="opacity-0 translate-x-100">
                     <div className="w-62 h-32 bg-amber-300 text-center">vasya</div></ScrollAppear>
             </div>
  
            <div className="max-w-[1440px] w-[90%] mx-auto">
                <div className="md:flex">
                    <div className="flex flex-col items-center flex-1/6">
                        <img className="w-64 h-64 pt-4" src="/left_top.png" alt=""></img>
                        <img src="/left_main.png" alt=""></img>
                    </div>
                    <div className="flex-4/6 md:flex md:rounded-full md:bg-orange-50">
                        <div className="flex flex-col items-start justify-around gap-8 mx-auto text-lg font-bold uppercase flex-1/3 w-fit md:gap-0 lg:text-lg md:text-md ">
                            <div className="relative p-4 text-center rounded-4xl bg-linear-to-r from-orange-200 to-orange-500 xl:p-4 md:p-3 xl:w-72 md:w-48 w-72 md:bottom-5 md:left-15">надёжность</div>
                            <div className="p-4 text-center rounded-4xl bg-linear-to-r from-orange-200 to-orange-500 xl:p-4 md:p-3 xl:w-72 md:w-48 w-72">скорость</div>
                            <div className="p-4 text-center rounded-4xl bg-linear-to-r from-orange-200 to-orange-500 xl:p-4 md:p-3 xl:w-72 md:w-48 w-72">удобность</div>
                            <Link to='/auth/register' state={{ choice: 'customer' }} className="relative p-4 font-bold text-center border-2 shadow-lg rounded-4xl bg-linear-to-r from-orange-200 to-orange-500 hover:from-orange-300 xl:w-72 md:w-62 w-72 md:top-5 lg:left-15">стать покупателем</Link>
                        </div>
                        <div className="flex items-center justify-center my-8 flex-1/3 md:hidden lg:flex">
                            <img className="w-fit h-96 " src="/turtle-logstic.png" alt=""></img>
                        </div>
                        <div className="flex flex-col justify-around gap-8 mx-auto text-lg font-bold uppercase flex-1/3 md:items-end w-fit md:gap-0 lg:text-lg md:text-md " >
                            <div className="relative p-4 text-center rounded-4xl bg-linear-to-r from-neutral-200 to-neutral-500 xl:p-4 md:p-3 xl:w-72 md:w-48 w-72 md:bottom-5 md:right-15">спрос</div>
                            <div className="p-4 text-center rounded-4xl bg-linear-to-r from-neutral-200 to-neutral-500 xl:p-4 md:p-3 xl:w-72 md:w-48 w-72">доход</div>
                            <div className="p-4 text-center rounded-4xl bg-linear-to-r from-neutral-200 to-neutral-500 xl:p-4 md:p-3 xl:w-72 md:w-48 w-72">без переплат</div>
                            <Link to='/auth/register' state={{ choice: 'company' }} className="relative p-4 font-bold text-center border-2 rounded-4xl bg-linear-to-r from-neutral-200 to-neutral-500 hover:from-neutral-300 xl:w-72 md:w-62 w-72 md:top-5 lg:right-15">стать продавцом</Link>
                        </div>
                    </div>
                    <div className="flex flex-col items-center flex-1/6">
                        <img className="w-full h-full pt-4" src="/right_top.png" alt=""></img>
                        <img src="/right_main.png" alt=""></img>
                    </div>
                </div>
            </div>
            <div className="bg-orange-100 ">
                <div className="max-w-[1440px] w-[90%] mx-auto h-96 md:my-64 my-24 flex md:flex-row flex-col gap-2 justify-around items-center">
                    <div className="">
                        <div className="p-4 text-2xl font-bold bg-gray-200 shadow-2xl rounded-2xl max-w-96 min-w-70 h-38">
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