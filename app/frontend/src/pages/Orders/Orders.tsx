import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query"
import { getOrders } from "../../api/orders/getOrders";
import Loading from "../../components/Loading/Loading";
import { getTowns } from "../../api/map/getTowns";
import Order from "../../components/Order/Order";
import { deleteOrder } from "../../api/orders/deleterOrder";

export default function Orders() {
    const queryClient = useQueryClient();
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


    const mutation = useMutation({
        mutationFn: deleteOrder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
        },
    });

    if (ordersResult.isPending || townsResult.isPending) return <Loading></Loading>

    if (ordersResult.isError) return <span>Something went wrong: {ordersResult.error.name}</span>
    if (townsResult.isError) return <span>Something went wrong: {townsResult.error.name}</span>


    const orders = ordersResult.data.data;


    function handleDeleteClick(id: number) {
        mutation.mutate(id);
    }

    return (

        <>
            <section className="my-4 md:my-16">
                <div className="max-w-[1440px] w-[90%]  mx-auto">
                    <div className="flex h-8 gap-8 items-end mb-8">
                        <div className="font-bold text-2xl">Ваши заказы</div>
                        <div className="">Всего: {orders.length}</div>
                    </div>
                    <div className="flex flex-col gap-y-8">
                        {orders.length ? orders.map((order) => <>
                            <Order order={order} handelDeleteClick={handleDeleteClick} key={order.id}></Order>
                        </>) : <div>Здесь пока пусто...</div>}
                    </div>
                </div>
            </section>
        </>
    )
}
