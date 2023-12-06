const calcularDiasMes = (ano, mes) => new Date(ano, mes + 1, 0).getDate();

const calcularDiaMesAtual = () =>
  new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();

const subtrairHoras = (data, horas) => {
  const dateCopy = new Date(data);

  dateCopy.setHours(dateCopy.getHours() - horas);

  return dateCopy;
};

const formatDateForQuery = (data) => {
  return `${data.getFullYear()}${data.getMonth() + 1 < 10 ? "0" : ""}${
    data.getMonth() + 1
  }${data.getDate() < 10 ? "0" : ""}${data.getDate()}`;
};

const definirDataInicialEFinalMes = (mes, ano) => {
  const hoje = new Date();
  let isFuturo = mes > hoje.getMonth() + 1 && ano >= hoje.getFullYear();

  if (isFuturo) throw new Error("Não é possivel obter dados do futuro!");

  const dataInicial = new Date(ano, mes - 1, 1);

  let isEsseMes = mes == hoje.getMonth() + 1 && ano == hoje.getFullYear();

  const dataFinal = isEsseMes ? hoje : new Date(ano, mes, 0);

  return { dataInicial, dataFinal };
};

export default {
  calcularDiasMes,
  calcularDiaMesAtual,
  subtrairHoras,
  formatDateForQuery,
  definirDataInicialEFinalMes,
};
