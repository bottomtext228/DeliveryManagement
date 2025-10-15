import TownsMap from '../../components/Towns/TownsMap';
import TownsSidebar from '../../components/Towns/TownsSidebar';
import { MapModes, Town } from '../../types/types';
import { useEffect, useState } from 'react';
import Loading from '../../components/Loading/Loading';
import ErrorPage from '../../components/Error/ErrorPage';
import ServerError from '../../components/Error/ServerError';
import { useTowns } from '../../hooks/queries/useTowns';
import { useRoads } from '../../hooks/queries/useRoads';
import { usePickUpPoints } from '../../hooks/queries/usePickUpPoints';
import { useStocks } from '../../hooks/queries/useStocks';
import { useSetPickUpPoints } from '../../hooks/mutations/useSetPickUpPoints';
import { useSetStocks } from '../../hooks/mutations/useSetStocks';


export default function Map() {
    const [stocksServerError, setStocksServerError] = useState<unknown>(null);
    const [pickUpPointsServerError, setPickUpPointsServerError] = useState<unknown>(null);

    const [selectedPickUpPoints, setSelectedPickUpPointTowns] = useState<Town[]>([]);
    const [selectedStocks, setSelectedStockTowns] = useState<Town[]>([]);
    const [currentMode, setCurrentMode] = useState<MapModes>(MapModes.SetStocks);

    const townsResult = useTowns();
    const roadsResult = useRoads();
    const pickUpPointsResult = usePickUpPoints();
    const stocksResult = useStocks();

    useEffect(() => {
        if (townsResult.status !== 'success') return; // wait until towns info arrives
        const towns = townsResult.data;

        if (pickUpPointsResult.status == 'success') {
            // map pick up points to towns
            setSelectedPickUpPointTowns(pickUpPointsResult.data.map((e) => towns.find((t: Town) => t.id == e.townId)!));
        }

        if (stocksResult.status == 'success') {
            // map stocks to towns
            setSelectedStockTowns(stocksResult.data.map((e) => towns.find((t: Town) => t.id == e.townId)!));
        }

    }, [townsResult.status, pickUpPointsResult.status, stocksResult.status, townsResult.data, pickUpPointsResult.data, stocksResult.data]);

    const setStocks = useSetStocks();
    const setPickUpPoints = useSetPickUpPoints();

    if (townsResult.isPending || roadsResult.isPending || pickUpPointsResult.isPending || stocksResult.isPending)
        return <Loading />

    if (townsResult.isError || roadsResult.isError || pickUpPointsResult.isError || stocksResult.isError) {
        const error = townsResult.error || roadsResult.error || pickUpPointsResult.error || stocksResult.error;
        return <ErrorPage message={error?.message} />
    }

    const towns = townsResult.data;
    const roads = roadsResult.data;

    const handleTownClick = (id: number) => {
        const town: Town = towns.find((e: Town) => e.id == id)!;

        if (currentMode == MapModes.SetStocks) {
            const stocks = [...selectedStocks];
            const index = stocks.findIndex(e => e.id == town.id);
            if (index === -1) stocks.push(town); // add if not found
            else stocks.splice(index, 1); // otherwise delete it
            setSelectedStockTowns(stocks);
        }

        if (currentMode == MapModes.SetPickUpPoints) {
            const pickUpPoints = [...selectedPickUpPoints];
            const index = pickUpPoints.findIndex(e => e.id == town.id);
            if (index === -1) pickUpPoints.push(town); // add if not found
            else pickUpPoints.splice(index, 1); // otherwise delete it
            setSelectedPickUpPointTowns(pickUpPoints);
        }
    };

    const handleSidebarItemClick = (town: Town) => {
        if (currentMode == MapModes.SetStocks) {
            const stocks = [...selectedStocks];
            stocks.splice(stocks.indexOf(town), 1);
            setSelectedStockTowns(stocks);
        }

        if (currentMode == MapModes.SetPickUpPoints) {
            const pickUpPoints = [...selectedPickUpPoints];
            pickUpPoints.splice(pickUpPoints.indexOf(town), 1);
            setSelectedPickUpPointTowns(pickUpPoints);
        }

    }

    const handleSaveChangesClick = () => {
        setStocks.mutate(selectedStocks, {
            onSuccess: () => {
                setStocksServerError(null);
            },
            onError: (error) => {
                setStocksServerError(error);
            }
        });

        setPickUpPoints.mutate(selectedPickUpPoints, {
            onSuccess: () => {
                setPickUpPointsServerError(null);
            },
            onError: (error) => {
                setPickUpPointsServerError(error);
            }
        });
    }

    return (<>

        <div className='max-w-7xl w-[90%] mx-auto mb-5 mt-5'>
            {stocksServerError !== null && <ServerError error={stocksServerError} />}
            {pickUpPointsServerError !== null && <ServerError error={pickUpPointsServerError} />}
            <div className='flex md:flex-row flex-col h-[700px] min-h-fit gap-12'>
                <TownsSidebar stockTowns={selectedStocks} pickUpPointTowns={selectedPickUpPoints} currentMode={currentMode} setCurrentMode={setCurrentMode} handleSaveChangesClick={handleSaveChangesClick} handleItemClick={handleSidebarItemClick}></TownsSidebar>
                <TownsMap selectedTowns={currentMode == MapModes.SetStocks ? selectedStocks : selectedPickUpPoints} towns={towns} roads={roads} handleTownClick={handleTownClick}></TownsMap>
            </div>
        </div>
    </>)

}
