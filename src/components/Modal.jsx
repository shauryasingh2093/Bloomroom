// Reusable Modal Component
import { useEffect } from 'react';

const Modal = ({
    isOpen,
    onClose,
    children,
    title = '',
    className = ''
}) => {
    // Close on escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-sage-900/40 backdrop-blur-sm animate-fade-in"
            onClick={onClose}
        >
            <div
                className={`relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto m-4 animate-fade-in ${className}`.trim()}
                onClick={(e) => e.stopPropagation()}
            >
                {title && (
                    <div className="flex items-center justify-between p-6 border-b border-sage-100">
                        <h3 className="text-2xl font-medium text-sage-900">{title}</h3>
                        <button
                            className="w-8 h-8 flex items-center justify-center text-3xl text-sage-400 bg-transparent border-none cursor-pointer rounded-full transition-all duration-300 hover:bg-sage-100 hover:text-sage-600"
                            onClick={onClose}
                            aria-label="Close"
                        >
                            ×
                        </button>
                    </div>
                )}
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
