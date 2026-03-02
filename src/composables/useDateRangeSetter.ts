import { ref, Ref } from "vue";
import { PERIODOS } from "../constants/constants";
import dataUtils from "src/utils/data-utils";

export interface DateRangeSetter {
  dataInicial: Ref<Date>;
  dataFinal: Ref<Date | null>;
  periodoSelecionado: Ref<string>;
  diaSelecionado: Ref<number>;
  mesSelecionado: Ref<number>;
  anoSelecionado: Ref<number>;
  setDatesGivenPeriod: () => void;
}

export function useDateRangeSetter(): DateRangeSetter {
  const dataInicial = ref(new Date());
  const dataFinal = ref<Date | null>(new Date());
  const periodoSelecionado = ref(PERIODOS.HOJE);
  const diaSelecionado = ref(new Date().getDate());
  const mesSelecionado = ref(new Date().getMonth() + 1);
  const anoSelecionado = ref(new Date().getFullYear());

  const setDatesGivenPeriod = (): void => {
    switch (periodoSelecionado.value) {
      case PERIODOS.HOJE:
        _setDates(new Date(), null);
        break;
      case PERIODOS.ULTIMAS_SETENTA_E_DUAS_HORAS:
        _setDates(dataUtils.subtrairDias(3), dataUtils.somarDias(1));
        break;
      case PERIODOS.ULTIMOS_SETE_DIAS:
        _setDates(dataUtils.subtrairDias(7), dataUtils.somarDias(1));
        break;
      case PERIODOS.ULTIMOS_TRINTA_DIAS:
        _setDates(dataUtils.subtrairDias(30), dataUtils.somarDias(1));
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

  const setSpecificDay = (): void => {
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

  const setSpecificMonth = (): void => {
    const hoje = new Date();
    const { dataFinal: dFinal, dataInicial: dInicial } =
      dataUtils.definirDataInicialEFinalMes(
        mesSelecionado.value,
        anoSelecionado.value
      );

    if (dInicial > hoje)
      throw new Error("Não é possível obter dados do futuro!");

    _setDates(dInicial, dFinal);
  };

  const _setDates = (startDate: Date, endDate: Date | null): void => {
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
