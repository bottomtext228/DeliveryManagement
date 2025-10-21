interface Props {
    isPasswordVisible: boolean,
    setIsPasswordVisible: (isVisible: boolean) => void;
}

export default function ShowPassword({ isPasswordVisible, setIsPasswordVisible }: Props) {

    return (
        <button
            type='button' className="absolute flex items-center justify-around w-6 -translate-y-1/2 right-2 top-1/2 group"
            onClick={() => { setIsPasswordVisible(!isPasswordVisible) }}
        >
            <img className="w-6 h-6 filter opacity-30 hover:opacity-80 active:opacity-90" src={isPasswordVisible ? '/eye-on.svg' : '/eye-off.svg'} draggable={false}></img>
            <span className="absolute px-2 py-1 mb-1 text-sm text-white transition-opacity -translate-x-1/2 bg-gray-800 rounded opacity-0 left-1/2 bottom-full group-hover:opacity-100 whitespace-nowrap">
                {isPasswordVisible ? "Скрыть пароль" : "Показать пароль"}
            </span>
        </button>
    )
}
