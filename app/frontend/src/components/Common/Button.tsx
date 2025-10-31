interface Props {
    label: string,
    rounded?: 'lg' | 'xl',
    dark?: boolean
}

export default function Button({ label, rounded = 'xl', dark = false }: Props) {
    return (
        <button className={`p-2 text-xl w-full rounded-${rounded} ${dark ?
            "text-black bg-neutral-400 hover:bg-neutral-500 active:bg-neutral-600"
            : "bg-amber-400 hover:bg-amber-500 active:bg-amber-600"}`}>
            {label}
        </button>
    )
}
