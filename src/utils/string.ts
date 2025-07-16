/**
 * Converts a string to kebab-case.
 * @param str - The input string.
 * @returns The kebab-case version of the string.
 */
export function toKebab(str: string): string {
  const words = normalizeWords(str);
  return words.map((word) => word.toLowerCase()).join('-');
}

/**
 * Converts a string to camelCase.
 * @param str - The input string.
 * @returns The camelCase version of the string.
 */
export function toCamel(str: string): string {
  const words = normalizeWords(str);
  return words
    .map((word, index) => (index === 0 ? word.toLowerCase() : capitalize(word)))
    .join('');
}

/**
 * Converts a string to PascalCase.
 * @param str - The input string.
 * @returns The PascalCase version of the string.
 */
export function toPascal(str: string): string {
  const words = normalizeWords(str);
  return words.map(capitalize).join('');
}

/**
 * Converts a string to snake_case.
 * @param str - The input string.
 * @returns The snake_case version of the string.
 */
export function toSnake(str: string): string {
  const words = normalizeWords(str);
  return words.map((word) => word.toLowerCase()).join('_');
}

/**
 * Converts a string to Title Case.
 * @param str - The input string.
 * @returns The Title Case version of the string.
 */
export function toTitleCase(str: string): string {
  const words = normalizeWords(str);
  return words.map(capitalize).join(' ');
}

/**
 * Converts a string to Train-Case (each word capitalized, joined by hyphens).
 * @param str - The input string.
 * @returns The Train-Case version of the string.
 */
export function toTrainCase(str: string): string {
  const words = normalizeWords(str);
  return words.map(capitalize).join('-');
}

/**
 * Capitalizes the first character of a string.
 * @param str - The input string.
 * @returns The string with the first character capitalized.
 */
export function capitalize(str: string): string {
  if (str.length === 0) {
    return '';
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Splits a string into normalized words for case conversion.
 * @param str - The input string.
 * @returns An array of words.
 * @private
 */
function normalizeWords(str: string): string[] {
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_\-.]+/g, ' ')
    .toLowerCase()
    .trim()
    .split(/\s+/);
}
