import { SubmitHandler, useForm } from "react-hook-form";
import { CreateProductDto, IHtppValidationProblemDetails } from "../../types/types";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { createProduct } from "../../api/catalog/createProduct";


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

    const { register, handleSubmit, formState: { errors }, getValues } = useForm<FormValues>();
    const [serverError, setServerError] = useState<IHtppValidationProblemDetails | null>(null);
    const navigate = useNavigate();
    const onSubmit: SubmitHandler<FormValues> = async (data, e) => {
        e?.preventDefault();
        console.log(data);

        const dto: CreateProductDto = {
            name: data.name, description: data.description, weight: data.weight,
            price: data.price, sizeX: data.sizeX, sizeY: data.sizeY, sizeZ: data.sizeZ, image: data.image[0]
        };
        try {
            const result = await createProduct(dto);
          /*   if (result.status) {
                navigate('/catalog');
            } else {
                setServerError(result as IHtppValidationProblemDetails);
            } */

            navigate('/catalog');
        } catch (error) {
            console.error(error);
        }

    }


    return (
        <div className="modal modal-sheet d-block bg-body-secondary p-4 py-md-5" id="exampleModal">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Добавлене товара</h5>
                        <a asp-controller="Catalog" asp-action="All" className="btn-close"></a>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="modal-body">
                            <div></div>
                            <label htmlFor="name" className="form-label">Название</label>
                            <div className="input-group mb-3">
                                <input id="name" type="text" className="form-control" {...register('name', { required: 'Название не может быть пустым!' })}></input>
                            </div>
                            {errors.name && <div>{errors.name.message}</div>}
                            <label htmlFor="description" className="form-label">Описание</label>
                            <div className="input-group mb-3">
                                <textarea id="description" className="form-control" {...register('description', { required: 'Описание не может быть пустым!' })}></textarea>
                            </div>
                            {errors.description && <div>{errors.description.message}</div>}
                            <label htmlFor="weight" className="form-label">Вес</label>
                            <div className="input-group mb-3">
                                <input id="weight" type="number" min="0" step="0.0001" className="form-control" {...register('weight', { required: 'Вес не может быть пустым!' })}></input>
                            </div>
                            {errors.weight && <div>{errors.weight.message}</div>}
                            <label htmlFor="price">Стоимость</label>
                            <div>
                                <input id="price" type="number" min="0" step="0.0001" className="" {...register('price', { required: 'Стоимость не может быть пустой!' })}></input>
                            </div>
                            {errors.price && <div>{errors.price.message}</div>}
                            <label htmlFor="sizeX" className="form-label">Длина</label>
                            <div className="input-group mb-3">
                                <input id="sizeX" type="number" min="0" step="0.0001" className="form-control" {...register('sizeX', { required: 'Длина не может быть пустой!' })}></input>
                            </div>
                            {errors.sizeX && <div>{errors.sizeX.message}</div>}
                            <label htmlFor="sizeY" className="form-label">Ширина</label>
                            <div className="input-group mb-3">
                                <input id="sizeY" type="number" min="0" step="0.0001" className="form-control" {...register('sizeY', { required: 'Ширина не может быть пустой!' })}></input>
                            </div>
                            {errors.sizeY && <div>{errors.sizeY.message}</div>}
                            <label htmlFor="sizeZ" className="form-label">Высота</label>
                            <div className="input-group mb-3">
                                <input id="sizeZ" type="number" min="0" step="0.0001" className="form-control" {...register('sizeZ', { required: 'Высота не может быть пустой!' })}></input>
                            </div>
                            {errors.sizeZ && <div>{errors.sizeZ.message}</div>}
                            <div className="input-group mb-3">
                                <input id="image" {...register("image", { required: 'Изображение обязательно!' })} type="file" accept=".jpg, .jpeg, .png" onChange={
                                    (e: React.ChangeEvent<HTMLInputElement>) => {
                                        const file = e.target.files?.item(0);
                                        if (file !== null) {
                                            (document.querySelector('#image-preview')! as HTMLImageElement).src = URL.createObjectURL(file!);
                                        }
                                    }
                                }></input>
                            </div>
                            <div className="w-52 h-52 overflow-scroll">
                                <img id="image-preview"></img>
                            </div>
                            {errors.image && <div>{errors.image.message}</div>}
                        </div>
                        <div className="modal-footer">
                            <button type="submit" className="btn btn-primary" >Создать</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}