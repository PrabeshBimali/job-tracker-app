import { type ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  width?: string;
  children: ReactNode;
}

export default function Modal(props: ModalProps) {
  const { isOpen, onClose, width, children } = props;

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);


  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose} 
      />
      
      <div
        className="relative flex max-h-[90vh] flex-col border border-secondary-color bg-background-color shadow-2xl"
        style={{width, maxWidth: "calc(100% - 2rem)"}}
      >
        <div className="overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}