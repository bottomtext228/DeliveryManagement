export default function ProtectedPage() {
    return <div className="h-20 px-4 py-4 text-center border rounded bg-neutral-600 w-76">
        <div>This is <strong>protected</strong> page.</div>
        <div>You cannot see this if you are not logged in.</div>
    </div>
}