import { useQuasar } from "quasar";

export function useNotification() {
  const $q = useQuasar();

  const showErrorNotification = (message: string): void => {
    $q.notify({
      message: message,
      type: "negative",
      progress: true,
      position: "top",
      actions: [{ label: "Fechar", color: "white" }],
    });
  };

  return { showErrorNotification };
}
