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
import GoBackArrow from "../../components/Common/GoBackArrow";
import { useProductDetail } from "../../hooks/queries/useProductDetail";
import { useEditProduct } from "../../hooks/mutations/useEditProduct";


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
    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>();
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
        return <ErrorPage message={error.message} />
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
                if (isAxiosError(error)) {
                    setServerError(error);
                }
            }
        });
    }


    return (

        <>
            <div className="max-w-[1440px] w-[90%] mx-auto my-4">
                <GoBackArrow></GoBackArrow>
                {serverError !== null && <ServerError error={serverError} />}
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col md:flex-row gap-x-8">
                    <div className="flex-1/3">
                        <img id="image-preview" className="border border-gray-200 rounded-xl" src={getImageUrl(product.image)}></img>
                        <div className="w-full mt-4">
                            <label htmlFor="image" className="flex w-full h-12 my-4 border border-gray-300 rounded-lg">
                                <div id='image-label' className="flex items-center justify-start p-3 overflow-hidden flex-4/5 text-ellipsis whitespace-nowrap">Выберите файл...</div>
                                <div className="flex items-center justify-center border-l border-gray-300 flex-1/5"><img src="/upload-file.svg" className="w-12 h-12"></img></div>
                            </label>
                            <input className="w-0 h-0 opacity-0 overflow-hidden absolute -z-[1]" id="image" {...register("image")} type="file" accept=".jpg, .jpeg, .png" onChange={
                                (e: React.ChangeEvent<HTMLInputElement>) => {
                                    const file = e.target.files?.item(0);
                                    if (file !== null && file !== undefined) {
                                        const image = (document.querySelector('#image-preview')! as HTMLImageElement);
                                        image.src = URL.createObjectURL(file);
                                        (document.querySelector('#image-label')! as HTMLLabelElement).innerText = file.name;
                                    }
                                }
                            }></input>

                        </div>
                    </div>

                    <div className="mt-8 flex-1/3">
                        <div className="mb-4">
                            <div>
                                <input id="name" className="p-0.5 w-full font-bold border border-gray-200 rounded-md outline-none md:w-54" {...register('name', { required: 'Название не может быть пустым!' })} placeholder=" " />
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
                                        <input id="weight" type="number" min={0} max={1000} step={0.0001} className="w-16 p-0.5 mr-1 border border-gray-200 rounded-md outline-none"
                                            {...register('weight', { required: 'Вес не может быть пустым!' })}
                                        />
                                        <span>кг</span>
                                        {errors.weight && <div className="text-red-500">{errors.weight.message}</div>}
                                    </div>

                                </div>
                                <div className="flex gap-16">
                                    <div className="w-18">Длина</div>
                                    <div className="font-bold">
                                        <input id="sizeX" type="number" min={0} max={10} step={0.0001} className="w-16 p-0.5 mr-1 border border-gray-200 rounded-md outline-none"
                                            {...register('sizeX', { required: 'Ширина не может быть пустой!' })} placeholder=" "
                                        />
                                        <span>м</span>
                                        {errors.sizeX && <div className="text-red-500">{errors.sizeX.message}</div>}
                                    </div>
                                </div>
                                <div className="flex gap-16">
                                    <div className="w-18">Ширина</div>
                                    <div className="font-bold">
                                        <input id="sizeY" type="number" min={0} max={10} step={0.0001} className="w-16 p-0.5 mr-1 border border-gray-200 rounded-md outline-none"
                                            {...register('sizeY', { required: 'Ширина не может быть пустой!' })} placeholder=" "
                                        />
                                        <span>м</span>
                                        {errors.sizeY && <div className="text-red-500">{errors.sizeY.message}</div>}
                                    </div>


                                </div>
                                <div className="flex gap-16">
                                    <div className="w-18">Высота</div>
                                    <div className="font-bold">
                                        <input id="sizeZ" type="number" min={0} max={10} step={0.0001} className="w-16 p-0.5 mr-1 border border-gray-200 rounded-md outline-none"
                                            {...register('sizeZ', { required: 'Высота не может быть пустой!' })} placeholder=" "
                                        />
                                        <span>м</span>
                                        {errors.sizeZ && <div className="text-red-500">{errors.sizeZ.message}</div>}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-12">
                            <h3 className="font-bold">Описание:</h3>
                            <div>
                                <textarea id="description" className="w-full border border-gray-200 rounded-md outline-none h-38" {...register('description', { required: 'Описание не может быть пустым!' })} placeholder=" " />
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 flex-1/3">
                        <div className="flex flex-col h-48 border-2 max-w-72 border-amber-500 rounded-2xl">
                            <div className="p-6 font-semibold ">
                                <input id="price" type="number" min={0} max={1000000} className="border p-0.5 border-gray-200 rounded-md outline-none w-18"
                                    {...register('price', { required: 'Стоимость не может быть пустой!' })} placeholder=" "
                                />
                                <span>₽</span>
                                {errors.price && <div className="text-red-500">{errors.price.message}</div>} </div>
                            <div className="mt-auto mb-2 mx-auto w-[75%] flex flex-col gap-2">
                                <button type="submit" className="block w-full p-1 font-semibold text-center shadow-sm shadow-neutral-500 rounded-xl bg-neutral-50 hover:bg-neutral-200">Сохранить</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )

}