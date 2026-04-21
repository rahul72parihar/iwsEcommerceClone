import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeToast } from '../../src/store/slices/uiSlice';
import '../../styles/Toast.css';


const Toast = () => {
  const dispatch = useDispatch();
  const toasts = useSelector(state => state.ui.toasts || []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (toasts.length > 0) {
        dispatch(removeToast());
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [toasts, dispatch]);

  if (toasts.length === 0) return null;

  const toast = toasts[toasts.length - 1];

  return (
    <div className={`toast-container ${toast.type}`}>
      <div className="toast">
        <div className="toast-icon">
          {toast.type === 'success' && '✅'}
          {toast.type === 'error' && '❌'}
        </div>
        <div className="toast-content">
          <div className="toast-message">{toast.message}</div>
        </div>
        <button className="toast-close" onClick={() => dispatch(removeToast())}>
          ×
        </button>
      </div>
    </div>
  );
};

export default Toast;

