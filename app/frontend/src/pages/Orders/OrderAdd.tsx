import { isAxiosError } from 'axios';
import React, { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form';
import { data, Link, useNavigate, useParams } from 'react-router-dom';
import { createProduct } from '../../api/catalog/createProduct';
import { IHtppValidationProblemDetails, CreateProductDto, RouteChoice, CreateOrderDto, IProduct } from '../../types/types';
import { useQueries, useQuery } from '@tanstack/react-query';
import { getProductDetail } from '../../api/catalog/getProduct';
import Loading from '../../components/Loading/Loading';
import { getPickUpPoints } from '../../api/map/getPickUpPoints';
import { getCompanyPickUpPoints } from '../../api/map/getCompanyPickUpPoints';
import { createOrder } from '../../api/orders/createOrder';



interface FormValues {
    productId: number,
    pickUpPointTownId: number,
    choice: RouteChoice,
    quantity: number
}


export default function OrderAdd() {

    const { id } = useParams();


    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();
    const [serverError, setServerError] = useState<IHtppValidationProblemDetails | null>(null);

    const navigate = useNavigate();

    const { data: productData, isPending: isProductPending } = useQuery({
        queryKey: ['product', id],
        queryFn: () => getProductDetail(parseInt(id!)),
        refetchOnWindowFocus: false
    });

    const product = productData?.data;
    const companyId = product?.companyId;

    const { isPending, isError, error, data: pickUpPointsData } = useQuery({
        queryKey: ['pickuppoints', companyId],
        queryFn: () => getCompanyPickUpPoints(companyId!),
        refetchOnWindowFocus: false,
        enabled: !!companyId
    })

    if (isPending) {
        return <Loading></Loading>
    }

    if (isError) {
        return <span>Error: {error.message}</span>
    }


    const pickUpPoints = pickUpPointsData?.data;

    const onSubmit: SubmitHandler<FormValues> = async (data, e) => {
        e?.preventDefault();

        const dto: CreateOrderDto = {
            productId: product.id,
            pickUpPointTownId: data.pickUpPointTownId,
            choice: parseInt(data.choice.toString()), // enums must be numbers
            quantity: data.quantity
        };
        try {
            await createOrder(dto);
            navigate('/orders');
        } catch (error) {
            if (isAxiosError(error)) {
                setServerError(error.response?.data);
            }
            console.error(error);
        }

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


                        <label htmlFor="choice">Пункт выдачи заказов:</label>
                        <select id="pickUpPointTown" {...register('pickUpPointTownId', { required: 'Необходимо выбрать маршрут!' })}>
                            {pickUpPoints.map(e =>
                                <option key={e.id} value={e.townId}>{e.townId}</option>
                            )}
                        </select>


                        <label htmlFor='choice'>Выберите маршрут:</label>
                        <select  {...register('choice', { required: 'Необходимо выбрать маршрут!' })}>
                            <option value={RouteChoice.Fastest}>Быстрый</option>
                            <option value={RouteChoice.Cheapest}>Дешевый</option>
                        </select>

                        <div className="relative mt-4">
                            <input id="quantity" min={1} max={100} type="number" step={1} className="block w-full h-14.5 outline-none border border-gray-300 focus:outline-none focus:ring-4 focus:border-blue-400 duration-150 focus:ring-blue-200 rounded-lg p-3 pt-6.5 pb-2.5 peer" {...register('quantity', { required: 'Количество не может быть пустым' })} placeholder=" " />
                            <label htmlFor="quantity" className="absolute pointer-events-none text-md text-black duration-100 peer-placeholder-shown:opacity-100 peer-focus:opacity-70 opacity-70 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">
                                Количество
                            </label>
                        </div>
                        {errors.quantity && <div className="text-red-500">{errors.quantity.message}</div>}


                        <button type="submit" className="w-full p-2 mt-4 text-xl font-semibold text-white rounded-lg cursor-pointer bg-amber-400 hover:bg-amber-500">
                            Создать
                        </button>
                    </form >
                </div>
            </div >
        </>
    )
}
