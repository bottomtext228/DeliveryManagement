import { isAxiosError } from 'axios';
import React, { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form';
import { data, Link, useNavigate, useParams } from 'react-router-dom';
import { createProduct } from '../../api/catalog/createProduct';
import { IHtppValidationProblemDetails, CreateProductDto, RouteChoice, CreateOrderDto, IProduct, IProductDetail } from '../../types/types';
import { useQueries, useQuery } from '@tanstack/react-query';
import { getProductDetail } from '../../api/catalog/getProduct';
import Loading from '../../components/Loading/Loading';
import { getPickUpPoints } from '../../api/map/getPickUpPoints';
import { getCompanyPickUpPoints } from '../../api/map/getCompanyPickUpPoints';
import { createOrder } from '../../api/orders/createOrder';
import useCartStore from '../../store/user/cartStore';
import NotFound from '../NotFound';



interface FormValues {
    pickUpPointTownId: number,
    choice: RouteChoice,
}


export default function OrdersAdd() {
    const addToCart = useCartStore(store => store.add);
    const removeFromCart = useCartStore(store => store.remove);
    const cartList = useCartStore(store => store.list);
    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();
    const [serverError, setServerError] = useState<IHtppValidationProblemDetails | null>(null);

    const params = useParams();
    const companyId = Number(params.companyId);

    const productQueries = useQueries({
        queries: cartList.map((item) => ({
            queryKey: ['product', item.productId],
            queryFn: () => getProductDetail(item.productId),
        })),
    });

    const pickUpPointsQuery = useQuery({
        queryKey: ['pickuppoints', companyId],
        queryFn: () => getCompanyPickUpPoints(companyId),
        refetchOnWindowFocus: false,
        enabled: !!companyId
    })

    if (isNaN(companyId)) return <NotFound></NotFound>;

    const isLoading = productQueries.some((q) => q.isLoading) || pickUpPointsQuery.isLoading;
    const isError = productQueries.some((q) => q.isError) || pickUpPointsQuery.isError;
    const error = productQueries.some((q) => q.error) || pickUpPointsQuery.error;

    const products = productQueries.map((q) => q.data?.data).filter((product): product is IProductDetail => !!product);

    const orderItems = products.filter(e => e.companyId == companyId);

    if (isLoading) return <Loading></Loading>

    if (isError) {
        console.error(error);
        return <span>Error. Check console for more info.</span>
    }


    const pickUpPoints = pickUpPointsQuery.data?.data!;

    const onSubmit: SubmitHandler<FormValues> = async (data, e) => {
        e?.preventDefault();

        for (const item of orderItems) {
            const dto: CreateOrderDto = {
                productId: item.id,
                pickUpPointTownId: data.pickUpPointTownId,
                choice: parseInt(data.choice.toString()), // enums must be numbers
                quantity: cartList.find(e => e.productId == item.id)?.quantity!
            };

            try {
                await createOrder(dto);
            /*     navigate('/orders'); */
            } catch (error) {
                if (isAxiosError(error)) {
                    setServerError(error.response?.data);
                }
                console.error(error);
            }
        }
    }


    const calculateFinalPrice = () => {
        let price = 0;
        for (let i = 0; i < orderItems.length; i++) {
            price += orderItems[i].price;
        }
        return price;
    }

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
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-bold text-neutral-800">Новый заказ</h3>
                            <Link className='w-4 h-4' to='/catalog'><img className='duration-150 opacity-50 transient-colors hover:opacity-70' src="/cross.svg"></img></Link>
                        </div>

                        <div>
                            {orderItems.map(e => (
                                <div key={e.id}>
                                    <div className='w-16 h-16'><img className='w-full h-full' src={e.image} alt={e.name} /></div>
                                    <div>{e.name}</div>
                                </div>
                            ))}
                        </div>

                        <label htmlFor="choice">Пункт выдачи заказов:</label>
                        <select className="outline-none" id="pickUpPointTown" {...register('pickUpPointTownId', { required: 'Необходимо пункт выдачи!' })}>
                            {pickUpPoints.map(e =>
                                <option key={e.id} value={e.townId}>{e.townName}</option>
                            )}
                        </select>


                        <label htmlFor='choice'>Выберите маршрут:</label>
                        <select  {...register('choice', { required: 'Необходимо выбрать маршрут!' })}>
                            <option value={RouteChoice.Fastest}>Быстрый</option>
                            <option value={RouteChoice.Cheapest}>Дешевый</option>
                        </select>

                        <div>
                            <div>Итоговая цена:</div>
                            <div>{calculateFinalPrice()}</div>
                        </div>

                        <button type="submit" className="w-full p-2 mt-4 text-xl font-semibold text-white rounded-lg cursor-pointer bg-amber-400 hover:bg-amber-500">
                            Создать
                        </button>
                    </form >
                </div>
            </div >
        </>
    )
}
