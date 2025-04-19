import { useQueries, useQuery } from "@tanstack/react-query"
import { getOrders } from "../../api/orders/getOrders";
import Loading from "../../components/Loading/Loading";
import { getTowns } from "../../api/map/getTowns";
import Order from "../../components/Order/Order";

export default function Orders() {
    const [ordersResult, townsResult] = useQueries({
        queries: [
            {
                queryKey: ['orders'],
                queryFn: () => getOrders(),
                refetchOnWindowFocus: false
            },
            {
                queryKey: ['towns'],
                queryFn: getTowns,
                refetchOnWindowFocus: false
            }
        ]
    });



    if (ordersResult.isPending || townsResult.isPending) return <Loading></Loading>

    if (ordersResult.isError) return <span>Something went wrong: {ordersResult.error.name}</span>
    if (townsResult.isError) return <span>Something went wrong: {townsResult.error.name}</span>


    const orders = ordersResult.data.data;


    return (

        <>
            <section className="my-4 md:my-16">

                <div className="max-w-[1440px] w-[90%]  mx-auto">
                    <div className="flex flex-col">
                        {orders.length ? orders.map((order) => <>
                            <Order order={order} key={order.id}></Order>
                        </>) : <div>Здесь пока пусто...</div>}
                    </div>
                </div>
            </section>
        </>
    )
}
