import { useUI } from '../context/UIContext';

export default function Notification() {
  const { message, visible } = useUI();
  
  return (
    <div className={`notification ${visible ? 'show' : ''}`}>
      {message}
    </div>
  );
}
