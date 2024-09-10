import type { DaysStateTypes } from "./PickerTypes";

/**
 * Extra methods most implements by MultiSelectPicker
 * @public
 */
export interface IMultiSelectPicker {
  /**
   * Use to change date, (handler given to day)
   *
   * @param date - date as `YYYY-MM-DD`
   */
  changeDay(date: string): void;

  /**
   * Get selected dates as a Map
   */
  getSelectedDates(): Map<string, number>;

  /**
   * If selection map is not empty returns first item - formatted
   */
  getFirstSelectedDate(): string;

  /**
   * If selection map is not empty returns first item - unformatted
   */
  getFirstSelectedDateUnformatted(): string;

  /**
   * Add to selection Map
   *
   * @param date - date as `YYYY-MM-DD`
   */
  addDate(date: string): void;

  /**
   * Remove from selection Map
   *
   * @param date - date as `YYYY-MM-DD`
   */
  removeDate(date: string): void;

  /**
   * Add or remove from selection Map
   *
   * @param date - date as `YYYY-MM-DD`
   */
  toggleDate(date: string): void;

  /**
   * Clear selection Map
   */
  clearSelection(): void;

  /**
   * Use to range selection
   *
   * @param date - date as `YYYY-MM-DD`
   * @param state - day state
   */
  selectInRange(date: string, state: DaysStateTypes): void;

  /**
   * Check if state of picker is 'selecting'
   */
  isSelecting(): boolean;

  /**
   * Get end Date
   */
  getEndDate(): string;

  /**
   * Called on picker cell hover.
   *
   * @param date - date as `YYYY-MM-DD`
   */
  onCellHover(date: string): void;

  /**
   * Check if date input is in range - used for styling
   * @param date - date as `YYYY-MM-DD`
   * @param includeStart - Whether count start or not
   * @param includeEnd - Whether count end or not
   */
  isDateInRange(
    date: string,
    includeStart?: boolean,
    includeEnd?: boolean,
  ): boolean;

  /**
   * Check if date input equals to start date
   * @param date - date as `YYYY-MM-DD`
   */
  isStartDate(date: string): boolean;

  /**
   * Check if date input equals to end date
   * @param date - date as `YYYY-MM-DD`
   */
  isEndDate(date: string): boolean;
}
