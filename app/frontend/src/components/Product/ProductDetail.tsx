import { IProductDetail } from "../types/types";

interface Props {
    product: IProductDetail
}
export default function ProductDetail({ product }: Props) {
    return (
        <div>
            <div>
                {product.name}
            </div>
            <div className="flex">
                <div className="w-36 h-36 mb-2">
                    <img className="w-full h-full " src={"data:image/png;base64," + product.image} ></img>
                </div>
                <div>
                    {product.description}
                </div>
            </div>
        </div>
    )
}