import { Link } from "react-router-dom";
import { IProduct } from "../../types/types";
import CartSection from "../Cart/CartSection";

interface Props {
    product: IProduct,
    renderCart: boolean
}

const imageBaseUrl = import.meta.env.VITE_IMAGE_BASE_URL;


export default function Product({ product, renderCart }: Props) {
    return (
        <article className="flex flex-col w-full h-full">
            <div className="mx-auto flex-8/10">
                <Link to={`/catalog/${product.id}`} className="">
                    <img className="rounded-xl" src={`${imageBaseUrl}${product.image}`}>
                    </img>
                </Link>
            </div>
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