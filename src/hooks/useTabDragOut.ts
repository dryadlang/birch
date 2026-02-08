import { useState, useEffect } from 'react';

interface TabDragOutState {
    isDraggingOut: boolean;
    screenX: number;
    screenY: number;
}

export const useTabDragOut = () => {
    const [dragState, setDragState] = useState<TabDragOutState>({
        isDraggingOut: false,
        screenX: 0,
        screenY: 0
    });

    useEffect(() => {
        const handleDrag = (e: DragEvent) => {
            // Check if cursor is outside window bounds
            const isOutside =
                e.screenX < window.screenX ||
                e.screenX > window.screenX + window.outerWidth ||
                e.screenY < window.screenY ||
                e.screenY > window.screenY + window.outerHeight;

            if (isOutside) {
                setDragState({
                    isDraggingOut: true,
                    screenX: e.screenX,
                    screenY: e.screenY
                });
            } else {
                setDragState(prev => prev.isDraggingOut ? { ...prev, isDraggingOut: false } : prev);
            }
        };

        const handleDragEnd = () => {
            if (dragState.isDraggingOut) {
                // Here we would trigger the actual window creation
                console.log('Tab dragged out! Creating new window at', createState.screenX, createState.screenY);
                // Reset state
                setDragState({ isDraggingOut: false, screenX: 0, screenY: 0 });
            }
        };

        const createState = dragState; // Capture for closure

        window.addEventListener('drag', handleDrag);
        window.addEventListener('dragend', handleDragEnd);

        return () => {
            window.removeEventListener('drag', handleDrag);
            window.removeEventListener('dragend', handleDragEnd);
        };
    }, [dragState.isDraggingOut]);

    return dragState;
};
