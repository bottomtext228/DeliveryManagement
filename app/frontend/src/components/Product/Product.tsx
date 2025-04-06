import { Link } from "react-router-dom";
import { IProduct } from "../../types/types";

interface Props {
    product: IProduct,
    renderCart: boolean
}


export default function Product({ product, renderCart }: Props) {
    return (
        <article className="flex flex-col w-full h-full">
            <div className="mx-auto flex-8/10">
                <Link to={`/catalog/${product.id}`} className="">
                    <img className="rounded-xl" src={"data:image/png;base64," + product.image}>
                    </img>
                </Link>
            </div>
            <div className="pb-1 mt-2 ml-2 flex-1/12">
                <p className="font-bold">{product.price} ₽</p>
                <p className="overflow-hidden font-semibold whitespace-nowrap">{product.name}</p>
            </div>
            {renderCart &&
                <button className="flex items-center justify-center w-full p-2 font-semibold text-black rounded-xl bg-amber-500 hover:bg-amber-600">
                    В корзину
                </button>
            }
        </article>
    )
}