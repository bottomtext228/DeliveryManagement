import { queryOptions } from "@tanstack/react-query"
import { getProductDetail } from "../api/catalog/getProduct"

export const productDetailQueryOptions = (id: number) => queryOptions({
    queryKey: ['product', id],
    queryFn: () => getProductDetail(id)
}
)
