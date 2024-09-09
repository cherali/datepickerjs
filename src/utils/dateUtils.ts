const datePattern = /^\d{4}-[01]\d-[0-3]\d$/;

/**
 * Check if input date matches the `YYYY-MM-DD` format, throw error if not
 * @param date - date as string with YYYY-MM-DD
 * @public
 */
export function validateDate(date: string) {
  if (!date.match(datePattern) && date) {
    throw new Error(
      "Invalid Date Format, only YYYY-MM-DD date format is allowed.",
    );
  }
}

/**
 * if input date matches `YYYY-MM-DD` formant return true otherwise return false
 * @param date - date as string with YYYY-MM-DD
 * @returns return true or false
 * @public
 */
export function isValidDateFormat(date?: string): boolean {
  return Boolean(
    typeof date === "string" &&
      date.match(datePattern) &&
      !isNaN(new Date(date).getTime()),
  );
}

/**
 * Return the date part of Date ISOString format, i.e: YYYY-MM-DD
 * @param date - date as string with YYYY-MM-DD
 * @returns empty if called with no input, otherwise returns date in YYYY-MM-DD format
 * @public
 */
export function formatDate(date?: Date) {
  if (!date) return "";

  const isoDate = date.toISOString();

  return isoDate.slice(0, isoDate.indexOf("T"));
}

/**
 * Return Year part of given date as YYYY-MM-DD, throw error if date format is invalid
 * @param date - date as string with YYYY-MM-DD
 * @returns number
 * @internal
 */
export function getFullYear(date: string): number {
  validateDate(date);

  return Number(date.slice(0, 4));
}

/**
 * Return month part of given date as YYYY-MM-DD, throw error if date format is invalid
 * @param date - date as string with YYYY-MM-DD
 * @returns number
 * @internal
 */
export function getMonth(date: string): number {
  validateDate(date);

  return Number(date.slice(date.indexOf("-") + 1, date.lastIndexOf("-")));
}

/**
 * Return month part of given date as YYYY-MM-DD, throw error if date format is invalid
 * @param date - date as string with YYYY-MM-DD
 * @returns number
 * @internal
 */
export function getDate(date: string): number {
  validateDate(date);

  return Number(date.slice(date.lastIndexOf("-") + 1));
}

/**
 * Add zero to start of number
 * @param number - input number
 * @returns number equal to 1 returns `01`, number equal to 29 returns `29`
 * @public
 */
export function addZero(number: number): string {
  return number < 10 ? `0${number}` : number.toString();
}

/**
 * Create Date in UTC time
 * @param date - date as string with YYYY-MM-DD
 * @returns A date in JS Date format
 * @public
 */
export function createDate(date?: string) {
  if (date) validateDate(date);

  const newDate = new Date(date || new Date());
  return new Date(
    new Date(
      newDate.getTime() - newDate.getTimezoneOffset() * 60000,
    ).toISOString(),
  );
}
