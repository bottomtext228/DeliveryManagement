import { Link } from "react-router-dom";
import { CartItem, IProduct } from "../../types/types";
import CartSection from "../Cart/CartSection";
import { getImageUrl } from "../../helpers/image.helper";

interface Props {
    product: IProduct,
    renderCart: boolean,
    cartItem?: CartItem
}

export default function Product({ product, renderCart, cartItem }: Props) {
    return (
        <article className="flex flex-col w-full h-full min-h-60 md:min-h-85 max-h-120 rounded-xl border border-gray-300 p-2">
            <Link to={`/catalog/${product.id}`} className="mx-auto flex-8/10 h-10">
                <img className="object-contain rounded-xl  max-h-full" src={getImageUrl(product.image)} alt={product.name} draggable={false}>
                </img>
            </Link>
            <div className="pb-1 mt-2 ml-2 flex-1/12">
                <p className="font-bold">{product.price} ₽</p>
                <div className="flex flex-col sm:flex-row overflow-hidden whitespace-nowrap">
                    <p className="font-semibold">{product.name}</p>
                    <span className="text-neutral-300 inline-block overflow-hidden text-ellipsis whitespace-nowrap"><span className="mx-1">/</span>{product.companyName}</span>
                </div>
            </div>
            {renderCart &&
                <CartSection productId={product.id} cartItem={cartItem}></CartSection>
            }
        </article>
    )
}