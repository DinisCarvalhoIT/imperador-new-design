import React, {
    useCallback,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
    type Ref,
} from 'react';
import type { ReactElement } from 'react';

import { PageFlip } from './StPageFlip-updated/src/PageFlip';
import { SizeType } from './StPageFlip-updated/src/Settings';
import type { IFlipSetting, IEventProps } from './settings';

interface IProps extends IFlipSetting, IEventProps {
    className: string;
    style: React.CSSProperties;
    children: React.ReactNode;
    renderOnlyPageLengthChange?: boolean;
}

const HTMLFlipBookForward = React.forwardRef(
    (props: IProps, ref: Ref<PageFlip | undefined>) => {
        const htmlElementRef = useRef<HTMLDivElement>(null);
        const childRef = useRef<HTMLElement[]>([]);
        const pageFlip = useRef<PageFlip | undefined>(undefined);

        const [pages, setPages] = useState<ReactElement[]>([]);

        useImperativeHandle(ref, () => pageFlip.current, []);

        const refreshOnPageDelete = useCallback(() => {
            if (pageFlip.current) {
                pageFlip.current.clear();
            }
        }, []);

        const removeHandlers = useCallback(() => {
            const flip = pageFlip.current;

            if (flip) {
                flip.off('flip');
                flip.off('changeOrientation');
                flip.off('changeState');
                flip.off('init');
                flip.off('update');
            }
        }, []);

        useEffect(() => {
            childRef.current = [];

            if (props.children) {
                const childList = React.Children.map(props.children, (child, index) => {
                    return (
                        <div key={index} ref={(dom: HTMLDivElement | null) => {
                            if (dom && !childRef.current.includes(dom)) {
                                childRef.current.push(dom);
                            }
                        }}>
                            {child}
                        </div>
                    );
                });

                if (!props.renderOnlyPageLengthChange || pages.length !== childList?.length) {
                    if (childList && childList.length < pages.length) {
                        refreshOnPageDelete();
                    }

                    setPages(childList || []);
                }
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [props.children]);

        useEffect(() => {
            const setHandlers = () => {
                const flip = pageFlip.current;

                if (flip) {
                    if (props.onFlip) {
                        flip.on('flip', (e: unknown) => props.onFlip?.(e));
                    }

                    if (props.onChangeOrientation) {
                        flip.on('changeOrientation', (e: unknown) => props.onChangeOrientation?.(e));
                    }

                    if (props.onChangeState) {
                        flip.on('changeState', (e: unknown) => props.onChangeState?.(e));
                    }

                    if (props.onInit) {
                        flip.on('init', (e: unknown) => props.onInit?.(e));
                    }

                    if (props.onUpdate) {
                        flip.on('update', (e: unknown) => props.onUpdate?.(e));
                    }
                }
            };

            if (pages.length > 0 && childRef.current.length > 0) {
                removeHandlers();

                if (htmlElementRef.current && !pageFlip.current) {
                    const flipSettings = {
                        ...props,
                        size: props.size === 'fixed' ? SizeType.FIXED : SizeType.STRETCH,
                    };
                    pageFlip.current = new PageFlip(htmlElementRef.current, flipSettings);
                }

                if (pageFlip.current) {
                    if (!pageFlip.current.getFlipController()) {
                        pageFlip.current.loadFromHTML(childRef.current);
                    } else {
                        pageFlip.current.updateFromHtml(childRef.current);
                    }
                }

                setHandlers();
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [pages]);

        return (
            <div ref={htmlElementRef} className={props.className} style={props.style}>
                {pages}
            </div>
        );
    }
);

export const HTMLFlipBook = React.memo(HTMLFlipBookForward);