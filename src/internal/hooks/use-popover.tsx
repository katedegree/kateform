import { useEffect, useImperativeHandle, useRef, useState } from "react";

export function usePopover(
  ref: React.Ref<HTMLInputElement> | undefined,
  popoverHeight: number
) {
  const [isOpen, setIsOpen] = useState(false);
  const [popoverPos, setPopoverPos] = useState({
    top: 0,
    bottom: 0,
    left: 0,
    width: 0,
    isBottom: true,
  });
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

  // popoverの位置
  useEffect(() => {
    if (!popoverRef.current) return;
    const style = popoverRef.current.style;
    style.top = popoverPos.isBottom
      ? `calc(${popoverPos.bottom}px + var(--kateform-spacing-sm))`
      : `calc(${popoverPos.top}px - ${popoverHeight}px - var(--kateform-spacing-sm))`;
    style.left = `${popoverPos.left}px`;
    style.width = `${popoverPos.width}px`;
    style.maxHeight = `${popoverHeight}px`;
  }, [popoverPos, popoverHeight]);

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

  // スクロール時のpopover位置
  useEffect(() => {
    if (!isOpen || !wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const initialIsBottom = spaceBelow >= popoverHeight;
    setPopoverPos({
      top: rect.top,
      bottom: rect.bottom,
      left: rect.left,
      width: rect.width,
      isBottom: initialIsBottom,
    });
    const updatePopoverPos = () => {
      if (!wrapperRef.current) return;
      const rect = wrapperRef.current.getBoundingClientRect();
      setPopoverPos((prev) => ({
        ...prev,
        top: rect.top,
        bottom: rect.bottom,
        left: rect.left,
        width: rect.width,
      }));
    };
    window.addEventListener("scroll", updatePopoverPos);
    window.addEventListener("resize", updatePopoverPos);
    return () => {
      window.removeEventListener("scroll", updatePopoverPos);
      window.removeEventListener("resize", updatePopoverPos);
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
