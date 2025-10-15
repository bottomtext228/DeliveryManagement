import { CartItem, IProduct } from "../../types/types"
import CartItemCard from "./CartItemCard"
import LoadingSpinner from "../Loading/LoadingSpinner"
import { Link } from "react-router-dom"
import { useCompany } from "../../hooks/queries/useCompany"

interface Props {
    companyId: number,
    products: IProduct[],
    cartList: CartItem[],
    handleDeleteClick: (productId: number) => void,
    handleIncreaseQuantityClick: (productId: number) => void,
    handleDecreaseQuantityClick: (productId: number) => void,
}

export default function CartCompanyCard({ companyId, products, cartList, handleDeleteClick, handleIncreaseQuantityClick, handleDecreaseQuantityClick }: Props) {
    const { isPending, isError, error, data: company } = useCompany(companyId);

    if (isPending) return <LoadingSpinner></LoadingSpinner>
    
    if (isError) return <span>Error: {error.name}</span> // TODO: refactor error handling

    const calculateFinalPrice = () => {
        let price = 0;
        for (const product of products) {
            const cartItem = cartList.find(cartItem => cartItem.productId == product.id)!;
            price += product.price * cartItem.quantity;
        }
        return price;
    }

    return (
        <div className="border border-gray-200 p-3 rounded-xl">
            <div className="flex items-end gap-x-2 mb-1">
                <div className="text-sm text-neutral-600">Компания:</div>
                <h2 className="font-bold">{company.name}</h2>
            </div>
            <div className="flex flex-col">
                {products.map(product => (
                    <div key={product.id} className="py-3 first:pt-0 border-b border-neutral-200">
                        <CartItemCard
                            cartItem={cartList.find(e => e.productId == product.id)!}
                            product={product}
                            handleDeleteClick={handleDeleteClick}
                            handleIncreaseQuantityClick={handleIncreaseQuantityClick}
                            handleDecreaseQuantityClick={handleDecreaseQuantityClick}
                        ></CartItemCard>
                    </div>
                ))}
            </div>
            <div className='mt-2 flex text-lg gap-2'>
                <div className='font-semibold'>Итоговая цена:</div>
                <div className='font-medium'>{calculateFinalPrice()}₽</div>
            </div>
            <div className="mt-4 mb-2">
                <Link to={`/orders/add?ids=${products.map(e => e.id).join(',')}`} className="mr-auto bg-red-600 text-white font-semibold p-2 rounded-lg hover:bg-red-700">Заказать всё</Link>
            </div>
        </div>
    )
}
