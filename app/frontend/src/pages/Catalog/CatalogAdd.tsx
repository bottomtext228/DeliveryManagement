import { SubmitHandler, useForm } from "react-hook-form";
import { CreateProductDto } from "../../types/types";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { createProduct } from "../../api/catalog/createProduct";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ServerError from "../../components/Error/ServerError";
import { productsInfiniteQueryOptions } from "../../queries/products.query";


interface FormValues {
    name: string,
    description: string,
    price: number,
    sizeX: number,
    sizeY: number,
    sizeZ: number,
    weight: number,
    image: FileList
}
export default function CatalogAdd() {

    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();
    const [serverError, setServerError] = useState<unknown>(null);
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: createProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            navigate('/catalog')
        },
        onError: (error) => {
            setServerError(error);
        }
    })

    const onSubmit: SubmitHandler<FormValues> = async (data, e) => {
        e?.preventDefault();

        const dto: CreateProductDto = {
            name: data.name, description: data.description, weight: data.weight,
            price: data.price, sizeX: data.sizeX, sizeY: data.sizeY, sizeZ: data.sizeZ, image: data.image[0]
        };

        mutation.mutate(dto);
    }


    return (
        <div className="md:my-16 my-4 max-w-md w-[90%] mx-auto">
            {serverError !== null && <ServerError error={serverError} />}
            <div className="p-6 border border-gray-300 rounded-2xl">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-bold text-neutral-800">Новый товар</h3>
                        <Link className='w-4 h-4' to='/catalog'><img className='duration-150 opacity-50 transient-colors hover:opacity-70' src="/cross.svg"></img></Link>
                    </div>
                    <div className="relative mt-4">
                        <input id="name" className="block w-full h-14.5 outline-none border border-gray-300 focus:outline-none focus:ring-4 focus:border-blue-400 duration-150 focus:ring-blue-200 rounded-lg p-3 pt-6.5 pb-2.5 peer" {...register('name', { required: 'Название не может быть пустым!' })} placeholder=" " />
                        <label htmlFor="name" className="absolute pointer-events-none text-md text-black duration-100 peer-placeholder-shown:opacity-100 peer-focus:opacity-70 opacity-70 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">
                            Название
                        </label>
                    </div>
                    {errors.name && <div className="text-red-500">{errors.name.message}</div>}

                    <div className="relative mt-4">
                        <textarea id="description" className="block w-full h-38 outline-none border border-gray-300 focus:outline-none focus:ring-4 focus:border-blue-400 duration-150 focus:ring-blue-200 rounded-lg p-3 pt-6.5 pb-2.5 peer" {...register('description', { required: 'Описание не может быть пустым!' })} placeholder=" " />
                        <label htmlFor="description" className="absolute pointer-events-none text-md text-black duration-100 peer-placeholder-shown:opacity-100 peer-focus:opacity-70 opacity-70 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">
                            Описание
                        </label>
                    </div>
                    {errors.description && <div className="text-red-500">{errors.description.message}</div>}

                    <div className="relative mt-4">
                        <input id="weight" type="number" min={0} max={10} step={0.0001} className="block w-full h-14.5 outline-none border border-gray-300 focus:outline-none focus:ring-4 focus:border-blue-400 duration-150 focus:ring-blue-200 rounded-lg p-3 pt-6.5 pb-2.5 peer" {...register('weight', { required: 'Вес не может быть пустым!' })} placeholder=" " />
                        <label htmlFor="weigt" className="absolute pointer-events-none text-md text-black duration-100 peer-placeholder-shown:opacity-100 peer-focus:opacity-70 opacity-70 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">
                            Вес
                        </label>
                    </div>
                    {errors.weight && <div className="text-red-500">{errors.weight.message}</div>}



                    <div className="relative mt-4">
                        <input id="price" type="number" min={0} max={1000000} className="block w-full h-14.5 outline-none border border-gray-300 focus:outline-none focus:ring-4 focus:border-blue-400 duration-150 focus:ring-blue-200 rounded-lg p-3 pt-6.5 pb-2.5 peer" {...register('price', { required: 'Стоимость не может быть пустой!' })} placeholder=" " />
                        <label htmlFor="price" className="absolute pointer-events-none text-md text-black duration-100 peer-placeholder-shown:opacity-100 peer-focus:opacity-70 opacity-70 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">
                            Стоимость
                        </label>
                    </div>
                    {errors.price && <div className="text-red-500">{errors.price.message}</div>}


                    <div className="relative mt-4">
                        <input id="sizeX" type="number" min={0} max={10} step={0.0001} className="block w-full h-14.5 outline-none border border-gray-300 focus:outline-none focus:ring-4 focus:border-blue-400 duration-150 focus:ring-blue-200 rounded-lg p-3 pt-6.5 pb-2.5 peer" {...register('sizeX', { required: 'Длина не может быть пустой!' })} placeholder=" " />
                        <label htmlFor="sizeX" className="absolute pointer-events-none text-md text-black duration-100 peer-placeholder-shown:opacity-100 peer-focus:opacity-70 opacity-70 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">
                            Длина
                        </label>
                    </div>
                    {errors.sizeX && <div className="text-red-500">{errors.sizeX.message}</div>}

                    <div className="relative mt-4">
                        <input id="sizeY" type="number" min={0} max={10} step={0.0001} className="block w-full h-14.5 outline-none border border-gray-300 focus:outline-none focus:ring-4 focus:border-blue-400 duration-150 focus:ring-blue-200 rounded-lg p-3 pt-6.5 pb-2.5 peer" {...register('sizeY', { required: 'Ширина не может быть пустой!' })} placeholder=" " />
                        <label htmlFor="sizeY" className="absolute pointer-events-none text-md text-black duration-100 peer-placeholder-shown:opacity-100 peer-focus:opacity-70 opacity-70 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">
                            Ширина
                        </label>
                    </div>
                    {errors.sizeY && <div className="text-red-500">{errors.sizeY.message}</div>}


                    <div className="relative mt-4">
                        <input id="sizeZ" type="number" min={0} max={10} step={0.0001} className="block w-full h-14.5 outline-none border border-gray-300 focus:outline-none focus:ring-4 focus:border-blue-400 duration-150 focus:ring-blue-200 rounded-lg p-3 pt-6.5 pb-2.5 peer" {...register('sizeZ', { required: 'Высота не может быть пустой!' })} placeholder=" " />
                        <label htmlFor="sizeZ" className="absolute pointer-events-none text-md text-black duration-100 peer-placeholder-shown:opacity-100 peer-focus:opacity-70 opacity-70 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">
                            Высота
                        </label>
                    </div>
                    {errors.sizeZ && <div className="text-red-500">{errors.sizeZ.message}</div>}


                    <div className="w-full mt-4">
                        <label htmlFor="image" className="flex w-full h-12 my-4 border border-gray-300 rounded-lg">
                            <div id='image-label' className="flex items-center justify-start p-3 overflow-hidden flex-4/5 text-ellipsis whitespace-nowrap">Выберите файл...</div>
                            <div className="flex items-center justify-center border-l border-gray-300 flex-1/5"><img src="/upload-file.svg" className="w-12 h-12"></img></div>
                        </label>
                        <input className="w-0 h-0 opacity-0 overflow-hidden absolute -z-[1]" id="image" {...register("image", { required: 'Изображение обязательно!' })} type="file" accept=".jpg, .jpeg, .png" onChange={
                            (e: React.ChangeEvent<HTMLInputElement>) => {
                                const file = e.target.files?.item(0);
                                if (file !== null && file !== undefined) {
                                    const image = (document.querySelector('#image-preview')! as HTMLImageElement);
                                    image.src = URL.createObjectURL(file);
                                    image.classList.add('border', 'border-gray-300');
                                    (document.querySelector('#image-label')! as HTMLLabelElement).innerText = file.name;
                                }
                            }
                        }></input>

                    </div>
                    <div className="w-full h-full">
                        <img id="image-preview" className="object-contain w-full h-full rounded-2xl"></img>
                    </div>
                    {errors.image && <div className="text-red-500">{errors.image.message}</div>}

                    <button type="submit" className="w-full p-2 mt-4 text-xl font-semibold text-white rounded-lg cursor-pointer bg-amber-400 hover:bg-amber-500">
                        Создать
                    </button>
                </form >
            </div>
        </div >
    )
}