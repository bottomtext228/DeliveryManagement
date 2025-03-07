import { IProduct } from "../../types/types";
import Product from "../../components/Product/Product";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "../../api/catalog/getAllProducts";

export default function CatalogAll() {

    const { isError, isPending, error, data } = useQuery({
        queryKey: ['products'],
        queryFn: () => getAllProducts(),
        refetchOnWindowFocus: false
    });

    if (isPending) {
        return <span>Loading...</span>
    }

    if (isError) {
        return <span>Error: {error.message}</span>
    }


    const products: IProduct[] = data.data;


    return (<section className="mb-12">
        <div>
            <Link to='/catalog/add'>Добавить</Link>
        </div>



        <div className="container-fluid my-5">
            <div className="row">
                <div className="col-lg-1">
                </div>
                <div className="col-lg-11">
                    Рекомендации
                </div>
            </div>
        </div>

        <div className="lg:w-5xl md:w-4xl sm:w-2xl w-36  mx-auto grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 gap-x-12 gap-y-20">
            {products.map((product, index) => {
                return <Product product={product} key={index}></Product>
            })}
        </div>

    </section>
    )
}