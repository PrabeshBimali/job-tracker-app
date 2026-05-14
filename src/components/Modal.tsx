import { type ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";
import { CircleX } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export default function Modal(props: ModalProps) {
  const { isOpen, onClose, title, children } = props;

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose} 
      />
      
      <div className="relative w-full max-w-md bg-background-color border border-secondary-color rounded-xl shadow-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl text-center font-bold text-accent-color">{title}</h2>
          <button onClick={onClose} className="text-3xl text-text-color hover:text-red-500 cursor-pointer">
            <CircleX/>
          </button>
        </div>
        
        {children}
      </div>
    </div>,
    document.body
  );
}