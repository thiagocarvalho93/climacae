import { ref, Ref } from "vue";
import { PERIODS } from "../constants/constants";
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
  const selectedPeriod = ref(PERIODS.TODAY);
  const selectedDay = ref(new Date().getDate());
  const selectedMonth = ref(new Date().getMonth() + 1);
  const selectedYear = ref(new Date().getFullYear());

  const setDatesGivenPeriod = (): void => {
    switch (selectedPeriod.value) {
      case PERIODS.TODAY:
        _setDates(new Date(), null);
        break;
      case PERIODS.LAST_72_HOURS:
        _setDates(dataUtils.subtractDays(3), dataUtils.addDays(1));
        break;
      case PERIODS.LAST_7_DAYS:
        _setDates(dataUtils.subtractDays(7), dataUtils.addDays(1));
        break;
      case PERIODS.LAST_30_DAYS:
        _setDates(dataUtils.subtractDays(30), dataUtils.addDays(1));
        break;
      case PERIODS.SPECIFIC_MONTH:
        setSpecificMonth();
        break;
      case PERIODS.SPECIFIC_DAY:
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
