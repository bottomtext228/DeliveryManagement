import { SubmitHandler, useForm } from "react-hook-form";
import { Company, UpdateCompanyDetailsRequest } from "../../types/types"
import Button from "../Common/Button";
import { useUpdateCompanyDetails } from "../../hooks/mutations/useUpdateCompanyDetails";
import ServerError from "../Error/ServerError";
import { useState } from "react";

interface Props {
    company: Company
}

interface FormValues {
    name: string;
    description: string;
}

export default function CompanyInfo({ company }: Props) {
    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
        defaultValues: {
            name: company.name,
            description: company.description
        }
    });
    const [serverError, setServerError] = useState<unknown>(null);

    const updateCompanyDetails = useUpdateCompanyDetails();

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        const dto: UpdateCompanyDetailsRequest = {
            name: data.name,
            description: data.description
        };

        updateCompanyDetails.mutate(dto, {
            onSuccess: () => {
                setServerError(null);
            },
            onError: (error) => {
                setServerError(error);
            }
        });
    }

    return (
        <>
            {serverError !== null && <ServerError error={serverError} />}
            <div className="border border-gray-200 rounded-xl py-2 px-3 w-full flex flex-col">
                <h2 className="font-semibold text-lg pb-2 mx-auto">
                    Информация о компании
                </h2>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2.5 flex-1">
                    <div className="flex flex-col h-20">
                        <label htmlFor="company_name" className="font-semibold">Название:</label>
                        <input
                            type="text"
                            id="company_name"
                            autoComplete="off"
                            {...register('name', {
                                required: 'Название не может быть пустым!',
                                minLength: { value: 2, message: 'Название должно иметь длину минимум в 2 символа.' },
                                maxLength: { value: 200, message: 'Название не должно превышать длину в 200 символов.' }
                            })}
                            className="w-full border border-neutral-200 rounded-lg outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-400 px-3 py-2 mt-1"
                        />
                        {errors.name && <span className="text-red-500 text-sm pt-1">{errors.name.message}</span>}
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="company_description" className="font-semibold">Описание:</label>
                        <textarea
                            id="company_description"
                            autoComplete="off"
                            {...register('description', {
                                required: 'Описание не может быть пустым!',
                                maxLength: { value: 2000, message: 'Описание не должно превышать длину в 2000 символов.' }
                            })}
                            className="w-full border border-neutral-200 rounded-lg outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-400 px-3 py-2 mt-1"
                            rows={9}
                        />
                        {errors.description && <span className="text-red-500 text-sm pt-1">{errors.description.message}</span>}
                    </div>

                    <Button label="Сохранить"></Button>
                </form>
            </div>
        </>
    )
}