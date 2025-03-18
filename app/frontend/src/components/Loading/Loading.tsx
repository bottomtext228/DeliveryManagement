import LoadingSpinner from "./LoadingSpinner";

export default function Loading() {

    return (<>
        <div className="h-full flex flex-col justify-center items-center">
            <div className="flex items-center justify-center">
                <LoadingSpinner></LoadingSpinner>
            </div>
            <pre className="loading text-xl pt-2">Загрузка</pre>
        </div>
    </>)
}