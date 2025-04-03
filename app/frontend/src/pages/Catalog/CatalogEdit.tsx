import { useNavigate, useParams } from "react-router-dom"
import { EditProductDto } from "../../types/types";
import { editProduct } from "../../api/catalog/editProduct";

import { SubmitHandler, useForm } from "react-hook-form";
import { getProduct } from "../../api/catalog/getProduct";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../components/Loading/Loading";
import { InputHTMLAttributes, useEffect } from "react";



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

export default function CatalogEdit() {
    const { id } = useParams();
    const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormValues>();
    const navigate = useNavigate();


 /*    useEffect(() => {
        (document.getElementById('weight') as HTMLInputElement).style.width = product.weight.length + 'ch';
    }, []);
 */
    if (isNaN(parseInt(id!))) {
        return <span>Not found...</span>
    }

    const { isPending, isError, data, error } = useQuery({
        queryKey: ['product', id],
        queryFn: () => getProduct(parseInt(id!))
    });

    if (isPending) {
        return <Loading></Loading>
    }

    if (isError) {
        return <span>Error: {error.message}</span>
    }

    const product = data.data;
    setValue('name', product.name);
    setValue('description', product.description);
    setValue('price', product.price);
    setValue('weight', product.weight);
    setValue('sizeX', product.size.x);
    setValue('sizeY', product.size.y);
    setValue('sizeZ', product.size.z);


    const onSubmit: SubmitHandler<FormValues> = async (data, e) => {
        e?.preventDefault();


        const dto: EditProductDto = {
            name: data.name, description: data.description, weight: data.weight,
            price: data.price, sizeX: data.sizeX, sizeY: data.sizeY, sizeZ: data.sizeZ, image: data.image?.[0]
        };
        editProduct(parseInt(id!), dto).then(() => navigate(`/catalog/${id}`)).catch(e => console.error(e));

    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex md:flex-row flex-col max-w-[1440px] w-[90%] mx-auto my-16">

            <div className="mr-8 flex-1/3">
                <img className="border border-gray-200 rounded-xl" src={"data:image/png;base64," + product.image}></img>
            </div>

            <div className="mt-8 flex-1/3">
                <div className="mb-4">
                    <p className="font-bold">{product.name}</p>
                </div>
                <div>
                    <table>
                        <caption className="float-left mb-4 font-bold">Характеристики:</caption>
                        <tbody className="text-left font-bold">
                            <tr>
                                <th className="font-normal">Артикул</th>
                                <td>{product.id}</td>
                            </tr>
                            <tr>
                                <th className="font-normal">Вес</th>
                                <td className="flex h-6">

                                    <input id="weight" type="number" min="0" step="0.0001" className="w-16" onInput={(e) => {
                                        e.currentTarget.style.width = (e.currentTarget.value.length) + 'ch';
                                    }
                                    } {...register('weight', { required: 'Вес не может быть пустым!' })}></input>
                                    {errors.weight && <div className="text-red-500">{errors.weight.message}</div>} кг
                                </td>
                            </tr>
                            <tr>
                                <th className="font-normal">Длина</th>
                                <td>{product.size.x} м</td>
                            </tr>
                            <tr>
                                <th className="font-normal">Ширина</th>
                                <td>{product.size.y} м</td>
                            </tr>
                            <tr>
                                <th className="font-normal">Высота</th>
                                <td>{product.size.z} м</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="mt-12">
                    <h3 className="font-bold">Описание:</h3>
                    <p>{product.description}</p>
                </div>
            </div>
            <div className="mt-6 flex-1/3">
                <div className="flex flex-col h-48 border-2 max-w-72 border-amber-500 rounded-2xl">
                    <div className="p-6 font-semibold">{product.price} ₽</div>
                    <div className="mt-auto mb-2 mx-auto w-[75%] flex flex-col gap-2">
                        <button type="submit" className="block w-full p-1 font-semibold text-center shadow-sm shadow-neutral-500 rounded-xl bg-neutral-50 hover:bg-neutral-200">Сохранить</button>
                    </div>
                </div>
            </div>
        </form>
    )

}


/**
 * 
 *    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="modal-body">
                            <div></div>
                            <label htmlFor="name" className="form-label">Название</label>
                            <div className="mb-3 input-group">
                                <input id="name" type="text" className="form-control" {...register('name', { required: 'Название не может быть пустым!' })}></input>
                            </div>
                            {errors.name && <div>{errors.name.message}</div>}
                            <label htmlFor="description" className="form-label">Описание</label>
                            <div className="mb-3 input-group">
                                <textarea id="description" className="form-control" {...register('description', { required: 'Описание не может быть пустым!' })}></textarea>
                            </div>
                            {errors.description && <div>{errors.description.message}</div>}
                            <label htmlFor="weight" className="form-label">Вес</label>
                            <div className="mb-3 input-group">
                                <input id="weight" type="number" min="0" step="0.0001" className="form-control" {...register('weight', { required: 'Вес не может быть пустым!' })}></input>
                            </div>
                            {errors.weight && <div>{errors.weight.message}</div>}
                            <label htmlFor="price">Стоимость</label>
                            <div>
                                <input id="price" type="number" min="0" step="0.0001" className="" {...register('price', { required: 'Стоимость не может быть пустой!' })}></input>
                            </div>
                            {errors.price && <div>{errors.price.message}</div>}
                            <label htmlFor="sizeX" className="form-label">Длина</label>
                            <div className="mb-3 input-group">
                                <input id="sizeX" type="number" min="0" step="0.0001" className="form-control" {...register('sizeX', { required: 'Длина не может быть пустой!' })}></input>
                            </div>
                            {errors.sizeX && <div>{errors.sizeX.message}</div>}
                            <label htmlFor="sizeY" className="form-label">Ширина</label>
                            <div className="mb-3 input-group">
                                <input id="sizeY" type="number" min="0" step="0.0001" className="form-control" {...register('sizeY', { required: 'Ширина не может быть пустой!' })}></input>
                            </div>
                            {errors.sizeY && <div>{errors.sizeY.message}</div>}
                            <label htmlFor="sizeZ" className="form-label">Высота</label>
                            <div className="mb-3 input-group">
                                <input id="sizeZ" type="number" min="0" step="0.0001" className="form-control" {...register('sizeZ', { required: 'Высота не может быть пустой!' })}></input>
                            </div>
                            {errors.sizeZ && <div>{errors.sizeZ.message}</div>}
                            <div className="mb-3 input-group">
                                <input {...register("image")} type="file" accept=".jpg, .jpeg, .png" onChange={
                                    (e: React.ChangeEvent<HTMLInputElement>) => {
                                        const file = e.target.files?.item(0);
                                        if (file !== null) {
                                            (document.querySelector('#image-preview')! as HTMLImageElement).src = URL.createObjectURL(file!);
                                        }
                                    }}
                                >
                                </input>
                            </div>
                            <div className="overflow-scroll w-52 h-52">
                                <img id="image-preview" src={`data:image/png;base64,${product.image}`}></img>
                            </div>
                            {errors.image && <div>{errors.image.message}</div>}
                        </div>
                        <div className="modal-footer">
                            <button type="submit" className="btn btn-primary" >Применить изменения</button>
                        </div>
                    </form>
 */