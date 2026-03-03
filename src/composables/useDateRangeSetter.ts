import { ref, Ref } from "vue";
import { PERIODOS } from "../constants/constants";
import dataUtils from "src/utils/data-utils";

export interface DateRangeSetter {
  startDate: Ref<Date>;
  endDate: Ref<Date | null>;
  selectedPeriod: Ref<string>;
  selectedDay: Ref<number>;
  selectedMonth: Ref<number>;
  selectedYear: Ref<number>;
  setDatesGivenPeriod: () => void;
}

export function useDateRangeSetter(): DateRangeSetter {
  const startDate = ref(new Date());
  const endDate = ref<Date | null>(new Date());
  const selectedPeriod = ref(PERIODOS.HOJE);
  const selectedDay = ref(new Date().getDate());
  const selectedMonth = ref(new Date().getMonth() + 1);
  const selectedYear = ref(new Date().getFullYear());

  const setDatesGivenPeriod = (): void => {
    switch (selectedPeriod.value) {
      case PERIODOS.HOJE:
        _setDates(new Date(), null);
        break;
      case PERIODOS.ULTIMAS_SETENTA_E_DUAS_HORAS:
        _setDates(dataUtils.subtractDays(3), dataUtils.addDays(1));
        break;
      case PERIODOS.ULTIMOS_SETE_DIAS:
        _setDates(dataUtils.subtractDays(7), dataUtils.addDays(1));
        break;
      case PERIODOS.ULTIMOS_TRINTA_DIAS:
        _setDates(dataUtils.subtractDays(30), dataUtils.addDays(1));
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
    const today = new Date();
    const selectedDate = new Date(
      selectedYear.value,
      selectedMonth.value - 1,
      selectedDay.value
    );

    if (selectedDate > today)
      throw new Error("Não é possível obter dados do futuro!");

    _setDates(selectedDate, null);
  };

  const setSpecificMonth = (): void => {
    const today = new Date();
    const { endDate: dEnd, startDate: dStart } =
      dataUtils.defineMonthStartAndEndDates(
        selectedMonth.value,
        selectedYear.value
      );

    if (dStart > today)
      throw new Error("Não é possível obter dados do futuro!");

    _setDates(dStart, dEnd);
  };

  const _setDates = (start: Date, end: Date | null): void => {
    startDate.value = start;
    endDate.value = end;
  };

  return {
    startDate,
    endDate,
    selectedPeriod,
    selectedDay,
    selectedMonth,
    selectedYear,
    setDatesGivenPeriod,
  };
}
