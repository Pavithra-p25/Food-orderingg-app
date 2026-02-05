type HandleErrorParams = {
  error: any;
  showBoundary: (error: Error) => void;
  fallbackMessage: string;
};

export const handleError = ({
  error,
  showBoundary,
  fallbackMessage,
}: HandleErrorParams) => {
  //  SERVER DOWN - FULL PAGE
  if (error?.isServerDown) {
    showBoundary(error);
    return;
  }

  //  API / DOMAIN ERROR - THROW (snackbar handled by caller)
  throw new Error(error?.customMessage || fallbackMessage);
};
