/**
 * Cria um array de números.
 * @param {number} start - o primeiro número.
 * @param {number} stop - o último número.
 * @param {number} step - o passo.
 * @returns retorna o array.
 */
const arrayRange = (start: number, stop: number, step: number): number[] =>
  Array.from(
    { length: (stop - start) / step + 1 },
    (_, index) => start + index * step
  );

export default { arrayRange };
