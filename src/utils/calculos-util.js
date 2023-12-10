/**
 * Calcula a sensação térmica
 * @param {number} velocidadeVento - velocidade do vento em km/h
 * @param {number} temperatura - temperatura em °C
 * @returns {number} Sensação térmica em °C
 */
const calcularSensacaoTermica = (velocidadeVento, temperatura) => {
  return (
    33 +
    ((10 * Math.sqrt(velocidadeVento) + 10.45 - velocidadeVento) *
      (temperatura - 22)) /
      22
  );
};

export default { calcularSensacaoTermica };
