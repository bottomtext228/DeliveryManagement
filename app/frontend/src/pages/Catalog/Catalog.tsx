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


    return (<section className="my-4 md:my-16">

   {/*      {user?.roles.includes('company') &&
            <div>
                <Link to='/catalog/add'>Добавить</Link>
            </div>
        }


        <div className="my-5 container-fluid">
            <div className="row">
                <div className="col-lg-1">
                </div>
                <div className="col-lg-11">
                    Рекомендации
                </div>
            </div>
        </div> */}

        <div className="max-w-[1440px] w-[90%]  mx-auto grid lg:grid-cols-5 md:grid-cols-3 grid-cols-2 md:gap-x-12 gap-x-4 gap-y-20">
            {products.map((product, index) => {
                return <Product product={product} key={index}></Product>
            })}
        </div>

    </section>
    )
}