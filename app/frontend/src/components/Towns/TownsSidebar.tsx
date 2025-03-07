import { MapModes, Town } from "../../types/types";
import TrashCan from '../../assets/trash-can.svg';

interface Props {
    currentMode: MapModes,
    stocks: Town[],
    pickUpPoints: Town[],
    setCurrentMode: (mode: MapModes) => void,
    handleSaveChangesClick: () => void,
    handleItemClick: (town: Town) => void
}


export default function TownsSidebar({ stocks, pickUpPoints, currentMode, setCurrentMode, handleSaveChangesClick, handleItemClick }: Props) {


    const mapItems = (array: Town[]): JSX.Element[] => {
        return array.map((e: Town) => {
            return (
                <li key={e.id} className="border rounded-2xl h-16 m-2 flex items-center">
                    <div className="ml-2 mt-auto mb-auto text-xl font-semibold">{e.name}</div>
                    <button className="ml-auto mr-2 border hover:bg-red-700 p-2 rounded-xl" onClick={() => { handleItemClick(e) }}>
                        <img className='w-6 h-6' src={TrashCan}></img>
                    </button>
                </li>
            )
        })
    }


    return (
        <>
            <div className="border-2 rounded-2xl flex-1/4 flex flex-col">
                <div className="flex-1/12 text-3xl w-[90%] font-semibold ml-auto mr-auto border-b-2 border-black p-2 text-center">
                    {currentMode == MapModes.SetStocks ? 'Склады' : 'Пункты выдачи'}
                </div>
                <div className="flex-9/12 overflow-auto h-[100%] mt-2">
                    <ul>
                        {currentMode == MapModes.SetStocks ? mapItems(stocks) : mapItems(pickUpPoints)}

                    </ul>
                </div>
                <div className="flex-2/12 border-t-2 flex flex-col">

                    <div className="flex-2/3 flex">
                        <button className="flex-1/2 bg-amber-600 hover:bg-lime-800 flex items-center justify-center text-white border-r border-r-black font-semibold" onClick={() => setCurrentMode(MapModes.SetStocks)}>
                            Склады
                        </button>
                        <button className="flex-1/2 bg-amber-700  hover:bg-lime-800 flex items-center justify-center text-white font-semibold" onClick={() => setCurrentMode(MapModes.SetPickUpPoints)}>
                            ПВЗ
                        </button>
                    </div>
                    <div className="flex-1/3 border-t border-t-black rounded-b-xl w-full ml-auto mr-auto flex items-center justify-center text-white bg-green-600 hover:bg-green-700" onClick={() => handleSaveChangesClick()}>
                        Сохранить
                    </div>
                </div>
            </div>
        </>
    )
}
