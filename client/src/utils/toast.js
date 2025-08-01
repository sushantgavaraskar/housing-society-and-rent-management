import { useToast } from '../contexts/ToastContext';

export const showToast = (message, type = 'info', duration = 5000) => {
  // This will be used by the AuthContext
  // The actual toast will be handled by the ToastContainer component
  console.log(`Toast: ${message} (${type})`);
};

export const useShowToast = () => {
  const { addToast } = useToast();
  
  return (message, type = 'info', duration = 5000) => {
    addToast(message, type, duration);
  };
}; 