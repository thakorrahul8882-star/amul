import React, { Component, ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class RootErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in application:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-200 p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl mx-auto flex items-center justify-center font-bold text-2xl font-serif">
              Amul
            </div>
            
            <h2 className="text-xl font-extrabold text-slate-900">
              અમૂલ પાર્લર ખોડાણા
            </h2>

            <p className="text-xs text-slate-600 leading-relaxed">
              એપ્લિકેશન લોડ કરવામાં ક્ષતિ આવી છે. કૃપા કરીને નીચેનું બટન દબાવી પેજ રીલોડ કરો.
            </p>

            {this.state.error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-left text-[11px] text-red-700 font-mono break-words overflow-auto max-h-32">
                {this.state.error.message || String(this.state.error)}
              </div>
            )}

            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-98"
            >
              પેજ ફરીથી લોડ કરો (Reload)
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <RootErrorBoundary>
    <App />
  </RootErrorBoundary>
);
