import { useMutation, useQueries, useQueryClient } from '@tanstack/react-query'
import TownsMap from '../../components/Towns/TownsMap';
import TownsSidebar from '../../components/Towns/TownsSidebar';
import { MapModes, Town } from '../../types/types';
import { useEffect, useState } from 'react';
import { setStocks } from '../../api/stock/setStocks';
import { setPickUpPoints } from '../../api/pickUpPoint/setPickUpPoints';
import Loading from '../../components/Loading/Loading';
import { townsQueryOptions } from '../../queries/towns.query';
import { pickUpPointsQueryOptions } from '../../queries/pickUpPoints.query';
import { stocksQueryOptions } from '../../queries/stocks.query';
import { roadsQueryOptions } from '../../queries/roads.query';
import ErrorPage from '../../components/Error/ErrorPage';
import ServerError from '../../components/Error/ServerError';


export default function Map() {
    const [serverError, setServerError] = useState<unknown>(null);
    const [selectedPickUpPoints, setSelectedPickUpPointTowns] = useState<Town[]>([]);
    const [selectedStocks, setSelectedStockTowns] = useState<Town[]>([]);
    const [currentMode, setCurrentMode] = useState<MapModes>(MapModes.SetStocks);

    const [townsResult, roadsResult, pickUpPointsResult, stocksResult] = useQueries({
        queries: [
            townsQueryOptions(),
            roadsQueryOptions(),
            pickUpPointsQueryOptions(),
            stocksQueryOptions()
        ]
    });

    useEffect(() => {
        if (townsResult.status !== 'success') return; // wait until towns info arrives
        const towns = townsResult.data.data;

        if (pickUpPointsResult.status == 'success') {
            // map pick up points to towns
            setSelectedPickUpPointTowns(pickUpPointsResult.data.data.map((e) => towns.find((t: Town) => t.id == e.townId)!));
        }

        if (stocksResult.status == 'success') {
            // map stocks to towns
            setSelectedStockTowns(stocksResult.data.data.map((e) => towns.find((t: Town) => t.id == e.townId)!));
        }

    }, [townsResult.status, pickUpPointsResult.status, stocksResult.status]);

    const queryClient = useQueryClient();

    const stocksMutation = useMutation({
        mutationFn: setStocks,
        onSuccess: () => {
            queryClient.invalidateQueries(stocksQueryOptions());
        },
        onError: (error) => {
            setServerError(error);
        }
    })

    const pickUpPointsMutation = useMutation({
        mutationFn: setPickUpPoints,
        onSuccess: () => {
            queryClient.invalidateQueries(pickUpPointsQueryOptions());
        },
        onError: (error) => {
            setServerError(error);
        }
    })

    if (townsResult.isPending || roadsResult.isPending || pickUpPointsResult.isPending || stocksResult.isPending)
        return <Loading />

    if (townsResult.isError || roadsResult.isError || pickUpPointsResult.isError || stocksResult.isError) {
        const error = townsResult.error || roadsResult.error || pickUpPointsResult.error || stocksResult.error;
        return <ErrorPage message={error?.message} />
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
        stocksMutation.mutate(selectedStocks);
        pickUpPointsMutation.mutate(selectedPickUpPoints);
    }

    return (<>

        <div className='max-w-7xl w-[90%] mx-auto'>
            {serverError !== null && <ServerError error={serverError} />}
            <div className='flex md:flex-row flex-col h-[700px] min-h-fit gap-12 mb-5 mt-5'>
                <TownsSidebar stockTowns={selectedStocks} pickUpPointTowns={selectedPickUpPoints} currentMode={currentMode} setCurrentMode={setCurrentMode} handleSaveChangesClick={handleSaveChangesClick} handleItemClick={handleSidebarItemClick}></TownsSidebar>
                <TownsMap selectedTowns={currentMode == MapModes.SetStocks ? selectedStocks : selectedPickUpPoints} towns={towns} roads={roads} handleTownClick={handleTownClick}></TownsMap>
            </div>
        </div>
    </>)

}
