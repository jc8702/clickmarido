"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import * as Sentry from "@sentry/nextjs";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    Sentry.captureException(error, { extra: { errorInfo } });
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center space-y-4">
          <h2 className="text-2xl font-bold text-red-600">Ops! Algo deu errado.</h2>
          <p className="text-gray-600 max-w-md">
            Desculpe, ocorreu um erro inesperado ao renderizar este componente. A equipe técnica já foi notificada.
          </p>
          <button
            onClick={this.handleRetry}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
