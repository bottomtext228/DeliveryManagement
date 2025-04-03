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

        <div className="max-w-[1440px] w-[90%]  mx-auto">
     
            {user?.roles.includes('company') &&
                <Link to='/catalog/add' className="w-fit bg-amber-500 hover:bg-amber-600 flex justify-between gap-1.5 items-center rounded-xl text-white font-semibold p-2">
                    <div className="text-lg">Добавить</div>
                    <img className="w-4 h-4" src='/plus.svg'></img>
                </Link>
            }
            
            {products.length > 0 ?
                <div className="grid lg:grid-cols-5 md:grid-cols-3 grid-cols-2 md:gap-x-12 gap-x-4 gap-y-20">
                    {products.map((product, index) => {
                        return <Product product={product} key={index}></Product>
                    })}
                </div>
                :
                <div className="mx-auto my-8 text-xl w-fit font-mono">
                    Пока тут пусто...
                </div>
            }
        </div>

    </section>
    )
}