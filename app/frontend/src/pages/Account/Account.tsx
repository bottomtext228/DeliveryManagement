import { useAuth, useUser } from "../../hooks/useAuth"
export default function Account() {
    const user = useUser();
   return <>
        <div>
            {user?.email}
        </div>
    </>
}