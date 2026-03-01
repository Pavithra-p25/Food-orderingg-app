import type { ReactElement } from "react";
import { render } from "@testing-library/react";
import { ErrorBoundary } from "react-error-boundary";
import { DialogSnackbarProvider } from "../context/DialogSnackbarContext";

const AllProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ErrorBoundary fallback={<div>Error</div>}>
      <DialogSnackbarProvider>
        {children}
      </DialogSnackbarProvider>
    </ErrorBoundary>
  );
};

const customRender = (ui: ReactElement) =>
  render(ui, { wrapper: AllProviders });

export * from "@testing-library/react";
export { customRender as render };