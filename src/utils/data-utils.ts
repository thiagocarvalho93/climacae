/**
 * Obtem o dia e o mês atual, com horário zerado.
 */
const calcularDiaMesAtual = (): number =>
  new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();

/**
 * Subtrai horas de uma data.
 * @param {Date} data - data a ser subtraida.
 * @param {number} horas - horas a se subtrair.
 * @returns Retorna uma nova data com as horas subtraidas.
 */
const subtrairHoras = (data: Date, horas: number): Date => {
  const dateCopy = new Date(data);

  dateCopy.setHours(dateCopy.getHours() - horas);

  return dateCopy;
};

/**
 * Formata a data para o formato do parâmetro do endpoint da API.
 * @param {Date} data -data a ser formatada.
 * @returns retorna uma string da data no formato YYYYMMDD.
 */
const formatDateForQuery = (data: Date): string => {
  const year = data.getFullYear();
  const month = (data.getMonth() + 1).toString().padStart(2, "0");
  const day = data.getDate().toString().padStart(2, "0");
  return `${year}${month}${day}`;
};

/**
 * Define as datas inicial e final dado um mês e ano.
 * @param {number} mes - mês do ano.
 * @param {number} ano - ano.
 * @throws caso o mês do ano seja no futuro.
 * @returns retorna um objeto contendo dataInicial e dataFinal.
 */
const definirDataInicialEFinalMes = (
  mes: number,
  ano: number
): { dataInicial: Date; dataFinal: Date } => {
  const hoje = new Date();
  const isFuturo = mes > hoje.getMonth() + 1 && ano >= hoje.getFullYear();

  if (isFuturo) throw new Error("Não é possivel obter dados do futuro!");

  const dataInicial = new Date(ano, mes - 1, 1);

  const isEsseMes = mes === hoje.getMonth() + 1 && ano === hoje.getFullYear();

  const dataFinal = isEsseMes ? hoje : new Date(ano, mes, 0);

  return { dataInicial, dataFinal };
};

const formatarDataComUnderline = (data: Date | string | number): string => {
  const d = new Date(data);
  const dia = d.getDate();
  const mes = d.getMonth() + 1;
  const ano = d.getFullYear();

  return `${dia}_${mes}_${ano}`;
};

const subtrairDias = (diasAtras: number): Date => {
  return new Date(Date.now() - diasAtras * 24 * 60 * 60 * 1000);
};

const somarDias = (diasAFrente: number): Date => {
  return new Date(Date.now() + diasAFrente * 24 * 60 * 60 * 1000);
};

function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

export default {
  calcularDiaMesAtual,
  subtrairHoras,
  formatDateForQuery,
  definirDataInicialEFinalMes,
  formatarDataComUnderline,
  subtrairDias,
  somarDias,
  isToday,
};
