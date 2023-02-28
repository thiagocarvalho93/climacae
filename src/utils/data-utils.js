const calcularDiasMes = (ano, mes) => new Date(ano, mes + 1, 0).getDate();

const calcularDiaMesAtual = () =>
  new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();

export default { calcularDiasMes, calcularDiaMesAtual };
