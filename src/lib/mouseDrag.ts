
export interface MouseDragInitialiser
{
    event: MouseEvent;
    startX?: number;
    startY?: number;
    minX?: number;
    maxX?: number;
    minY?: number;
    maxY?: number;
    onMouseMove: (update: MouseDragUpdate) => void;
}

export interface MouseDragUpdate
{
    currentX: number;
    currentY: number;
    constrainedX: number;
    constrainedY: number;
    deltaX: number;
    deltaY: number;
    cancel: () => void;
}

export type MouseDragResolve = Omit<MouseDragUpdate, 'cancel'> & { wasCancelled: boolean };

export function mouseDrag(
    initialiser: MouseDragInitialiser,
): Promise<MouseDragResolve>
{
    return new Promise((resolve) =>
    {
        const { event, startX, startY, minX, minY, maxX, maxY, onMouseMove } = initialiser;
        const { clientX: startClientX, clientY: startClientY } = event;
        const root = document.documentElement;

        const hasMinX = typeof minX === 'number';
        const hasMaxX = typeof maxX === 'number';
        const hasMinY = typeof minY === 'number';
        const hasMaxY = typeof maxY === 'number';

        let wasCancelled = false;
        let deltaX = 0;
        let deltaY = 0;
        let currentX = startX ?? 0;
        let currentY = startY ?? 0;
        let constrainedX = Math.max(hasMinX ? minX : -Infinity, Math.min(hasMaxX ? maxX : Infinity, currentX));
        let constrainedY = Math.max(hasMinY ? minY : -Infinity, Math.min(hasMaxY ? maxY : Infinity, currentY));

        function cancel()
        {
            wasCancelled = true;
            complete();
        }

        function complete()
        {
            root.removeEventListener('mousemove', moveHandler);
            root.removeEventListener('mouseup', complete);
            root.removeEventListener('keydown', keyHandler);

            resolve({ currentX, currentY, deltaX, deltaY, constrainedX, constrainedY, wasCancelled });
        }

        function moveHandler(e: MouseEvent)
        {
            deltaX = e.clientX - startClientX;
            deltaY = e.clientY - startClientY;
            currentX = (startX ?? 0) + deltaX;
            currentY = (startY ?? 0) + deltaY;
            constrainedX = Math.max(hasMinX ? minX : -Infinity, Math.min(hasMaxX ? maxX : Infinity, currentX));
            constrainedY = Math.max(hasMinY ? minY : -Infinity, Math.min(hasMaxY ? maxY : Infinity, currentY));

            if (onMouseMove)
            {
                onMouseMove({ currentX, currentY, deltaX, deltaY, constrainedX, constrainedY, cancel });
            }
        }

        function keyHandler(e: KeyboardEvent)
        {
            e.key === 'Escape' && cancel();
        }

        root.addEventListener('mousemove', moveHandler);
        root.addEventListener('mouseup', complete);
        root.addEventListener('keydown', keyHandler);
    });
}

