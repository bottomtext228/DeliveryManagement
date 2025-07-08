import Product from "../../components/Product/Product";
import { Link } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import Loading from "../../components/Loading/Loading";
import { useUser } from "../../hooks/useUser";
import ErrorPage from "../../components/Error/ErrorPage";
import { productsInfiniteQueryOptions } from "../../queries/products.query";
import { useEffect, useRef } from "react";

export default function CatalogAll() {
    const user = useUser();
    
    const pageSize = 10;
    const { isError, isPending, error, data, hasNextPage, isFetchingNextPage, fetchNextPage } = useInfiniteQuery(productsInfiniteQueryOptions(pageSize));

    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!loadMoreRef.current || !hasNextPage || isFetchingNextPage) return;

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                fetchNextPage();
            }
        });

        observer.observe(loadMoreRef.current);

        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage]);

    if (isPending) {
        return <Loading />
    }

    if (isError) {
        return <ErrorPage message={error.message} />
    }

    return (<section className="my-4 md:my-16">

        <div className="max-w-[1440px] w-[90%] mx-auto">

            {user?.roles.includes('company') &&
                <Link to='/catalog/add' className="mb-8 w-fit bg-amber-500 hover:bg-amber-600 flex justify-between gap-1.5 items-center rounded-xl text-white font-semibold p-2">
                    <div className="text-lg">Добавить</div>
                    <img className="w-4 h-4" src='/plus.svg'></img>
                </Link>
            }

            <div className="grid lg:grid-cols-5 md:grid-cols-3 grid-cols-2 md:gap-x-12 gap-x-4 gap-y-20">
                {data?.pages.map((page) =>
                    page.data.data.map((product) => (
                        <Product key={product.id} product={product} renderCart={user?.roles.includes('client') === true} />
                    ))
                )}
            </div>

            <div ref={loadMoreRef} className="my-8">{isFetchingNextPage && <Loading />}</div>
        </div>

    </section>
    )
}