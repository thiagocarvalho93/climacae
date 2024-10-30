import { ref } from "vue";
import { PERIODOS } from "../constants/constants";
import dataUtils from "src/utils/data-utils";

export function useDateRangeSetter() {
  const dataInicial = ref(new Date());
  const dataFinal = ref(new Date());
  const periodoSelecionado = ref(PERIODOS.HOJE);
  const diaSelecionado = ref(new Date().getDate());
  const mesSelecionado = ref(new Date().getMonth() + 1);
  const anoSelecionado = ref(new Date().getFullYear());

  const setDatesGivenPeriod = () => {
    switch (periodoSelecionado.value) {
      case PERIODOS.HOJE:
        _setDates(new Date(), null);
        break;
      case PERIODOS.ULTIMAS_SETENTA_E_DUAS_HORAS:
        _setDates(dataUtils.subtrairDias(3), new Date());
        break;
      case PERIODOS.ULTIMOS_SETE_DIAS:
        _setDates(dataUtils.subtrairDias(7), new Date());
        break;
      case PERIODOS.ULTIMOS_TRINTA_DIAS:
        _setDates(dataUtils.subtrairDias(30), new Date());
        break;
      case PERIODOS.MES_ESPECIFICO:
        setSpecificMonth();
        break;
      case PERIODOS.DIA_ESPECIFICO:
        setSpecificDay();
        break;
      default:
        throw new Error("Período inválido!");
    }
  };

  const setSpecificDay = () => {
    const hoje = new Date();
    const dataSelecionada = new Date(
      anoSelecionado.value,
      mesSelecionado.value - 1,
      diaSelecionado.value
    );

    if (dataSelecionada > hoje)
      throw new Error("Não é possível obter dados do futuro!");

    _setDates(dataSelecionada, null);
  };

  const setSpecificMonth = () => {
    const hoje = new Date();
    const { dataFinal, dataInicial } = dataUtils.definirDataInicialEFinalMes(
      mesSelecionado.value,
      anoSelecionado.value
    );

    if (dataInicial > hoje)
      throw new Error("Não é possível obter dados do futuro!");

    _setDates(dataInicial, dataFinal);
  };

  const _setDates = (startDate, endDate) => {
    dataInicial.value = startDate;
    dataFinal.value = endDate;
  };

  return {
    dataInicial,
    dataFinal,
    periodoSelecionado,
    diaSelecionado,
    mesSelecionado,
    anoSelecionado,
    setDatesGivenPeriod,
  };
}
