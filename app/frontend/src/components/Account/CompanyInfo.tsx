import { SubmitHandler, useForm } from "react-hook-form";
import { Company, UpdateCompanyDetailsRequest } from "../../types/types"
import { updateCompanyDetails } from "../../api/company/updateCompanyDetails";

interface Props {
    company: Company
}

interface FormValues {
    name: string,
    description: string
}

export default function CompanyInfo({ company }: Props) {
    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
        defaultValues: {
            name: company.name,
            description: company.description
        }
    });


    const onSubmit: SubmitHandler<FormValues> = async (data) => {

        try {
            const dto: UpdateCompanyDetailsRequest = {
                name: data.name,
                description: data.description
            };

            updateCompanyDetails(company.id, dto);

        }
        catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="border border-gray-200 rounded-xl py-2 px-3 w-full flex flex-col h-120">
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
                        {...register('name', { required: 'Название обязательно!' })}
                        className="w-full border border-neutral-200 rounded-lg outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-400 px-3 py-2 mt-1"
                    />
                    {errors.name && <span className="text-red-500 text-sm pt-1">{errors.name.message}</span>}
                </div>

                <div className="flex flex-col">
                    <label htmlFor="company_description" className="font-semibold">Описание:</label>
                    <textarea
                        id="company_description"
                        autoComplete="off"
                        {...register('description', { required: 'Описание обязательно!' })}
                        className="w-full border border-neutral-200 rounded-lg outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-400 px-3 py-2 mt-1"
                        rows={9}
                    />
                    {errors.description && <span className="text-red-500 text-sm pt-1">{errors.description.message}</span>}
                </div>

                <button type="submit" className="mt-auto mx-auto w-full h-10 text-white text-lg hover:text-neutral-200 active:text-neutral-300 p-1 font-semibold text-center shadow-sm shadow-neutral-500 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700">
                    Сохранить
                </button>
            </form>
        </div>
    )
}