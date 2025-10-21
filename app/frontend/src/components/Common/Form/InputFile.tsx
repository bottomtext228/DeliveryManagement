import { forwardRef, InputHTMLAttributes } from "react";
import { FieldError } from "react-hook-form";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    id: string;
    label: string;
    type?: string;
    error: FieldError | undefined;
}


const InputFile = forwardRef<HTMLInputElement, Props>(({ id, ...props }) => {
    return (
        <div className="w-full mt-4">
            <label htmlFor="image" className="flex w-full h-12 my-4 border border-gray-300 rounded-lg">
                <div id='image-label' className="flex items-center justify-start p-3 overflow-hidden flex-4/5 text-ellipsis whitespace-nowrap">Выберите файл...</div>
                <div className="flex items-center justify-center border-l border-gray-300 flex-1/5"><img src="/upload-file.svg" className="w-12 h-12"></img></div>
            </label>
            <input
                id={id}
                {...props}
                type="file"
                accept=".jpg, .jpeg, .png"

                className="w-0 h-0 opacity-0 overflow-hidden absolute -z-[1]" onChange={
                    (e: React.ChangeEvent<HTMLInputElement>) => {
                        const file = e.target.files?.item(0);
                        if (file) {
                            const image = (document.querySelector('#image-preview')! as HTMLImageElement);
                            image.src = URL.createObjectURL(file);
                            (document.querySelector('#image-label')! as HTMLLabelElement).innerText = file.name;
                        }
                    }
                }></input>

        </div>
    )
});

export default InputFile;