import { IProductDetail } from "../../types/types";

interface Props {
    product: IProductDetail
}

const imageBaseUrl = import.meta.env.VITE_IMAGE_BASE_URL;

export default function ProductDetail({ product }: Props) {
    return (
        <div>
            <div>
                {product.name}
            </div>
            <div className="flex">
                <div className="mb-2 w-36 h-36">
                    <img loading="lazy" className="w-full h-full " src={`${imageBaseUrl}${product.image}`} ></img>
                </div>
                <div>
                    {product.description}
                </div>
            </div>
        </div>
    )
}