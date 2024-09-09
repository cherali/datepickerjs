/**
 * Extra methods most implements by RangePicker
 * @public
 */
export interface IRangePicker {
  /**
   * Get formatted selected date
   */
  getSelectedEndDate(): string | undefined;

  /**
   * Get selected end date unformatted
   */
  getSelectedEndDateUnformatted(): string | undefined;

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
   * Check if state of picker is 'selecting'
   */
  isSelecting(): boolean;

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

  /**
   * Set selected end date directly.
   * @param date - date as `YYYY-MM-DD`
   */
  setEndDate(date: string): void;
}
