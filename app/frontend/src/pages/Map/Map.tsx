import { useQueries } from '@tanstack/react-query'
import { getPickUpPoints } from '../../api/map/getPickUpPoints';
import { getStocks } from '../../api/map/getStocks';
import TownsMap from '../../components/Towns/TownsMap';
import TownsSidebar from '../../components/Towns/TownsSidebar';
import { MapModes, Town } from '../../types/types';
import { useEffect, useState } from 'react';
import { getRoads } from '../../api/map/getRoads';
import { getTowns } from '../../api/map/getTowns';
import { setStocks } from '../../api/map/setStocks';
import { setPickUpPoints } from '../../api/map/setPickUpPoints';
import Loading from '../../components/Loading/Loading';


export default function Map() {
    // * fix bugs due to useQuery() when token expires and api returns 401 code
    const [selectedPickUpPoints, setSelectedPickUpPoints] = useState<Town[]>([]);
    const [selectedStocks, setSelectedStocks] = useState<Town[]>([]);
    const [currentMode, setCurrentMode] = useState<MapModes>(MapModes.SetStocks);

    const [townsResult, roadsResult, pickUpPointsResult, stocksResult] = useQueries({
        queries: [
            {
                queryKey: ['towns'],
                queryFn: getTowns,
                refetchOnWindowFocus: false
            },
            {
                queryKey: ['roads'],
                queryFn: getRoads,
                refetchOnWindowFocus: false
            },
            {
                queryKey: ['pickuppoints'],
                queryFn: getPickUpPoints,
                refetchOnWindowFocus: false,
            },
            {
                queryKey: ['stocks'],
                queryFn: getStocks,
                refetchOnWindowFocus: false
            }
        ]
    });

    useEffect(() => {
        if (townsResult.status !== 'success') return; // wait until towns info arrives
        const towns = townsResult.data.data;
        if (pickUpPointsResult.status == 'success') {
            setSelectedPickUpPoints(pickUpPointsResult.data.data.map((e: any) => towns.find((t: Town) => t.id == e.townId)));
        }

        if (stocksResult.status == 'success') {
            setSelectedStocks(stocksResult.data.data.map((e: any) => towns.find((t: Town) => t.id == e.townId)));
        }

    }, [townsResult.status, pickUpPointsResult.status, stocksResult.status]);


    if (townsResult.isPending || roadsResult.isPending || pickUpPointsResult.isPending || stocksResult.isPending)
        return <Loading></Loading>

    if (townsResult.isError || roadsResult.isError || pickUpPointsResult.isError || stocksResult.isError) {
        return <span>Something went wrong...</span>
    }

    const towns = townsResult.data.data;
    const roads = roadsResult.data.data;

    const handleTownClick = (id: number) => {
        const town: Town = towns.find((e: Town) => e.id == id)!;

        if (currentMode == MapModes.SetStocks) {
            const stocks = [...selectedStocks];
            const index = stocks.findIndex(e => e.id == town.id);
            if (index === -1) stocks.push(town); // add if not found
            else stocks.splice(index, 1); // otherwise delete it
            setSelectedStocks(stocks);
        }

        if (currentMode == MapModes.SetPickUpPoints) {
            const pickUpPoints = [...selectedPickUpPoints];
            const index = pickUpPoints.findIndex(e => e.id == town.id);
            if (index === -1) pickUpPoints.push(town); // add if not found
            else pickUpPoints.splice(index, 1); // otherwise delete it
            setSelectedPickUpPoints(pickUpPoints);
        }
    };

    const handleSidebarItemClick = (town: Town) => {
        if (currentMode == MapModes.SetStocks) {
            const stocks = [...selectedStocks];
            stocks.splice(stocks.indexOf(town), 1);
            setSelectedStocks(stocks);
        }

        if (currentMode == MapModes.SetPickUpPoints) {
            const pickUpPoints = [...selectedPickUpPoints];
            pickUpPoints.splice(pickUpPoints.indexOf(town), 1);
            setSelectedPickUpPoints(pickUpPoints);
        }

    }

    const handleSaveChangesClick = () => {
        setStocks(selectedStocks);
        setPickUpPoints(selectedPickUpPoints);
    }

    return (<>

        <div className='flex md:flex-row flex-col max-w-7xl w-[90%] h-[700px] min-h-fit ml-auto mr-auto gap-12 mb-5 mt-5'>
            <TownsSidebar stocks={selectedStocks} pickUpPoints={selectedPickUpPoints} currentMode={currentMode} setCurrentMode={setCurrentMode} handleSaveChangesClick={handleSaveChangesClick} handleItemClick={handleSidebarItemClick}></TownsSidebar>
            <TownsMap selectedTowns={currentMode == MapModes.SetStocks ? selectedStocks : selectedPickUpPoints} towns={towns} roads={roads} handleTownClick={handleTownClick}></TownsMap>
        </div>
    </>)

}
