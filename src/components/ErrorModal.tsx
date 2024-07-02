// src/components/ErrorModal.tsx
import React from 'react';

interface ErrorModalProps {
    show: boolean;
    handleClose: () => void;
    message: string;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ show, handleClose, message }) => {
    return (
        <div className={`modal fade ${show ? 'show' : ''}`} style={{ display: show ? 'block' : 'none' }} tabIndex={-1} role="dialog">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Error</h5>
                    </div>
                    <div className="modal-body">
                        <p>{message}</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={handleClose}>Close</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ErrorModal;
