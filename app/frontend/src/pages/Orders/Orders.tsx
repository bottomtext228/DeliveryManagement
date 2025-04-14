import { useQuery } from "@tanstack/react-query"
import { getOrders } from "../../api/orders/getOrders";
import Loading from "../../components/Loading/Loading";

export default function Orders() {
    const { isError, isPending, error, data } = useQuery({
        queryKey: ['orders'],
        queryFn: () => getOrders(),
        refetchOnWindowFocus: false
    });

    if (isPending) return <Loading></Loading>

    if (isError) return <span>Something went wrong: {error.name}</span>

    const orders = data.data;


    return (

        <>
            {orders.length ? orders.map((order) => <>
                <div key={order.id}>
                    {order.id}
                </div>

            </>) : <div>Здесь пока пусто...</div>}

        </>
    )
}
