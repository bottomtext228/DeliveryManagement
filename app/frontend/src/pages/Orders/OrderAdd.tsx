import { isAxiosError } from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { IHtppValidationProblemDetails, RouteChoice, CreateOrderDto, IProductDetail, ComputeRouteRequest, ProductOrderDto, ComputeRouteResponse } from '../../types/types';
import { useQueries, useQuery } from '@tanstack/react-query';
import { getProductDetail } from '../../api/catalog/getProduct';
import Loading from '../../components/Loading/Loading';
import { getCompanyPickUpPoints } from '../../api/pickUpPoint/getCompanyPickUpPoints';
import { createOrder } from '../../api/orders/createOrder';
import useCartStore from '../../store/user/cartStore';
import { computeRoute } from '../../api/map/computeRoute';
import { formatHours } from '../../helpers/format.helper';



interface FormValues {
    productId: number,
    pickUpPointTownId: number,
    choice: RouteChoice,
    quantity: number
}



export default function OrderAdd() {
    const [searchParams] = useSearchParams();

    const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormValues>();
    const [serverError, setServerError] = useState<IHtppValidationProblemDetails | null>(null);
    const [previewOrderData, setPreviewOrderData] = useState<ComputeRouteResponse | null>(null);

    const pickUpPointTownIdRef = useRef<HTMLSelectElement>(null);
    const routeChoiceRef = useRef<HTMLSelectElement>(null);

    const removeFromCart = useCartStore(store => store.remove);
    const cartList = useCartStore(store => store.list);

    const [productsQuantities, setProductsQuantities] = useState<Record<number, number>>({});

    const navigate = useNavigate();
    const isValidId = (id: string) => /^\d+$/.test(id);
    const ids = (searchParams.get("ids")?.split(",") || []).filter(isValidId);


    const hasValidIds = ids.length > 0;


    const productQueries = useQueries({
        queries: hasValidIds ? ids.map((id) => ({
            queryKey: ["product", id],
            queryFn: () => getProductDetail(parseInt(id)!),
        })) : []
    });

    const products = productQueries.map((q) => q.data?.data).filter((product): product is IProductDetail => !!product);

    useEffect(() => {
        if (products.length > 0 && Object.keys(productsQuantities).length === 0) {
            const initialQuantities: Record<number, number> = {};
            products.forEach((product) => {
                initialQuantities[product.id] = cartList.find(item => item.productId == product.id)?.quantity || 1;
            });
            setProductsQuantities(initialQuantities);
        }
    }, [products, productsQuantities]);

    const updateQuantity = (id: number, amount: number) => {
        setProductsQuantities((prev) => ({
            ...prev,
            [id]: Math.min(100, Math.max(1, amount))
        }));
    };

    const incrementQuantity = (id: number) => {
        updateQuantity(id, (productsQuantities[id] || 1) + 1);
    };

    const decrementQuantity = (id: number) => {
        updateQuantity(id, (productsQuantities[id] || 1) - 1);
    };

    const checkSameCompany = (products: IProductDetail[]) => {
        const companies = new Set(products.map((p) => p.companyId));
        return companies.size <= 1;
    };

    const checkDuplicatedProducts = (products: IProductDetail[]) => {
        const set = new Set(products);
        return set.size == products.length;
    }

    const validOrder = checkSameCompany(products) && checkDuplicatedProducts(products);
    const companyId = validOrder ? products[0]?.companyId : null;

    const pickUpPointsQuery = useQuery({
        queryKey: ["pickuppoints", companyId],
        queryFn: () => getCompanyPickUpPoints(companyId!),
        refetchOnWindowFocus: false,
        enabled: !!companyId,
    });

    const isPending = productQueries.some((q) => q.isPending) || pickUpPointsQuery.isPending;
    const isError = productQueries.some((q) => q.isError) || pickUpPointsQuery.isError;

    if (!hasValidIds) {
        return <div className="p-4 text-red-500">No valid product IDs provided in the URL.</div>;
    }

    if (!validOrder) return <div className="p-4 text-red-500">Products must be from the same company and there must be no duplicates.</div>;

    if (isPending) return <Loading></Loading>;
    if (isError) return <div>Error loading page.</div>;



    const pickUpPoints = pickUpPointsQuery?.data.data;

    const onSubmit: SubmitHandler<FormValues> = async (data, e) => {
        e?.preventDefault();

        const items: ProductOrderDto[] = products.map(e => ({ productId: e.id, quantity: productsQuantities[e.id] }));

        const dto: CreateOrderDto = {
            products: items,
            pickUpPointTownId: data.pickUpPointTownId,
            choice: parseInt(data.choice.toString()), // enums must be numbers
        };

        try {
            await createOrder(dto);
            items.forEach(item => removeFromCart(item.productId)); // remove from cart products that we ordered
            navigate('/orders');
        } catch (error) {
            if (isAxiosError(error)) {
                setServerError(error.response?.data);
            }
            console.error(error);
        }
    }

    const handleChange: React.ChangeEventHandler<HTMLFormElement> = async (e: React.ChangeEvent<HTMLFormElement>) => {
        const pickUpPointTownId = parseInt(pickUpPointTownIdRef.current?.value!);
        const routeChoice = parseInt(routeChoiceRef.current?.value!);

        if (pickUpPointTownId == 0) return; // default value;

        // manually setting the form values for react-hook-form because of the onChange
        setValue('pickUpPointTownId', pickUpPointTownId);
        setValue('choice', routeChoice);

        const dto: ComputeRouteRequest = {
            companyId: companyId!,
            pickUpPointTownId: pickUpPointTownId, choice: routeChoice
        }
        try {
            const response = await computeRoute(dto);
            setPreviewOrderData(response.data);
        } catch (error) {
            if (isAxiosError(error)) {
                setServerError(error.response?.data);
            }
            console.error(error);
        }
    }

    const calculateFinalPrice = () => {
        let price = 0;
        for (const product of products) {
            /*   const cartItem = cartList.find(cartItem => cartItem.productId == product.id)!; */
            const quantity = productsQuantities[product.id];
            price += product.price * quantity;
        }
        return price;
    }


    /*     function handleIncreaseQuantityClick(productId: number) {
            const cartItem = cartList.find(e => e.productId == productId);
            if (cartItem && cartItem.quantity < 100) addToCart(productId);
        }
    
        function handleDecreaseQuantityClick(productId: number) {
            const cartItem = cartList.find(e => e.productId == productId);
            if (cartItem && cartItem.quantity > 1) removeFromCart(productId, true);
        }
     */


    return (
        <>
            <div className="md:my-16 my-4 max-w-md w-[90%] mx-auto">
                {serverError ?
                    <div className="p-4 my-4 text-black border border-gray-300 shadow-md rounded-2xl h-fit">
                        <div>
                            {serverError.errors && Object.keys(serverError.errors).map(key => <li key={key}>{(serverError.errors as any)[key]}</li>)}
                        </div>
                    </div> : <></>}
                <div className="p-6 border border-gray-300 rounded-2xl">
                    <form onSubmit={handleSubmit(onSubmit)} onChange={handleChange}>
                        <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-bold text-neutral-800">Новый заказ</h3>
                            {/* <Link className='w-4 h-4' to='/catalog'><img className='duration-150 opacity-50 transient-colors hover:opacity-70' src="/cross.svg"></img></Link> */}
                            <button type='button' className='w-4 h-4' onClick={() => navigate(-1)}><img className='duration-150 opacity-50 transient-colors hover:opacity-70' src="/cross.svg"></img></button>
                        </div>

                        <div className='flex flex-col gap-5 my-4'>
                            {products.map(product => {
                                return (
                                    <div key={product.id} className='flex gap-2' >
                                        <div className='w-16 h-16'><img className='w-full h-full' src={product.image} alt={product.name} /></div>
                                        <div className='flex flex-col w-full'>
                                            <div className='font-bold'>{product.name}</div>
                                            <div className='flex gap-1'>
                                                <div>{product.price}&times;</div>
                                                <div className="flex justify-center items-center gap-x-3 h-fit w-fit">
                                                    <button type='button' onClick={() => decrementQuantity(product.id)}
                                                        className="before:w-4 before:h-1 before:bg-neutral-600 hover:before:bg-neutral-900 before:absolute flex items-center justify-center w-8 h-8 rounded-full border-gray-200 border shadow duration-3000 transition-all">
                                                    </button>
                                                    <div>
                                                        {productsQuantities[product.id]}
                                                    </div>
                                                    <button type='button' onClick={() => incrementQuantity(product.id)}
                                                        className="before:w-4 before:h-1 before:bg-neutral-600 hover:before:bg-neutral-900 after:w-4 after:h-1 after:bg-neutral-600 hover:after:bg-neutral-900 after:rotate-90 before:absolute flex items-center justify-center w-8 h-8 rounded-full border-gray-200 border shadow">
                                                    </button>
                                                </div>
                                                <span>=</span>
                                                <div className='font-semibold'>{productsQuantities[product.id] * product.price}₽</div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>


                        <div className="my-4 flex flex-col gap-2">
                            <label htmlFor="pickUpPointTownId" className="font-semibold">
                                Пункт выдачи заказов:
                            </label>
                            <div className="relative">
                                <select
                                    id="pickUpPointTownId"
                                    {...register('pickUpPointTownId', { required: 'Необходимо выбрать город!' })}
                                    className="w-full appearance-none rounded-lg border cursor-pointer border-gray-300 bg-white px-4 py-3 pr-10 text-gray-800 shadow-sm transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                    defaultValue={0}
                                    ref={pickUpPointTownIdRef}
                                >
                                    <option disabled hidden value={0}>Выберите город</option>
                                    {pickUpPoints.map(e => (
                                        <option key={e.id} value={e.townId} className="font-medium">
                                            {e.townName}
                                        </option>
                                    ))}
                                </select>
                                {errors.pickUpPointTownId && <div className='text-red-500'>{errors.pickUpPointTownId.message}</div>}
                                {/* Dropdown Icon */}
                                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z" />
                                    </svg>
                                </div>
                            </div>
                        </div>


                        <div className="my-4 flex flex-col gap-2">
                            <label htmlFor="choice" className="font-semibold">
                                Выберите маршрут:
                            </label>
                            <div className="relative">
                                <select
                                    id="choice"
                                    {...register('choice', { required: 'Необходимо выбрать маршрут!' })}
                                    className="w-full appearance-none rounded-xl border cursor-pointer border-gray-300 bg-white px-4 py-3 pr-10 text-gray-800 shadow-sm transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                    defaultValue={RouteChoice.Fastest}
                                    ref={routeChoiceRef}
                                >
                                    <option value={RouteChoice.Fastest} className='font-medium'>Быстрый</option>
                                    <option value={RouteChoice.Cheapest} className='font-medium'>Дешевый</option>
                                </select>
                                {/* Dropdown Icon */}
                                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z" />
                                    </svg>
                                </div>
                            </div>
                            {previewOrderData?.isRoutesEqual && <div className='text-sm text-neutral-600'>* Маршруты одинаковы</div>}
                        </div>

                        {previewOrderData &&
                            (<>
                                <div className='flex flex-col gap-1'>
                                    <div className='flex gap-2'>
                                        <div className='font-semibold'>Стоимость доставки:</div>
                                        <div className='font-medium'>{previewOrderData.shippingPrice}₽</div>
                                    </div>
                                    <div className='flex gap-2'>
                                        <div className='font-semibold'>Время доставки:</div>
                                        <div className='font-medium'>{formatHours(previewOrderData.shippingTime)}</div>
                                    </div>
                                    <div className='mt-2 flex text-lg gap-2'>
                                        <div className='font-semibold'>Итоговая цена:</div>
                                        <div className='font-medium'>{calculateFinalPrice() + previewOrderData.shippingPrice}₽</div>
                                    </div>
                                </div>
                                <button type="submit" className="w-full p-2 mt-4 text-xl font-semibold text-white rounded-lg cursor-pointer bg-amber-400 hover:bg-amber-500 transition-colors duration-150">
                                    Создать
                                </button>
                            </>)
                        }
                    </form >
                </div >
            </div >
        </>)
}
