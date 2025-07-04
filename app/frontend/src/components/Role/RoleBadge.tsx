

const roleNames: Record<string, string> = {
    client: 'Клиент',
    company: 'Компания'
}

interface Props {
    roles: string[]
}
export default function RoleBadge({ roles }: Props) {
    return (
        <>
            <div>
                {roles.map(role => (
                    <span className="font-mono" key={role}>{roleNames[role] ?? 'unknown'}</span>
                ))}
            </div>
        </>
    )
}
