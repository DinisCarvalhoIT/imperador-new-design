import { useState, useEffect } from 'react';

interface ScreenSize {
    width: number;
    height: number;
}

function useScreenSize(): ScreenSize {
    const [screenSize, setScreenSize] = useState<ScreenSize>({
        width: 0,
        height: 0
    });
    useEffect(() => {
        const updateScreenSize = () => {
            if (window) {
                setScreenSize({
                    width: window.innerWidth,
                    height: window.innerHeight
                });
            }
        };
        updateScreenSize();
        window.addEventListener('resize', updateScreenSize);
        return () => {
            window.removeEventListener('resize', updateScreenSize);
        };
    }, []);

    return screenSize;
}

export default useScreenSize;

