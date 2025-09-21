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
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
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

        }
    }

    return (
        <div className="border border-gray-200 rounded-xl p-2">
            <h2 className="font-semibold">
                Информация о компании
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <div>
                    <label className="font-semibold">Название:</label>
                    <input
                        type="text"
                        {...register('name', { required: 'Название обязательно!' })}
                        className="w-full border rounded px-3 py-2 mt-1"
                    />
                    {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
                </div>

                <div>
                    <label className="font-semibold">Описание:</label>
                    <textarea
                        {...register('description', { required: 'Описание обязательно!' })}
                        className="w-full border rounded px-3 py-2 mt-1"
                        rows={4}
                    />
                    {errors.description && <span className="text-red-500 text-sm">{errors.description.message}</span>}
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition-colors"
                >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
            </form>
        </div>
        /*  <div className="border border-gray-200 rounded-xl p-2">
             <h2 className="font-semibold">
                 Информация о компании
             </h2>
             <div>
                 Название: {company.name}
             </div>
             <div>
                 {company.description}
             </div>
         </div> */
    )
}
