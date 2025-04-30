import { useQuery } from "@tanstack/react-query"
import { CartItem, CreateOrderDto, IProduct } from "../../types/types"
import CartItemCard from "./CartItemCard"
import { getCompany } from "../../api/company/getCompany"
import LoadingSpinner from "../Loading/LoadingSpinner"
import { createOrder } from "../../api/orders/createOrder"

interface Props {
    companyId: number,
    products: IProduct[],
    cartList: CartItem[],
    handleDeleteClick: (productId: number) => void,
    handleIncreaseQuantityClick: (productId: number) => void,
    handleDecreaseQuantityClick: (productId: number) => void,
}

export default function CartCompanyCard({ companyId, products, cartList, handleDeleteClick, handleIncreaseQuantityClick, handleDecreaseQuantityClick }: Props) {
    const { isPending, isError, error, data } = useQuery({
        queryKey: ['company', companyId],
        queryFn: () => getCompany(companyId),
        refetchOnWindowFocus: false
    })

    if (isPending) return <LoadingSpinner></LoadingSpinner>
    if (isError) return <span>Error: {error.name}</span>

    const company = data.data;

    function handleOrderClick() {
      /*   try {
            products.forEach(product => {
                const dto: CreateOrderDto = {
                    productId: product.id,
                    quantity: cartList.find(e => e.productId == product.id)!.quantity,
                    pickUpPointTownId
                };
                createOrder(dto)
            }
        } catch (error) {

        } */
    }

    return (
        <div className="border border-gray-200 p-3 rounded-lg w-full">
            <div className="font-bold m-2">{company.name}</div>
            {products.map(product => (
                <CartItemCard
                    key={product.id}
                    cartItem={cartList.find(e => e.productId == product.id)!}
                    product={product}
                    handleDeleteClick={handleDeleteClick}
                    handleIncreaseQuantityClick={handleIncreaseQuantityClick}
                    handleDecreaseQuantityClick={handleDecreaseQuantityClick}
                ></CartItemCard>
            ))}
            <div className="my-8">
                <button onClick={handleOrderClick} className="mr-auto bg-red-600 text-white font-semibold p-2 rounded-lg hover:bg-red-700">Заказать всё</button>
            </div>
        </div>
    )
}
