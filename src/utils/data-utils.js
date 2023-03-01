const calcularDiasMes = (ano, mes) => new Date(ano, mes + 1, 0).getDate();

const calcularDiaMesAtual = () =>
  new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();

const subtrairHoras = (data, horas) => {
  const dateCopy = new Date(data);

  dateCopy.setHours(dateCopy.getHours() - horas);

  return dateCopy;
};

export default { calcularDiasMes, calcularDiaMesAtual, subtrairHoras };
