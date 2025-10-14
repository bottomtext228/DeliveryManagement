import Loading from "../../components/Loading/Loading";
import Order from "../../components/Order/Order";
import ErrorPage from "../../components/Error/ErrorPage";
import { useState } from "react";
import ServerError from "../../components/Error/ServerError";
import EmptyStateCard from "../../components/Common/EmptyStateCard";
import { useOrders } from "../../hooks/queries/useOrders";
import { useTowns } from "../../hooks/queries/useTowns";
import { useDeleteOrder } from "../../hooks/mutations/useDeleteOrder";

export default function Orders() {
    const [serverError, setServerError] = useState<unknown>(null);

    const ordersResult = useOrders();
    const townsResult = useTowns();

    const deleteOrder = useDeleteOrder();

    if (ordersResult.isPending || townsResult.isPending) return <Loading />

    if (ordersResult.isError) return <ErrorPage message={ordersResult.error.name} />
    if (townsResult.isError) return <ErrorPage message={townsResult.error.name} />

    const orders = ordersResult.data;

    function handleDeleteClick(id: number) {
        deleteOrder.mutate(id, {
            onError: (error) => {
                setServerError(error);
            }
        });
    }

    return (
        <>
            <section className="my-4 md:my-16">
                <div className="max-w-[1440px] w-[90%] mx-auto">
                    {serverError !== null && <ServerError error={serverError} />}
                    <div className="flex h-8 gap-8 items-end mb-8">
                        <div className="font-bold text-2xl">Ваши заказы</div>
                        <div className="">Всего: {orders.length}</div>
                    </div>
                    <div className="flex flex-col gap-y-8">
                        {
                            orders.length ? (
                                orders.map((order) => (
                                    <Order
                                        key={order.id}
                                        order={order}
                                        handleDeleteClick={handleDeleteClick}
                                    />
                                ))
                            ) : (
                                <EmptyStateCard message="Совершённые заказы будут отображаться здесь." />
                            )
                        }
                    </div>
                </div>
            </section>
        </>
    )
}
