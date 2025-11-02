import { PropsWithChildren } from "react"
import { Link, LinkProps } from "react-router-dom";

type Props = PropsWithChildren<LinkProps>;

export default function LinkText({ children, ...rest }: Props) {
    return (
        <Link className="text-blue-600 hover:brightness-90 hover:underline active:brightness-80" {...rest}>{children}</Link>
    )
}