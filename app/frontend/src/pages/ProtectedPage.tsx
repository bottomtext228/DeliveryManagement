export default function ProtectedPage() {
    return <div className="border rounded bg-neutral-600 text-center w-76 h-20 py-4 px-4">
        <div>This is <strong>protected</strong> page.</div>
        <div>You cannot see this if you are not logged in.</div>
    </div>
}