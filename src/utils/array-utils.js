/**
 * Cria um array de números.
 * @param {number} start - o primeiro número.
 * @param {number} stop - o último número.
 * @param {number} step - o passo.
 * @returns retorna o array.
 */
const arrayRange = (start, stop, step) =>
  Array.from(
    { length: (stop - start) / step + 1 },
    (value, index) => start + index * step
  );

export default { arrayRange };
