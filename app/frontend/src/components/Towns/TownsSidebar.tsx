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
                <li key={e.id} className="flex items-center h-16 m-2 border-2 border-gray-300 even:bg-neutral-50 rounded-xl group hover:bg-neutral-100">
                    <div className="mt-auto mb-auto ml-2 overflow-hidden text-xl font-semibold max-w-48 text-ellipsis whitespace-nowrap">{e.name}</div>
                    <button className="invisible w-10 h-10 p-2 ml-auto mr-2 border-transparent group-hover:visible hover:bg-neutral-300 rounded-xl" onClick={() => { handleItemClick(e) }}>
                        <img className='w-full h-full brightness-90' src={TrashCan}></img>
                    </button>
                </li>
            )
        })
    }


    return (
        <>
            <div className="flex flex-col border-2 rounded-2xl flex-1/4">
                <div className="flex-1/12 text-3xl w-[90%] font-semibold ml-auto mr-auto border-b-2 border-black p-2 text-center">
                    {currentMode == MapModes.SetStocks ? 'Склады' : 'Пункты выдачи'}
                </div>
                <div className="mt-2 overflow-scroll flex-9/12">
                    <ul>
                        {currentMode == MapModes.SetStocks ? mapItems(stocks) : mapItems(pickUpPoints)}
                    </ul>
                </div>
                <div className="flex flex-col border-t flex-2/12">
                    <div className="flex flex-2/3">
                        <button className={`flex items-center justify-center font-semibold text-white flex-1/2 ${currentMode == MapModes.SetStocks ? 'bg-amber-700' : 'bg-amber-600'} hover:bg-amber-800  border-r-black`} onClick={() => setCurrentMode(MapModes.SetStocks)}>
                            Склады
                        </button>
                        <button className={`flex items-center justify-center font-semibold text-white flex-1/2 ${currentMode == MapModes.SetPickUpPoints ? 'bg-amber-700' : 'bg-amber-600'} hover:bg-amber-800`} onClick={() => setCurrentMode(MapModes.SetPickUpPoints)}>
                            ПВЗ
                        </button>
                    </div>  
                    <button className="flex items-center justify-center w-full ml-auto mr-auto text-white bg-green-600 flex-1/3 border-t-black rounded-b-xl hover:bg-green-700" onClick={() => handleSaveChangesClick()}>
                        Сохранить
                    </button>
                </div>
            </div>
        </>
    )
}
