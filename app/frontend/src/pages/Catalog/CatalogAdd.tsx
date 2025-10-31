import { SubmitHandler, useForm } from "react-hook-form";
import { CreateProductDto } from "../../types/types";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import ServerError from "../../components/Error/ServerError";
import Loading from "../../components/Loading/Loading";
import ErrorPage from "../../components/Error/ErrorPage";
import WarningCard from "../../components/Common/WarningCard";
import { useCreateProduct } from "../../hooks/mutations/useCreateProduct";
import { useCanCompantCreateProduct } from "../../hooks/queries/useCanCompanyCreateProduct";
import { CloseButton } from "../../components/Common/CloseButton";
import InputField from "../../components/Common/Form/InputField";
import TextAreaField from "../../components/Common/Form/TextareaField";
import InputFile from "../../components/Common/Form/InputFile";
import Button from "../../components/Common/Button";

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

    const { register, handleSubmit, formState: { errors }, clearErrors } = useForm<FormValues>();
    const [serverError, setServerError] = useState<unknown>(null);
    const navigate = useNavigate();

    const createProduct = useCreateProduct();

    const { isLoading, isError, error, data: canCreateProductResponse } = useCanCompantCreateProduct();

    const onSubmit: SubmitHandler<FormValues> = async (data, e) => {
        e?.preventDefault();

        const dto: CreateProductDto = {
            name: data.name, description: data.description, weight: data.weight,
            price: data.price, sizeX: data.sizeX, sizeY: data.sizeY, sizeZ: data.sizeZ, image: data.image[0]
        };

        createProduct.mutate(dto, {
            onSuccess: () => {
                navigate('/catalog')
            },
            onError: (error: unknown) => {
                setServerError(error);
            }
        });
    }

    if (isLoading) return <Loading />;

    if (isError) return <ErrorPage message={error.message} />;

    if (canCreateProductResponse?.canCreate === false) {
        return (
            <WarningCard
                title="Не так быстро, проказник!"
                message={canCreateProductResponse.message}
                link="/map"
                linkMessage="Карта"
            />
        )
    }

    return (
        <div className="md:my-16 my-4 max-w-md w-[90%] mx-auto">
            {serverError !== null && <ServerError error={serverError} />}
            <div className="p-6 border border-gray-300 rounded-2xl">
                <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                    <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-bold text-neutral-800">Новый товар</h3>
                        <Link className='w-4 h-4' to='/catalog'>
                            <CloseButton />
                        </Link>
                    </div>

                    <InputField id="name" label="Название" error={errors.name} autoComplete="on"
                        {...register('name', { required: 'Название не может быть пустым!' })}
                    />
                    <TextAreaField id="description" label="Описание" error={errors.description}
                        {...register('description', { required: 'Описание не может быть пустым!' })}
                    />
                    <InputField id="weight" label="Вес" error={errors.weight} type="number" min={0} max={10} step={0.0001}
                        {...register('weight', { required: 'Вес не может быть пустым!' })}
                    />
                    <InputField id="price" label="Стоимость" error={errors.price} type="number" min={0} max={1000000}
                        {...register('price', { required: 'Стоимость не может быть пустой!' })}
                    />
                    <InputField id="sizeX" label="Длина" error={errors.sizeX} type="number" min={0} max={10} step={0.0001}
                        {...register('sizeX', { required: 'Длина не может быть пустой!' })}
                    />

                    <InputField id="sizeY" label="Ширина" error={errors.sizeY} type="number" min={0} max={10} step={0.0001}
                        {...register('sizeY', { required: 'Ширина не может быть пустой!' })}
                    />

                    <InputField id="sizeZ" label="Высота" error={errors.sizeZ} type="number" min={0} max={10} step={0.0001}
                        {...register('sizeZ', { required: 'Высота не может быть пустой!' })}
                    />

                    <InputFile id="image" label="Изображение" error={errors.image}
                        {...register("image", { required: 'Изображение обязательно!' })}
                        clearError={() => clearErrors("image")}
                    />

                    <div className="mt-8 font-semibold">
                        <Button label="Создать" rounded="lg"></Button>
                    </div>
                </form >
            </div>
        </div >
    )
}