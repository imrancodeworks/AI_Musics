import { useUI } from '../../context/UIContext';

export default function ComfortOverlay() {
  const { eyeCare } = useUI();
  
  if (!eyeCare) return null;

  return (
    <div className="comfort-overlay" aria-hidden="true" />
  );
}
