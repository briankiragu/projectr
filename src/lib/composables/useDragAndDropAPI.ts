export type IDragHandlers = {
  onDragStart: (e: DragEvent) => void;
  onDragOver: (e: DragEvent) => void;
};

// Classes to apply during active drag events.
const isDraggingClasses = ['opacity-20'];

export default (): IDragHandlers => {
  const onDragStart = (e: DragEvent) => {
    (e.target as HTMLDivElement).classList.add(...isDraggingClasses);
  };

  const onDragOver = (e: DragEvent) => {
    (e.target as HTMLDivElement).classList.remove(...isDraggingClasses);
  };

  return {
    onDragStart,
    onDragOver,
  };
};
