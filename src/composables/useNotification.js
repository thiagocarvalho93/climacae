import { useQuasar } from "quasar";

export function useNotification() {
  const $q = useQuasar();

  const mensagemErro = (mensagem) => {
    $q.notify({
      message: mensagem,
      type: "negative",
      progress: true,
      position: "top",
      actions: [{ label: "Fechar", color: "white" }],
    });
  };

  return { mensagemErro };
}
