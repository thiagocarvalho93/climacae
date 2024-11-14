/**
 * Obtem o dia e o mês atual, com horário zerado.
 */
const calcularDiaMesAtual = () =>
  new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();

/**
 * Subtrai horas de uma data.
 * @param {Date} data - data a ser subtraida.
 * @param {number} horas - horas a se subtrair.
 * @returns Retorna uma nova data com as horas subtraidas.
 */
const subtrairHoras = (data, horas) => {
  const dateCopy = new Date(data);

  dateCopy.setHours(dateCopy.getHours() - horas);

  return dateCopy;
};

/**
 * Formata a data para o formato do parâmetro do endpoint da API.
 * @param {Date} data -data a ser formatada.
 * @returns retorna uma string da data no formato YYYYMMDD.
 */
const formatDateForQuery = (data) => {
  return `${data.getFullYear()}${data.getMonth() + 1 < 10 ? "0" : ""}${
    data.getMonth() + 1
  }${data.getDate() < 10 ? "0" : ""}${data.getDate()}`;
};

/**
 * Define as datas inicial e final dado um mês e ano.
 * @param {number} mes - mês do ano.
 * @param {number} ano - ano.
 * @throws caso o mês do ano seja no futuro.
 * @returns retorna um objeto contendo dataInicial e dataFinal.
 */
const definirDataInicialEFinalMes = (mes, ano) => {
  const hoje = new Date();
  let isFuturo = mes > hoje.getMonth() + 1 && ano >= hoje.getFullYear();

  if (isFuturo) throw new Error("Não é possivel obter dados do futuro!");

  const dataInicial = new Date(ano, mes - 1, 1);

  let isEsseMes = mes == hoje.getMonth() + 1 && ano == hoje.getFullYear();

  const dataFinal = isEsseMes ? hoje : new Date(ano, mes, 0);

  return { dataInicial, dataFinal };
};

const formatarDataComUnderline = (data) => {
  const dia = new Date(data).getDate();
  const mes = new Date(data).getMonth() + 1;
  const ano = new Date(data).getFullYear();

  return `${dia}_${mes}_${ano}`;
};

const subtrairDias = (diasAtras) => {
  return new Date(Date.now() - diasAtras * 24 * 60 * 60 * 1000);
};

const somarDias = (diasAFrente) => {
  return new Date(Date.now() + diasAFrente * 24 * 60 * 60 * 1000);
};

function isToday(date) {
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
