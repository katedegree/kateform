import { useEffect, useImperativeHandle, useRef, useState } from "react";

export function usePopover(
  ref: React.Ref<HTMLInputElement> | undefined,
  popoverHeight: number
) {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  if (ref) {
    useImperativeHandle(ref, () => inputRef.current!);
  }

  const handleOpen = () => {
    inputRef.current && inputRef.current.focus();
  };
  const handleClose = () => {
    inputRef.current?.blur();
  };
  const updatePopoverPosition = () => {
    if (!popoverRef.current || !wrapperRef.current) return;
    const wrapperRect = wrapperRef.current.getBoundingClientRect();
    let parent: HTMLElement | null = wrapperRef.current.parentElement;
    let containerRect = {
      top: 0,
      bottom: window.innerHeight,
    };
    while (parent) {
      const style = getComputedStyle(parent);
      if (/(auto|scroll)/.test(style.overflow + style.overflowY)) {
        const rect = parent.getBoundingClientRect();
        containerRect = { top: rect.top, bottom: rect.bottom };
        break;
      }
      parent = parent.parentElement;
    }
    const spaceBelow = containerRect.bottom - wrapperRect.bottom;
    const spaceAbove = wrapperRect.top - containerRect.top;
    const isBottom =
      spaceBelow >= popoverHeight
        ? true
        : spaceAbove >= popoverHeight
        ? false
        : spaceBelow >= spaceAbove;
    const style = popoverRef.current.style;
    if (isBottom) {
      style.top = `calc(${wrapperRect.bottom}px + var(--kateform-spacing-sm))`;
      style.bottom = "";
    } else {
      style.bottom = `calc(${
        window.innerHeight - wrapperRect.top
      }px + var(--kateform-spacing-sm))`;
      style.top = "";
    }
    style.left = `${wrapperRect.left}px`;
    style.width = `${wrapperRect.width}px`;
    style.maxHeight = `${popoverHeight}px`;
  };

  // popoverの位置
  useEffect(() => {
    if (!isOpen) return;
    updatePopoverPosition();
    const observer = new ResizeObserver(() => {
      updatePopoverPosition();
    });
    if (wrapperRef.current) {
      observer.observe(wrapperRef.current);
    }
    window.addEventListener("scroll", updatePopoverPosition, true);
    window.addEventListener("resize", updatePopoverPosition);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updatePopoverPosition, true);
      window.removeEventListener("resize", updatePopoverPosition);
    };
  }, [isOpen, popoverHeight]);

  // focusとisOpenの同期
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    const handleFocus = () => setIsOpen(true);
    const handleBlur = () => setIsOpen(false);
    el.addEventListener("focus", handleFocus);
    el.addEventListener("blur", handleBlur);
    return () => {
      el.removeEventListener("focus", handleFocus);
      el.removeEventListener("blur", handleBlur);
    };
  }, []);

  // クリックイベント
  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      if (!wrapperRef.current) return;
      if (wrapperRef.current.contains(e.target as Node)) {
        e.preventDefault();
        handleOpen();
        return;
      }
      handleClose();
    };
    document.addEventListener("pointerdown", handlePointerDown, true);
    return () =>
      document.removeEventListener("pointerdown", handlePointerDown, true);
  }, []);

  // popover内のスクロールイベント
  useEffect(() => {
    if (!isOpen || !popoverRef.current) return;
    const el = popoverRef.current;
    let startY = 0;
    const handleWheel = (e: WheelEvent) => {
      if (!el.contains(e.target as Node)) return;
      const delta = e.deltaY;
      const atTop = el.scrollTop === 0;
      const atBottom = el.scrollHeight - el.scrollTop === el.clientHeight;
      if ((delta < 0 && atTop) || (delta > 0 && atBottom)) {
        e.preventDefault();
      }
    };
    const onTouchStart = (e: TouchEvent) => {
      if (!el.contains(e.target as Node) || !e.touches[0]) return;
      startY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!el.contains(e.target as Node) || !e.touches[0]) return;
      const currentY = e.touches[0].clientY;
      const delta = startY - currentY;
      const atTop = el.scrollTop === 0;
      const atBottom = el.scrollHeight - el.scrollTop === el.clientHeight;
      if ((delta < 0 && atTop) || (delta > 0 && atBottom)) {
        e.preventDefault();
      }
    };
    document.addEventListener("wheel", handleWheel, { passive: false });
    document.addEventListener("touchstart", onTouchStart, { passive: false });
    document.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => {
      document.removeEventListener("wheel", handleWheel);
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchmove", onTouchMove);
    };
  }, [isOpen]);

  // クリック, スクロール時に閉じる
  useEffect(() => {
    if (!isOpen) return;
    const handleScroll = (e: Event) => {
      const target = e.target as Node | null;
      if (popoverRef.current && target && popoverRef.current.contains(target)) {
        return;
      }
      handleClose();
    };
    document.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleScroll);
    return () => {
      document.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleScroll);
    };
  }, [isOpen]);

  // wrapperRefが変わった際にpopoverの位置を更新
  useEffect(() => {
    if (!isOpen || !wrapperRef.current) return;
    updatePopoverPosition();
    const observer = new ResizeObserver(() => {
      updatePopoverPosition();
    });
    observer.observe(wrapperRef.current);
    window.addEventListener("scroll", updatePopoverPosition, true);
    window.addEventListener("resize", updatePopoverPosition);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updatePopoverPosition, true);
      window.removeEventListener("resize", updatePopoverPosition);
    };
  }, [isOpen, popoverHeight]);

  return {
    isOpen,
    handleOpen,
    handleClose,
    inputRef,
    wrapperRef,
    popoverRef,
  };
}
