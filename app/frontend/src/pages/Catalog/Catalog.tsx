import Product from "../../components/Product/Product";
import { Link } from "react-router-dom";
import Loading from "../../components/Loading/Loading";
import { useUser } from "../../hooks/useUser";
import ErrorPage from "../../components/Error/ErrorPage";
import { useEffect, useRef, useState } from "react";
import { ProductSortBy } from "../../types/types";
import { useProducts } from "../../hooks/queries/useProducts";

export default function CatalogAll() {
    const user = useUser();

    // filtering and sorting
    const [formName, setFormName] = useState('');
    const [formMinPrice, setFormMinPrice] = useState('');
    const [formMaxPrice, setFormMaxPrice] = useState('');
    const [formSortBy, setFormSortBy] = useState<ProductSortBy>(ProductSortBy.Id);
    const [formSortIsDescending, setFormSortIsDescending] = useState(false);

    const [name, setName] = useState('');
    const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
    const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
    const [sortBy, setSortBy] = useState<ProductSortBy>(ProductSortBy.Id);
    const [sortIsDescending, setSortIsDescending] = useState(false);


    const pageSize = 20;

    const { isError, isPending, error, data, hasNextPage, isFetchingNextPage, fetchNextPage } = useProducts(
        pageSize,
        name,
        minPrice,
        maxPrice,
        sortBy,
        sortIsDescending);

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
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);


    if (isError) {
        return <ErrorPage message={error.message} />
    }

    const handleOnNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormName(e.target.value);
    }

    const handleOnMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormMinPrice(e.target.value);
    }

    const handleOnMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormMaxPrice(e.target.value);
    }

    const handleOnSortTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const [sortKey, sortOrder] = e.target.value.split('_');
        setFormSortBy(sortKey as ProductSortBy);
        setFormSortIsDescending(sortOrder === 'desc');
    }

    const handleOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleOnApplyFilters();
        }
    }

    const handleOnApplyFilters = () => {
        setName(formName);
        setMinPrice(formMinPrice ? +formMinPrice : undefined);
        setMaxPrice(formMaxPrice ? +formMaxPrice : undefined);
        setSortBy(formSortBy);
        setSortIsDescending(formSortIsDescending)
    }

    return (<section className="my-4 md:my-16">

        <div className="max-w-[1440px] w-[90%] mx-auto">
            <div className="flex flex-col gap-2 rounded-xl p-2 border-amber-500 border-2 md:w-[60%] mx-auto my-4 md:my-16">

                <label htmlFor="name"></label>
                <input id="name" type="text" value={formName} placeholder="Поиск" autoComplete="on" onChange={handleOnNameChange} onKeyDown={handleOnKeyDown}
                    className="border border-[#d9d9d9] p-2 rounded-xl outline-none w-full" />

                <div className="flex md:flex-row flex-col md:items-center gap-1.5">
                    <div className="">Цена:</div>
                    <label htmlFor="minprice">От</label>
                    <input id="minprice" type="number" value={formMinPrice} placeholder="0" onChange={handleOnMinPriceChange} onKeyDown={handleOnKeyDown}
                        className="md:w-32 w-full border p-2 rounded-xl outline-none focus:bg-transparent hover:bg-transparent bg-neutral-50 border-[#d9d9d9]" />
                    <label htmlFor="maxprice">До</label>
                    <input id="maxprice" type="number" value={formMaxPrice} placeholder="1 000 000" onChange={handleOnMaxPriceChange} onKeyDown={handleOnKeyDown}
                        className="md:w-32 w-full border p-2 rounded-xl outline-none focus:bg-transparent hover:bg-transparent bg-neutral-50 border-[#d9d9d9]" />
                </div>

                <div className="flex gap-2 items-center">
                    <label htmlFor="sortby">Сортировка:</label>
                    <select id="sortby"
                        className=" w-fit appearance-none rounded-lg  cursor-pointer outline-none text-blue-600 hover:text-blue-700 focus:text-blue-700"
                        value={`${formSortBy}_${formSortIsDescending ? 'desc' : 'asc'}`} onChange={handleOnSortTypeChange}>
                        <option className="font-medium text-black" value={ProductSortBy.Id + "_asc"}>по умолчанию</option>
                        <option className="font-medium text-black" value={ProductSortBy.Price + "_asc"}>по наименьшей цене</option>
                        <option className="font-medium text-black" value={ProductSortBy.Price + "_desc"}>по наибольшей цене</option>
                        <option className="font-medium text-black" value={ProductSortBy.Name + "_asc"}>по алфавиту</option>
                        <option className="font-medium text-black" value={ProductSortBy.Name + "_desc"}>по обратному алфавиту</option>
                    </select>
                </div>

                <button onClick={handleOnApplyFilters} className="rounded-xl text-xl p-2 mt-2 bg-amber-500 hover:bg-amber-600 font-semibold w-full">Искать</button>
            </div>


            {user?.roles.includes('company') &&
                <Link to='/catalog/add' className="mb-8 w-fit bg-amber-500 hover:bg-amber-600 flex justify-between gap-1.5 items-center rounded-xl text-white font-semibold p-2">
                    <div className="text-lg">Добавить</div>
                    <img className="w-4 h-4" src='/plus.svg'></img>
                </Link>
            }

            {!isPending && (data?.pages[0]?.data.totalCount !== 0 ? data?.pages.map((page, index) => {
                const isUser = user?.roles.includes('client') === true;
                return (
                    <div key={index} className="grid lg:grid-cols-5 md:grid-cols-3 grid-cols-2 md:gap-x-12 gap-x-4 gap-y-20">
                        {page.data.data.map((product) => (
                            <Product key={product.id} product={product} renderCart={isUser} />
                        ))}
                    </div>
                )
            }
            ) : <>
                <div className="flex flex-col items-start w-full gap-y-2">
                    <h2 className="text-4xl font-semibold">Ничего не найдено...</h2>
                    <div>Попробуйте изменить фильтры.</div>
                    <small>&#40;А может быть товаров и вовсе нет&#41;</small>
                </div>
            </>)
            }


            <div ref={loadMoreRef} className="my-8">{isFetchingNextPage && <Loading />}</div>
        </div>

    </section>
    )
}