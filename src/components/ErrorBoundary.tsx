import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * ErrorBoundary to catch failing chunks (e.g. user offline while navigating)
 * gracefully handling them with a proper UI instead of crashing.
 */
export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Chunk load error or rendering error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center space-y-4">
          <h2 className="text-2xl font-semibold text-slate-800">Failed to load content</h2>
          <p className="text-slate-500 max-w-md">
            We couldn't load the page you requested. This might be due to a network connection issue.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2 bg-blue-600 text-white rounded-md mt-4 hover:bg-blue-700 transition-colors shadow-sm"
          >
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
