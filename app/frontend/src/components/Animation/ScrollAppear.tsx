import { PropsWithChildren, useState, useRef, useEffect, ReactElement, Children, isValidElement, cloneElement } from "react";


type Props = PropsWithChildren & {
    visibleClasses: string,
    hiddenClasses: string,
    duration: number,
    threshold?: number
    delay?: number
}
export function ScrollAppear({ children, visibleClasses, hiddenClasses, duration, threshold, delay }: Props) {

    const [isVisible, setIsVisible] = useState<boolean>(false);
    const elementRef = useRef(null);


    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: threshold ? threshold : 0.1 }
        );

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => {
            if (elementRef.current) {
                observer.unobserve(elementRef.current);
            }
        };
    }, []);


    return Children.map(children, (child) => {

        if (isValidElement(child)) {
            return cloneElement(child as ReactElement, {
                ref: elementRef, style: {
                    transitionDuration: `${duration}ms`,
                    transitionDelay: `${delay}ms`
                }, className: child.props.className + ` transition-all top-[50%] left-[50%] ${isVisible ? visibleClasses : hiddenClasses}`
            })
        }
    });
    /*   return (
          React.cloneElement(children, { ref: elementRef, className: children.props.className + ` transition-all duration-1000 top-[50%] left-[50%] ${isVisible ? visibleClasses : hiddenClasses}` })
   */
    /*         <div
                ref={elementRef}
                className={`absolute transition-all top-[50%] left-[50%] ${isVisible ? visibleClasses : hiddenClasses}`}
                style={{ transitionDuration: `${duration}ms` }}
            >
    
                {children}
            </div> */
    /*   ); */


}

/* 
type StylizeChildrenProps = {
    children?: ReactNode
    className: React.HTMLAttributes<any>['className']
}

export function StylizeChildren({ children, className = '' }: StylizeChildrenProps) {
    if (children == null) return null;

    className = className.trim();
    if (!className) return <>{children}</>

    return <>
        {React.Children.map(children, child => addClassToNode(child, className))}
    </>
}

// Separate out into its own function because Promise-like nodes require this to be recursive
export function addClassToNode(node: ReactNode, className: string): ReactNode {
    if (node == null) {
        node satisfies null | undefined

        return node
    }

    if (typeof node !== 'object') {
        node satisfies string | number | boolean

        // wrap in a span, somewhat arbitrary decision
        return <span className={className}>{node}</span>
    }

    if ('props' in node) {
        node satisfies ReactElement | ReactPortal

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const existing: unknown = node?.props?.className;
        if (existing && typeof existing === 'string') {
            className = `${existing} ${className}`
        }
        return React.cloneElement(node, { className })
    }


    // wrap in div, somewhat arbitrary decision
    return <div className={className}>{node}</div>
} */