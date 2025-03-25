import LoadingSpinner from "./LoadingSpinner";

export default function Loading() {

    return (<>
        <div className="flex flex-col items-center justify-center my-4 md:my-16">
            <div className="flex items-center justify-center">
                <LoadingSpinner></LoadingSpinner>
            </div>
            <pre className="pt-2 text-xl loading">Загрузка</pre>
        </div>
    </>)
}