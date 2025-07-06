import { PropsWithChildren } from 'react'



export default function ErrorBorder({ children }: PropsWithChildren) {
    return (
        <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded-lg mb-4">
            <h2 className="font-semibold text-lg mb-2">Ошибка</h2>
            {children}
        </div>
    )
}
