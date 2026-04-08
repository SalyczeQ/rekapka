"use client";

import { Component, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";

function ErrorFallback({
  error,
  onReset,
}: {
  error: Error | null;
  onReset: () => void;
}) {
  const t = useTranslations("error");

  return (
    <Card className="border-destructive">
      <CardContent className="py-8 text-center space-y-3">
        <AlertCircle className="h-8 w-8 text-destructive mx-auto" aria-hidden="true" />
        <h3 className="font-semibold">{t("title")}</h3>
        <p className="text-sm text-muted-foreground">
          {error?.message ?? t("description")}
        </p>
        <Button variant="outline" size="sm" onClick={onReset}>
          {t("tryAgain")}
        </Button>
      </CardContent>
    </Card>
  );
}

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <ErrorFallback
          error={this.state.error}
          onReset={() => this.setState({ hasError: false, error: null })}
        />
      );
    }

    return this.props.children;
  }
}
