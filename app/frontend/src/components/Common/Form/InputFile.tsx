import { forwardRef, InputHTMLAttributes, useState } from "react";
import { FieldError } from "react-hook-form";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    id: string;
    label: string;
    defaultSrc?: string;
    error?: FieldError;
    clearError: () => void; // hack to clear error field after file is set
}


const InputFile = forwardRef<HTMLInputElement, Props>(({ id, defaultSrc, error, clearError, ...props }, ref) => {
    const [fileSrc, setFileSrc] = useState<string | undefined>(defaultSrc);
    const [fileName, setFileName] = useState<string | undefined>();

    return (
        <div className="w-full mt-4">
            {fileSrc &&
                <div className="w-full h-full">
                    <img id="image-preview" className="object-contain w-full h-full border border-gray-200 rounded-xl p-2 mb-4" src={fileSrc}></img>
                </div>
            }
            {error && <div className="text-red-500">{error.message}</div>}
            <label htmlFor="image" className="flex w-full h-14.5 border border-gray-300 rounded-lg cursor-pointer hover:shadow-sm active:shadow-md">
                <div id='image-label' className="flex items-center justify-start p-3 overflow-hidden flex-4/5 text-ellipsis whitespace-nowrap">
                    {fileName ?? "Выберите файл..."}
                </div>
                <div className="flex items-center justify-center border-l border-gray-300 flex-1/5">
                    <img src="/upload-file.svg" className="w-12 h-12" draggable={false}></img>
                </div>
            </label>
            <input
                id={id}
                {...props}
                ref={ref}
                type="file"
                accept=".jpg, .jpeg, .png"
                className="w-0 h-0 opacity-0 overflow-hidden absolute -z-[1]" onChange={
                    (e: React.ChangeEvent<HTMLInputElement>) => {
                        const file = e.target.files?.item(0);
                        if (file) {
                            setFileName(file.name);
                            setFileSrc(URL.createObjectURL(file));
                            clearError();
                        }
                    }
                }></input>


        </div>
    )
});

export default InputFile;