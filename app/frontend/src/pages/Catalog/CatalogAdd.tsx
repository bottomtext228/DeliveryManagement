import { SubmitHandler, useForm } from "react-hook-form";
import { CreateProductDto, IHtppValidationProblemDetails } from "../../types/types";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { createProduct } from "../../api/catalog/createProduct";
import { isAxiosError } from "axios";


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
            if (isAxiosError(error)) {
                setServerError(error.response?.data);
            }
            console.error(error);
        }

    }


    return (
        <div className="md:my-16 my-4 max-w-md w-[90%] mx-auto">
            {serverError ?
                <div className="border border-gray-300 rounded-2xl shadow-md h-fit p-4 text-black my-4">
                    {serverError.status === 401 ? /** Unauthorized - wrong password/username*/
                        <div>
                            <li>Неправильная почта и/или пароль</li>
                        </div> : /** Bad Request - validation errors*/
                        <div>
                            {serverError.errors && Object.keys(serverError.errors).map(key => <li key={key}>{(serverError.errors as any)[key]}</li>)}
                        </div>}
                </div> : <></>}
            <div className="rounded-2xl p-6 border border-gray-300">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex justify-between items-center">
                        <h3 className="text-neutral-800 text-2xl font-bold">Новый товар</h3>
                        <Link className='w-4 h-4' to='/catalog'><img className='opacity-50 transient-colors duration-150 hover:opacity-70' src="/cross.svg"></img></Link>
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
                        <input id="weight" type="number" min="0" step="0.0001" className="block w-full h-14.5 outline-none border border-gray-300 focus:outline-none focus:ring-4 focus:border-blue-400 duration-150 focus:ring-blue-200 rounded-lg p-3 pt-6.5 pb-2.5 peer" {...register('weight', { required: 'Вес не может быть пустым!' })} placeholder=" " />
                        <label htmlFor="weigt" className="absolute pointer-events-none text-md text-black duration-100 peer-placeholder-shown:opacity-100 peer-focus:opacity-70 opacity-70 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">
                            Вес
                        </label>
                    </div>
                    {errors.weight && <div className="text-red-500">{errors.weight.message}</div>}



                    <div className="relative mt-4">
                        <input id="price" type="number" min="0" step="0.0001" className="block w-full h-14.5 outline-none border border-gray-300 focus:outline-none focus:ring-4 focus:border-blue-400 duration-150 focus:ring-blue-200 rounded-lg p-3 pt-6.5 pb-2.5 peer" {...register('price', { required: 'Стоимость не может быть пустой!' })} placeholder=" " />
                        <label htmlFor="price" className="absolute pointer-events-none text-md text-black duration-100 peer-placeholder-shown:opacity-100 peer-focus:opacity-70 opacity-70 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">
                            Стоимость
                        </label>
                    </div>
                    {errors.price && <div className="text-red-500">{errors.price.message}</div>}


                    <div className="relative mt-4">
                        <input id="sizeX" type="number" min="0" step="0.0001" className="block w-full h-14.5 outline-none border border-gray-300 focus:outline-none focus:ring-4 focus:border-blue-400 duration-150 focus:ring-blue-200 rounded-lg p-3 pt-6.5 pb-2.5 peer" {...register('sizeX', { required: 'Длина не может быть пустой!' })} placeholder=" " />
                        <label htmlFor="sizeX" className="absolute pointer-events-none text-md text-black duration-100 peer-placeholder-shown:opacity-100 peer-focus:opacity-70 opacity-70 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">
                            Длина
                        </label>
                    </div>
                    {errors.sizeX && <div className="text-red-500">{errors.sizeX.message}</div>}

                    <div className="relative mt-4">
                        <input id="sizeY" type="number" min="0" step="0.0001" className="block w-full h-14.5 outline-none border border-gray-300 focus:outline-none focus:ring-4 focus:border-blue-400 duration-150 focus:ring-blue-200 rounded-lg p-3 pt-6.5 pb-2.5 peer" {...register('sizeY', { required: 'Ширина не может быть пустой!' })} placeholder=" " />
                        <label htmlFor="sizeY" className="absolute pointer-events-none text-md text-black duration-100 peer-placeholder-shown:opacity-100 peer-focus:opacity-70 opacity-70 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">
                            Ширина
                        </label>
                    </div>
                    {errors.sizeY && <div className="text-red-500">{errors.sizeY.message}</div>}


                    <div className="relative mt-4">
                        <input id="sizeZ" type="number" min="0" step="0.0001" className="block w-full h-14.5 outline-none border border-gray-300 focus:outline-none focus:ring-4 focus:border-blue-400 duration-150 focus:ring-blue-200 rounded-lg p-3 pt-6.5 pb-2.5 peer" {...register('sizeZ', { required: 'Высота не может быть пустой!' })} placeholder=" " />
                        <label htmlFor="sizeZ" className="absolute pointer-events-none text-md text-black duration-100 peer-placeholder-shown:opacity-100 peer-focus:opacity-70 opacity-70 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">
                            Высота
                        </label>
                    </div>
                    {errors.sizeZ && <div className="text-red-500">{errors.sizeZ.message}</div>}


                    <div className="mt-4 w-full">
                        <label htmlFor="image" className="flex w-full h-12 border border-gray-300 rounded-lg my-4">
                            <div id='image-label' className="flex-4/5 flex justify-start items-center p-3 text-ellipsis overflow-hidden whitespace-nowrap">Выберите файл...</div>
                            <div className="flex-1/5 border-l border-gray-300 flex justify-center items-center"><img src="/upload-file.svg" className="w-12 h-12"></img></div>
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
                        <img id="image-preview" className="w-full h-full object-contain rounded-2xl"></img>
                    </div>
                    {errors.image && <div className="text-red-500">{errors.image.message}</div>}

                    <button type="submit" className="w-full rounded-lg p-2 bg-amber-400 hover:bg-amber-500 cursor-pointer text-white font-semibold text-xl mt-4">
                        Создать
                    </button>
                </form >
            </div>
        </div >
    )
}