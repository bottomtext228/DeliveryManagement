import { useNavigate } from "react-router-dom"
import { EditProductDto } from "../../types/types";
import { SubmitHandler, useForm } from "react-hook-form";
import Loading from "../../components/Loading/Loading";
import ServerError from "../../components/Error/ServerError";
import { useEffect, useState } from "react";
import NotFound from "../../components/NotFound/NotFound";
import ErrorPage from "../../components/Error/ErrorPage";
import { getImageUrl } from "../../helpers/image.helper";
import { useNumericParam } from "../../hooks/useNumericParam";
import { isAxiosError } from "axios";
import GoBackButton from "../../components/Common/GoBackButton";
import { useProductDetail } from "../../hooks/queries/useProductDetail";
import { useEditProduct } from "../../hooks/mutations/useEditProduct";
import InputFile from "../../components/Common/Form/InputFile";


interface FormValues {
    name: string,
    description: string,
    price: number,
    sizeX: number,
    sizeY: number,
    sizeZ: number,
    weight: number,
    image?: FileList
}

export default function CatalogEdit() {
    const id = useNumericParam();
    const { register, handleSubmit, formState: { errors }, reset, clearErrors } = useForm<FormValues>();
    const navigate = useNavigate();
    const [serverError, setServerError] = useState<unknown>(null);
    const { isPending, isError, data: product, error } = useProductDetail(id);


    useEffect(() => {
        if (product) {
            reset({
                name: product.name,
                description: product.description,
                price: product.price,
                sizeX: product.size.x,
                sizeY: product.size.y,
                sizeZ: product.size.z,
                weight: product.weight
            });
        }
    }, [product, reset]);


    const editProduct = useEditProduct(id!);


    if (id === null) {
        return <NotFound />
    }

    if (isPending) {
        return <Loading />
    }

    if (isError) {
        if (isAxiosError(error)) {
            if (error.response?.status === 404) return <NotFound />
        }
        return <ErrorPage error={error} />
    }

    const onSubmit: SubmitHandler<FormValues> = async (data, e) => {
        e?.preventDefault();

        const dto: EditProductDto = {
            name: data.name, description: data.description, weight: data.weight,
            price: data.price, sizeX: data.sizeX, sizeY: data.sizeY, sizeZ: data.sizeZ, image: data.image?.[0]
        };

        editProduct.mutate(dto, {
            onSuccess: () => {
                navigate(`/catalog/${id}`);
            },
            onError: (error) => {
                setServerError(error);
            }
        });
    }


    return (

        <>
            <div className="max-w-[1440px] w-[90%] mx-auto my-4">
                <GoBackButton />
                {serverError !== null && <ServerError error={serverError} />}
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col md:flex-row gap-x-8">
                    <div className="flex-1/3">
                        <InputFile id="image" label="Изображение" error={errors.image}
                            defaultSrc={getImageUrl(product.image)}
                            {...register("image")}
                            clearError={() => clearErrors("image")}
                        />
                    </div>

                    <div className="mt-8 flex-1/3">
                        <div className="mb-4">
                            <div>
                                <input
                                    id="name"
                                    className="px-2 py-0.5 w-full font-bold border border-gray-200 rounded-md outline-none md:w-54"
                                    {...register('name', {
                                        required: 'Название не может быть пустым!',
                                        minLength: { value: 2, message: 'Название должен иметь длину минимум в 2 символа.' },
                                        maxLength: { value: 200, message: 'Название не должно превышать длину в 200 символов.' }
                                    })} placeholder=" " autoComplete="on" />
                                {errors.name && <div className="text-red-500">{errors.name.message}</div>}
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <h2 className="float-left mb-4 font-bold">Характеристики:</h2>
                            <div className="flex flex-col gap-y-1">
                                <div className="flex gap-16">
                                    <div className="w-18">Артикул</div>
                                    <div className="font-bold">{product.id}</div>
                                </div>
                                <div className="flex gap-16">
                                    <div className="w-18">Вес</div>
                                    <div className="font-bold">
                                        <input id="weight" type="number" min={0} max={1000} step={0.0001} className="w-22 px-2 py-0.5 mr-1 border border-gray-200 rounded-md outline-none"
                                            {...register('weight', { required: 'Вес не может быть пустым!' })}
                                        />
                                        <span>кг</span>
                                        {errors.weight && <div className="text-red-500 font-normal">{errors.weight.message}</div>}
                                    </div>

                                </div>
                                <div className="flex gap-16">
                                    <div className="w-18">Длина</div>
                                    <div className="font-bold">
                                        <input id="sizeX" type="number" min={0} max={10} step={0.0001} className="w-22 px-2 py-0.5 mr-1 border border-gray-200 rounded-md outline-none"
                                            {...register('sizeX', { required: 'Ширина не может быть пустой!' })} placeholder=" "
                                        />
                                        <span>м</span>
                                        {errors.sizeX && <div className="text-red-500 font-normal">{errors.sizeX.message}</div>}
                                    </div>
                                </div>
                                <div className="flex gap-16">
                                    <div className="w-18">Ширина</div>
                                    <div className="font-bold">
                                        <input id="sizeY" type="number" min={0} max={10} step={0.0001} className="w-22 px-2 py-0.5 mr-1 border border-gray-200 rounded-md outline-none"
                                            {...register('sizeY', { required: 'Ширина не может быть пустой!' })} placeholder=" "
                                        />
                                        <span>м</span>
                                        {errors.sizeY && <div className="text-red-500 font-normal">{errors.sizeY.message}</div>}
                                    </div>


                                </div>
                                <div className="flex gap-16">
                                    <div className="w-18">Высота</div>
                                    <div className="font-bold">
                                        <input id="sizeZ" type="number" min={0} max={10} step={0.0001} className="w-22 px-2 py-0.5 mr-1 border border-gray-200 rounded-md outline-none"
                                            {...register('sizeZ', { required: 'Высота не может быть пустой!' })} placeholder=" "
                                        />
                                        <span>м</span>
                                        {errors.sizeZ && <div className="text-red-500 font-normal">{errors.sizeZ.message}</div>}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-12">
                            <h3 className="font-bold">Описание:</h3>
                            <div>
                                <textarea
                                    id="description"
                                    className="w-full px-2 py-0.5 border border-gray-200 rounded-md outline-none h-38"
                                    {...register('description', {
                                        required: 'Описание не может быть пустым!',
                                        maxLength: { value: 2000, message: 'Описание не должно превышать длину в 2000 символов.' }
                                    })}
                                    placeholder=" " />
                                {errors.description && <div className="text-red-500">{errors.description.message}</div>}
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 flex-1/3">
                        <div className="flex flex-col h-48 border-2 max-w-72 border-amber-500 rounded-2xl">
                            <div className="p-6 font-semibold ">
                                <input id="price" type="number" min={0} max={1000000} className="border px-2 py-0.5 border-gray-200 rounded-md outline-none w-28"
                                    {...register('price', { required: 'Стоимость не может быть пустой!' })} placeholder=" "
                                />
                                <span className="ml-1">₽</span>
                                {errors.price && <div className="text-red-500">{errors.price.message}</div>} </div>
                            <div className="mt-auto p-2 w-full  mx-auto flex flex-col gap-2">
                                <button type="submit" className="block w-full p-2 font-semibold text-center rounded-xl active:scale-98 border border-neutral-200 bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-300"
                                >
                                    Сохранить
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )

}