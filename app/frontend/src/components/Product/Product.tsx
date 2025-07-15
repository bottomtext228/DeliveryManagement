import { Link } from "react-router-dom";
import { IProduct } from "../../types/types";
import CartSection from "../Cart/CartSection";
import { getImageUrl } from "../../helpers/image.helper";

interface Props {
    product: IProduct,
    renderCart: boolean
}

export default function Product({ product, renderCart }: Props) {
    return (
        <article className="flex flex-col w-full h-full">
            <Link to={`/catalog/${product.id}`} className="mx-auto flex-8/10">
                <img className="object-contain rounded-xl" src={getImageUrl(product.image)}>
                </img>
            </Link>
            <div className="pb-1 mt-2 ml-2 flex-1/12">
                <p className="font-bold">{product.price} ₽</p>
                <p className="overflow-hidden font-semibold whitespace-nowrap">{product.name}</p>
            </div>
            {renderCart &&
                <CartSection productId={product.id}></CartSection>
            }
        </article>
    )
}