import { IProduct } from "../../types/types";
import Product from "../../components/Product/Product";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "../../api/catalog/getAllProducts";
import Loading from "../../components/Loading/Loading";
import { useUser } from "../../hooks/useAuth";

export default function CatalogAll() {
    const user = useUser();
    const { isError, isPending, error, data } = useQuery({
        queryKey: ['products'],
        queryFn: () => getAllProducts(),
        refetchOnWindowFocus: false
    });

    if (isPending) {
        return <Loading></Loading>
    }

    if (isError) {
        return <span>Error: {error.message}</span>
    }


    const products: IProduct[] = data.data;


    return (<section className="mb-12">

        {user?.roles.includes('company') &&
            <div>
                <Link to='/catalog/add'>Добавить</Link>
            </div>
        }


        <div className="container-fluid my-5">
            <div className="row">
                <div className="col-lg-1">
                </div>
                <div className="col-lg-11">
                    Рекомендации
                </div>
            </div>
        </div>

        <div className="lg:w-5xl md:w-4xl sm:w-2xl w-[24rem]  mx-auto grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 grid-cols-2 gap-x-12 gap-y-20">
            {products.map((product, index) => {
                return <Product product={product} key={index}></Product>
            })}
        </div>

    </section>
    )
}