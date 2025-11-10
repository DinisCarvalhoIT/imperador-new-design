import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type Ref,
} from "react";
import type { ReactElement } from "react";

import { PageFlip } from "./StPageFlip-updated/src/PageFlip";
import { SizeType } from "./StPageFlip-updated/src/Settings";
import type { IFlipSetting, IEventProps } from "./settings";

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
    const isInitializedRef = useRef<boolean>(false);

    const [pages, setPages] = useState<ReactElement[]>([]);
    const [, forceUpdate] = useState({});

    // Update ref whenever pageFlip.current changes
    useEffect(() => {
      if (pageFlip.current && typeof ref === "object" && ref !== null) {
        // Force update to ensure ref is set
        forceUpdate({});
      }
    }, [pageFlip.current, ref]);

    useImperativeHandle(ref, () => pageFlip.current, []);

    const refreshOnPageDelete = useCallback(() => {
      if (pageFlip.current) {
        pageFlip.current.clear();
      }
    }, []);

    useEffect(() => {
      childRef.current = [];

      if (props.children) {
        const childList = React.Children.map(props.children, (child, index) => {
          return (
            <div
              key={index}
              ref={(dom: HTMLDivElement | null) => {
                if (dom) {
                  // Remove old ref if it exists
                  const existingIndex = childRef.current.indexOf(dom);
                  if (existingIndex >= 0) {
                    childRef.current.splice(existingIndex, 1);
                  }
                  // Add new ref
                  childRef.current.push(dom);
                }
              }}
            >
              {child}
            </div>
          );
        });

        if (
          !props.renderOnlyPageLengthChange ||
          pages.length !== childList?.length
        ) {
          if (childList && childList.length < pages.length) {
            refreshOnPageDelete();
          }

          setPages(childList || []);
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.children]);

    useEffect(() => {
      let timeoutId: NodeJS.Timeout | null = null;
      let retryTimeoutId: NodeJS.Timeout | null = null;

      const setHandlers = () => {
        const flip = pageFlip.current;

        if (flip) {
          // Remove all existing handlers first
          flip.off("flip");
          flip.off("changeOrientation");
          flip.off("changeState");
          flip.off("init");
          flip.off("update");

          // Add new handlers
          if (props.onFlip) {
            flip.on("flip", (e: unknown) => {
              props.onFlip?.(e);
            });
          }

          if (props.onChangeOrientation) {
            flip.on("changeOrientation", (e: unknown) =>
              props.onChangeOrientation?.(e)
            );
          }

          if (props.onChangeState) {
            flip.on("changeState", (e: unknown) => props.onChangeState?.(e));
          }

          if (props.onInit) {
            flip.on("init", (e: unknown) => props.onInit?.(e));
          }

          if (props.onUpdate) {
            flip.on("update", (e: unknown) => props.onUpdate?.(e));
          }
        }
      };

      const checkAndInit = (attempt = 0) => {
        // Don't initialize if already initialized or if we've exceeded retries
        if (isInitializedRef.current && pageFlip.current?.getFlipController()) {
          // Already initialized, just update handlers
          setHandlers();
          return;
        }

        if (attempt >= 10) {
          console.warn("HTMLFlipBook: Failed to initialize after 10 attempts");
          return;
        }

        // Collect refs from the DOM - use children instead of querySelector
        if (htmlElementRef.current) {
          const pageElements = Array.from(
            htmlElementRef.current.children
          ) as HTMLElement[];
          if (pageElements.length > 0) {
            childRef.current = pageElements;
          }
        }

        // Check if we have everything we need - use childRef length instead of pages.length
        // because pages state might be unstable during React's double render in dev mode
        const expectedPages = pages.length || childRef.current.length;

        if (
          expectedPages > 0 &&
          childRef.current.length === expectedPages &&
          htmlElementRef.current
        ) {
          if (!pageFlip.current) {
            const flipSettings = {
              ...props,
              size: props.size === "fixed" ? SizeType.FIXED : SizeType.STRETCH,
            };
            pageFlip.current = new PageFlip(
              htmlElementRef.current,
              flipSettings
            );
          }

          if (pageFlip.current && !pageFlip.current.getFlipController()) {
            pageFlip.current.loadFromHTML(childRef.current);
            isInitializedRef.current = true;

            // Force ref update after PageFlip is created
            if (typeof ref === "object" && ref !== null && "current" in ref) {
              (ref as React.MutableRefObject<PageFlip | undefined>).current =
                pageFlip.current;
            }

            // Set handlers after initialization completes
            timeoutId = setTimeout(() => {
              setHandlers();
            }, 150);
          } else if (pageFlip.current && pageFlip.current.getFlipController()) {
            pageFlip.current.updateFromHtml(childRef.current);
            setHandlers();
          }
        } else {
          // Retry if refs aren't ready yet
          retryTimeoutId = setTimeout(() => checkAndInit(attempt + 1), 100);
        }
      };

      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        checkAndInit();
      });

      // Cleanup
      return () => {
        if (timeoutId) clearTimeout(timeoutId);
        if (retryTimeoutId) clearTimeout(retryTimeoutId);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
      pages,
      props.onFlip,
      props.onChangeOrientation,
      props.onChangeState,
      props.onInit,
      props.onUpdate,
    ]);

    // Update useMouseEvents setting dynamically when prop changes
    useEffect(() => {
      if (pageFlip.current && isInitializedRef.current) {
        const settings = pageFlip.current.getSettings();
        const ui = pageFlip.current.getUI();

        // Update the setting (TypeScript readonly doesn't prevent runtime modification)
        const previousValue = settings.useMouseEvents;
        const newValue = props.useMouseEvents ?? true;

        // Only update if the value actually changed
        if (previousValue !== newValue) {
          (settings as { useMouseEvents: boolean }).useMouseEvents = newValue;

          // Access protected methods through type assertion to update handlers
          const uiAny = ui as any;
          if (uiAny.removeHandlers && uiAny.setHandlers) {
            // Remove all handlers (including resize, but setHandlers will add it back)
            uiAny.removeHandlers();
            // Add handlers back (resize is always added, mouse/touch only if useMouseEvents is true)
            uiAny.setHandlers();
          }
        }
      }
    }, [props.useMouseEvents]);

    return (
      <div ref={htmlElementRef} className={props.className} style={props.style}>
        {pages}
      </div>
    );
  }
);

export const HTMLFlipBook = React.memo(HTMLFlipBookForward);
