import { Component, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

function isIgnoredError(error: any): boolean {
  if (!error) return false;
  const msg = String(error?.message || error).toLowerCase();
  const name = String(error?.name || '').toLowerCase();
  return (
    msg.includes('$$typeof') ||
    msg.includes('cross-origin') ||
    msg.includes('blocked a frame') ||
    msg.includes('should not already be working') ||
    msg.includes('securityerror') ||
    msg.includes('websocket') ||
    msg.includes('closed without opened') ||
    msg.includes('failed to connect to websocket') ||
    name.includes('securityerror')
  );
}

// Global window event interceptors for cross-origin iframe security errors
if (typeof window !== 'undefined') {
  const origOnError = window.onerror;
  window.onerror = (message, source, lineno, colno, error) => {
    if (isIgnoredError(message) || (error && isIgnoredError(error))) {
      return true;
    }
    if (typeof origOnError === 'function') {
      return origOnError(message, source, lineno, colno, error);
    }
    return false;
  };

  window.addEventListener(
    'error',
    (event) => {
      if (isIgnoredError(event.message) || (event.error && isIgnoredError(event.error))) {
        event.preventDefault();
        event.stopImmediatePropagation();
        return true;
      }
    },
    true
  );

  window.addEventListener(
    'unhandledrejection',
    (event) => {
      const reason = event.reason?.message || String(event.reason || '');
      if (isIgnoredError(reason)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    },
    true
  );
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMsg: string;
}

class SafeErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, errorMsg: '' };
  }

  static getDerivedStateFromError(error: any): Partial<ErrorBoundaryState> | null {
    if (isIgnoredError(error)) {
      return null;
    }
    return {
      hasError: true,
      errorMsg: error?.message || 'An unexpected error occurred',
    };
  }

  componentDidCatch(error: any, errorInfo: any) {
    if (isIgnoredError(error)) {
      return;
    }
    console.warn('[SafeErrorBoundary caught]', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#121110] text-amber-200 flex flex-col items-center justify-center p-6 text-center font-khmer">
          <div className="max-w-md p-6 bg-black/60 border border-amber-500/30 rounded-2xl backdrop-blur-md">
            <h2 className="text-lg font-bold text-amber-300 mb-2">មានបញ្ហាក្នុងការបង្ហាញ</h2>
            <p className="text-sm text-neutral-300 mb-4">{this.state.errorMsg}</p>
            <button
              onClick={() => {
                this.setState({ hasError: false, errorMsg: '' });
                window.location.reload();
              }}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 font-bold rounded-xl text-sm cursor-pointer"
            >
              ផ្ទុកឡើងវិញ / Reload
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const container = document.getElementById('root')!;
const root = createRoot(container, {
  onUncaughtError(error) {
    if (isIgnoredError(error)) return;
    console.error('[React Uncaught]', error);
  },
  onCaughtError(error) {
    if (isIgnoredError(error)) return;
    console.warn('[React Caught]', error);
  },
  onRecoverableError(error) {
    if (isIgnoredError(error)) return;
    console.warn('[React Recoverable]', error);
  },
});

root.render(
  <SafeErrorBoundary>
    <App />
  </SafeErrorBoundary>
);
