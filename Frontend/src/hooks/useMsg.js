import { useState } from "react";

export default function useNotification() {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const clearMessages = () => {
    setErrorMessage("");
    setSuccessMessage("");
  };

  return { errorMessage, successMessage, setErrorMessage, setSuccessMessage, clearMessages };
}
