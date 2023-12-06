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

export default {
  calcularDiasMes,
  calcularDiaMesAtual,
  subtrairHoras,
  formatDateForQuery,
};
