import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query"
import Loading from "../../components/Loading/Loading";
import Order from "../../components/Order/Order";
import { deleteOrder } from "../../api/orders/deleterOrder";
import { townsQueryOptions } from "../../queries/towns.query";
import { ordersQueryOptions } from "../../queries/orders.query";
import ErrorPage from "../../components/Error/ErrorPage";

export default function Orders() {
    const queryClient = useQueryClient();

    const [ordersResult, townsResult] = useQueries({
        queries: [
            ordersQueryOptions(),
            townsQueryOptions()
        ]
    });


    const mutation = useMutation({
        mutationFn: deleteOrder,
        onSuccess: () => {
            queryClient.invalidateQueries(ordersQueryOptions());
        },
    });

    if (ordersResult.isPending || townsResult.isPending) return <Loading />

    if (ordersResult.isError) return <ErrorPage message={ordersResult.error.name} />
    if (townsResult.isError) return <ErrorPage message={townsResult.error.name} />

    const orders = ordersResult.data.data;


    function handleDeleteClick(id: number) {
        mutation.mutate(id);
    }

    return (

        <>
            <section className="my-4 md:my-16">
                <div className="max-w-[1440px] w-[90%] mx-auto">
                    <div className="flex h-8 gap-8 items-end mb-8">
                        <div className="font-bold text-2xl">Ваши заказы</div>
                        <div className="">Всего: {orders.length}</div>
                    </div>
                    <div className="flex flex-col gap-y-8">
                        {orders.length ? orders.map((order) =>
                            <Order key={order.id} order={order} handleDeleteClick={handleDeleteClick}></Order>
                        ) : <div>Здесь пока пусто...</div>}
                    </div>
                </div>
            </section>
        </>
    )
}
