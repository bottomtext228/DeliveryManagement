import { PropsWithChildren, useState, useRef, useEffect, ReactElement, Children, isValidElement, cloneElement } from "react";

type Props = PropsWithChildren & {
    visibleClasses: string,
    hiddenClasses: string,
    duration: number,
    threshold?: number
    delay?: number
}

export function ScrollAnimation({ children, visibleClasses, hiddenClasses, duration, threshold, delay }: Props) {

    const [isVisible, setIsVisible] = useState<boolean>(false);
    const elementRef = useRef(null);


    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            {
                threshold: threshold ? threshold : 0.1
            }
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
                }, className: child.props.className + `  transition-all motion-reduce:transition-none ${isVisible ? visibleClasses : hiddenClasses}`
            })
        }
    }); 
}