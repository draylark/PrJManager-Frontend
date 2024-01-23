import ReactDOM from 'react-dom';

export const MyPortalTooltip = ({ children }) => {
  const tooltipRoot = document.getElementById('tooltip-root');
  return ReactDOM.createPortal(
    children,
    tooltipRoot
  );
};