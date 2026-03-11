import React, { createContext, useContext, useState, type ReactNode } from 'react';
import StatusModal from '../components/ui/StatusModal';

interface ModalContextType {
    showSuccess: (title: string, message: string, onConfirm?: () => void) => void;
    showError: (title: string, message: string, onConfirm?: () => void) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [modalState, setModalState] = useState<{
        isOpen: boolean;
        type: 'success' | 'error';
        title: string;
        message: string;
        onConfirm?: () => void;
    }>({
        isOpen: false,
        type: 'success',
        title: '',
        message: '',
    });

    const showSuccess = (title: string, message: string, onConfirm?: () => void) => {
        setModalState({
            isOpen: true,
            type: 'success',
            title,
            message,
            onConfirm
        });
    };

    const showError = (title: string, message: string, onConfirm?: () => void) => {
        setModalState({
            isOpen: true,
            type: 'error',
            title,
            message,
            onConfirm
        });
    };

    const handleClose = () => {
        setModalState(prev => ({ ...prev, isOpen: false }));
        if (modalState.onConfirm) {
            modalState.onConfirm();
        }
    };

    return (
        <ModalContext.Provider value={{ showSuccess, showError }}>
            {children}
            <StatusModal
                isOpen={modalState.isOpen}
                onClose={handleClose}
                type={modalState.type}
                title={modalState.title}
                message={modalState.message}
            />
        </ModalContext.Provider>
    );
};

export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
};
