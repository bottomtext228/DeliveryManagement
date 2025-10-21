import { forwardRef, InputHTMLAttributes } from "react";
import { FieldError } from "react-hook-form";

interface Props extends InputHTMLAttributes<HTMLTextAreaElement> {
    id: string;
    label: string;
    rows?: number;
    error: FieldError | undefined;
}

const TextAreaField = forwardRef<HTMLTextAreaElement, Props>(
    ({ id, label, rows, error, ...props }, ref) => {
        return (
            <div className="relative mt-4">
                <textarea
                    id={id}
                    rows={rows}
                    ref={ref}
                    {...props}
                    placeholder=" "
                    className="block w-full outline-none border border-gray-300 focus:outline-none focus:ring-4 focus:border-blue-400 duration-150 focus:ring-blue-200 rounded-lg p-3 pt-6.5 pb-2.5 peer"
                />
                <label
                    htmlFor={id}
                    className="absolute pointer-events-none text-md text-black duration-100 peer-placeholder-shown:opacity-100 peer-focus:opacity-70 opacity-70 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
                >
                    {label}
                </label>
                {error && <div className="mt-1 text-red-500">{error.message}</div>}
            </div>
        );
    }
);

export default TextAreaField;