import React, { useEffect, useRef, useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { RouteChoice, CreateOrderDto, IProductDetail, ComputeRouteRequest, ProductOrderDto, ComputeRouteResponse } from '../../types/types';
import Loading from '../../components/Loading/Loading';
import { computeRoute } from '../../api/map/computeRoute';
import { formatHours } from '../../helpers/format.helper';
import { getImageUrl } from '../../helpers/image.helper';
import ErrorPage from '../../components/Error/ErrorPage';
import ServerError from '../../components/Error/ServerError';
import { useCreateOrder } from '../../hooks/mutations/useCreateOrder';
import { useProductsDetail } from '../../hooks/queries/useProductsDetail';
import { useCompanyPickUpPoints } from '../../hooks/queries/useCompanyPickUpPoints';
import { CloseButton } from '../../components/Common/CloseButton';
import QuantityController from '../../components/Common/QuantityController';
import Button from '../../components/Common/Button';
import DropdownIcon from '../../components/Common/DropdownIcon';
import { useSetCartItem } from '../../hooks/mutations/useSetCartItem';
import { useCart } from '../../hooks/queries/useCart';

interface FormValues {
    productId: number,
    pickUpPointTownId: number,
    choice: RouteChoice,
    quantity: number
}

export default function OrderAdd() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormValues>();
    const [serverError, setServerError] = useState<unknown>(null);
    const [previewOrderData, setPreviewOrderData] = useState<ComputeRouteResponse | null>(null);

    const pickUpPointTownIdRef = useRef<HTMLSelectElement>(null);
    const routeChoiceRef = useRef<HTMLSelectElement>(null);

    const setCartItem = useSetCartItem();
    const cartQuery = useCart();

    const [productsQuantities, setProductsQuantities] = useState<Record<number, number>>({});

    // get ids from the search params
    const isValidId = (id: string) => /^\d+$/.test(id);
    const ids = (searchParams.get("ids")?.split(",") || []).filter(isValidId).map(id => Number(id));
    const hasValidIds = ids.length > 0;

    const productQueries = useProductsDetail(ids);

    const products = productQueries.map((e) => e.data).filter((product): product is IProductDetail => !!product);

    const createOrder = useCreateOrder();

    const updateQuantity = (id: number, amount: number) => {
        setProductsQuantities((prev) => ({
            ...prev,
            [id]: Math.min(100, Math.max(1, amount))
        }));
    };

    const getProductQuantity = (id: number) => {
        return productsQuantities[id] ?? 1;
    };

    const incrementQuantity = (id: number) => {
        updateQuantity(id, getProductQuantity(id) + 1);
    };

    const decrementQuantity = (id: number) => {
        updateQuantity(id, getProductQuantity(id) - 1);
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

    const pickUpPointsQuery = useCompanyPickUpPoints(companyId);

    const isPending = productQueries.some(e => e.isPending) || pickUpPointsQuery.isPending || cartQuery.isPending;
    const isError = productQueries.some(e => e.isError) || pickUpPointsQuery.isError || cartQuery.isError;

    useEffect(() => {
        cartQuery.refetch(); // refetch cart to be sure that initial quantities are right
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const cart = cartQuery.data;


    // set products quantities after getting all info
    useEffect(() => {
        if (products.length > 0 && cart) {
            const initialQuantities: Record<number, number> = {};
            products.forEach((product) => {
                initialQuantities[product.id] = cart.cartItems.find(item => item.productId == product.id)?.quantity || 1;
            });

            setProductsQuantities(initialQuantities);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPending, cart]);

    if (!hasValidIds) return <ErrorPage error='Invalid IDs in URL.' />

    if (!validOrder) return <ErrorPage error='Products must be from the same company and there must be no duplicates.' />;

    if (isPending) return <Loading />;

    if (isError) {
        const error = productQueries.find(e => e.error)?.error || pickUpPointsQuery.error || cartQuery.error;
        return <ErrorPage error={error} />;
    }

    const pickUpPoints = pickUpPointsQuery.data;

    const onSubmit: SubmitHandler<FormValues> = async (data, e) => {
        e?.preventDefault();

        const items: ProductOrderDto[] = products.map(e => ({ productId: e.id, quantity: getProductQuantity(e.id) }));

        const dto: CreateOrderDto = {
            products: items,
            pickUpPointTownId: data.pickUpPointTownId,
            choice: data.choice ? data.choice : RouteChoice.Fastest,
        };

        createOrder.mutate(dto, {
            onSuccess: () => {
                products.forEach(e => setCartItem.mutate({ productId: e.id, quantity: 0 }) /* removeFromCart(e.id) */); // remove from cart products that we ordered
                navigate('/orders');
            },
            onError: (error) => {
                setServerError(error);
            }
        });
    }

    const handleChange: React.ChangeEventHandler<HTMLFormElement> = async () => {
        if (!pickUpPointTownIdRef.current) return;

        const pickUpPointTownId = parseInt(pickUpPointTownIdRef.current.value);
        const routeChoice = routeChoiceRef?.current?.value as RouteChoice ?? RouteChoice.Fastest;

        if (pickUpPointTownId == 0) return; // default value;

        // manually setting the form values for react-hook-form because of the onChange
        setValue('pickUpPointTownId', pickUpPointTownId);
        setValue('choice', routeChoice);

        const dto: ComputeRouteRequest = {
            companyId: companyId!,
            pickUpPointTownId: pickUpPointTownId,
            choice: routeChoice
        }
        try {
            const response = await computeRoute(dto);
            setPreviewOrderData(response.data);
        } catch (error) {
            setServerError(error);
        }
    }

    const calculateFinalPrice = () => {
        let price = 0;
        for (const product of products) {
            const quantity = productsQuantities[product.id];
            price += product.price * quantity;
        }
        return price;
    }

    return (
        <>
            <div className="md:my-16 my-4 max-w-md w-[90%] mx-auto">
                {serverError !== null && <ServerError error={serverError} />}
                <div className="p-6 border border-gray-300 rounded-2xl">
                    <form onSubmit={handleSubmit(onSubmit)} onChange={handleChange}>
                        <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-bold text-neutral-800">Новый заказ</h3>
                            <button type='button' className='w-4 h-4' onClick={() => navigate(-1)}>
                                <CloseButton />
                            </button>
                        </div>

                        <div className='flex flex-col gap-5 my-4'>
                            {products.map(product => {
                                return (
                                    <div key={product.id} className='flex gap-2' >
                                        <div className='w-16 h-16'><img className='w-full h-full' src={getImageUrl(product.image)} alt={product.name} /></div>
                                        <div className="flex flex-col">
                                            <div className="font-bold ">{product.name}</div>
                                            <QuantityController
                                                price={product.price}
                                                quantity={getProductQuantity(product.id)}
                                                onDecrease={() => decrementQuantity(product.id)}
                                                onIncrease={() => incrementQuantity(product.id)}
                                            />
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
                                <DropdownIcon />
                            </div>
                        </div>

                        {previewOrderData?.isRoutesEqual === false && <>
                            <div className="text-sm text-neutral-600">* Доступно несколько маршрутов!</div>
                            <div className="my-4 flex flex-col gap-2">
                                <label htmlFor="choice" className="font-semibold">
                                    Выберите маршрут:
                                </label>
                                <div className="relative">
                                    <select
                                        id="choice"
                                        {...register('choice', { required: 'Необходимо выбрать маршрут!' })}
                                        className="w-full appearance-none rounded-lg border cursor-pointer border-gray-300 bg-white px-4 py-3 pr-10 text-gray-800 shadow-sm transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                        defaultValue={RouteChoice.Fastest}
                                        ref={routeChoiceRef}
                                    >
                                        <option value={RouteChoice.Fastest} className='font-medium'>Быстрый</option>
                                        <option value={RouteChoice.Cheapest} className='font-medium'>Дешевый</option>
                                    </select>
                                    <DropdownIcon />
                                </div>
                            </div>
                        </>
                        }
                        {previewOrderData &&
                            (<>
                                <div className='flex flex-col gap-1 mb-4'>
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
                                <Button label="Создать" fontWeight="semibold" fontSize="xl" />
                            </>)
                        }
                    </form >
                </div >
            </div >
        </>)
}
