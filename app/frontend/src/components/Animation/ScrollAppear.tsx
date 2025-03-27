import { PropsWithChildren, useState, useRef, useEffect } from "react";



export function ScrollAppear({ children, visibleClasses, hiddenClasses, duration }: PropsWithChildren & { visibleClasses: string, hiddenClasses: string, duration: number }) {

    const [isVisible, setIsVisible] = useState<boolean>(false);
    const elementRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
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

    return (

        
        <div
            ref={elementRef}
            className={`absolute transition-all top-[50%] left-[50%] ${isVisible ? visibleClasses : hiddenClasses}`}
            style={{ transitionDuration: `${duration}ms` }}
        >

            {children}
        </div>
    );


}