import React, { useCallback, useEffect, useState } from 'react';

interface ResizeHandleProps {
    direction: 'horizontal' | 'vertical';
    onResize: (delta: number) => void;
    onResizeEnd?: () => void;
    className?: string;
}

export const ResizeHandle: React.FC<ResizeHandleProps> = ({
    direction,
    onResize,
    onResizeEnd,
    className = ''
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [startPos, setStartPos] = useState(0);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);
        setStartPos(direction === 'horizontal' ? e.clientX : e.clientY);
    }, [direction]);

    useEffect(() => {
        if (!isDragging) return;

        const handleMouseMove = (e: MouseEvent) => {
            const currentPos = direction === 'horizontal' ? e.clientX : e.clientY;
            const delta = currentPos - startPos;
            if (delta !== 0) {
                onResize(delta);
                setStartPos(currentPos);
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            onResizeEnd?.();
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, direction, startPos, onResize, onResizeEnd]);

    return (
        <div
            className={`resize-handle resize-handle-${direction} ${isDragging ? 'dragging' : ''} ${className}`}
            onMouseDown={handleMouseDown}
        />
    );
};
