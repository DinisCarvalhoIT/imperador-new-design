import { useRef, useEffect, useState } from 'react';

interface Size {
    width: number;
    height: number;
}

interface UseRefSizeReturn extends Size {
    ref: React.RefObject<HTMLDivElement | null>;
    refreshSize: () => void;
}

const useRefSize = (): UseRefSizeReturn => {
    const ref = useRef<HTMLDivElement>(null);
    const [size, setSize] = useState<Size>({ width: 0, height: 0 });

    const handleResize = () => {
        if (ref.current) {
            setSize({
                width: ref.current.offsetWidth,
                height: ref.current.offsetHeight
            });
        }
    };

    useEffect(() => {
        handleResize(); // Initial width calculation

        const handleOrientationChange = () => {
            handleResize();
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('orientationchange', handleOrientationChange);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('orientationchange', handleOrientationChange);
        };
    }, []);

    const refreshSize = () => {
        handleResize();
    };

    return { ref, ...size, refreshSize };
};

export default useRefSize;

