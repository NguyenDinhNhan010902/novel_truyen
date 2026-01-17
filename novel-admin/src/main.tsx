import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

console.log('Main.tsx is running...');
try {
  const rootElement = document.getElementById('root');
  console.log('Root element:', rootElement);

  if (!rootElement) throw new Error('Root element not found');

  createRoot(rootElement).render(
    <StrictMode>
      <App />
      {/* <h1 style={{ color: 'red' }}>HELLO WORLD - DEBUGGING</h1> */}
    </StrictMode>,
  )
  console.log('Render called successfully.');
} catch (error) {
  console.error('Error during render:', error);
}
