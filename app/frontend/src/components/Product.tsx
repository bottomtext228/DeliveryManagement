import { Link } from "react-router-dom";
import { IProduct } from "../types/types";

interface Props {
    product: IProduct
}


export default function Product({ product }: Props) {
    return (
        <article className="flex flex-col w-full h-full">
            <div className="mx-auto flex-8/10">
                <Link to={`/catalog/${product.id}`} className="">
                    <img className="rounded-xl" src={"data:image/png;base64," + product.image}>
                    </img>
                </Link>
            </div>
            <div className="ml-2 mt-2 pb-1 flex-1/12">
                <p className="font-bold">{product.price} ₽</p>
                <p className="font-semibold overflow-hidden whitespace-nowrap">{product.name}</p>
            </div>
            <button className="rounded-xl bg-amber-500 hover:bg-amber-600 w-full text-black font-semibold p-2 flex justify-center items-center">
                В корзину
            </button>
        </article>
    )
}