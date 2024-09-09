import type { EventCallBackType } from "./EventEmitterTypes";
import type {
  Days,
  DaysStateTypes,
  MonthListObject,
  PickerMode,
  PickerMonthState,
  PickerState,
} from "./PickerTypes";

/**
 * Base Picker abstract methods.
 * @public
 */
export interface IBasePickerAbs {
  /**
   * Use to change date, (handler given to day)
   *
   * @param date - date as `YYYY-MM-DD`
   * @param state - day state
   */
  changeDay(date: string, state: DaysStateTypes): void;

  /**
   * Determine given date is selected or not
   *
   * @param date - date as `YYYY-MM-DD`
   */
  isSelectedDay(date: string): boolean;
}

/**
 * Methods that Base most implement by Base Picker.
 * @public
 */
export interface IBasePicker {
  /**
   * A callback used to update picker
   * @param cb - a callback that will be call when date changes
   */
  onChangeDate(cb: EventCallBackType<string>): void;

  /**
   * Return list of days
   * @param monthSate - Whether list of days for this month or next month.
   */
  getDays(monthSate: PickerMonthState): Days[];

  /**
   * Return list of months,
   */
  getMonthList(): MonthListObject[];

  /**
   * Get years list
   *
   * @param minimumYear - Minimum Year you want to show.
   * @param maximumYear - Maximum Year you want to show.
   * @returns list of number between Minimum and Maximum year.
   */
  getYearsList(minimumYear: number, maximumYear: number): Array<number>;

  /**
   * Get formatted date as `YYYY-MM-DD`
   */
  getDate(): string;

  /**
   * Get selected date - unformatted
   */
  getSelectedDateOriginal(): string;

  /**
   * Get rendered date - unformatted
   */
  getRenderedDateOriginal(): string;

  /**
   * Get Render Month number
   */
  getRenderedMonth(): number;

  /**
   * Get Render month name
   */
  getRenderedMonthName(): string;

  /**
   * Get Render year
   */
  getRenderedYear(): number;

  /**
   * Get Render next month number - used when `twoSide` is true
   */
  getRenderedNextMonth(): number;

  /**
   * Get Render next month name - used when `twoSide` is true
   */
  getRenderedNextMonthName(): string;

  /**
   * get Render next date year - used when `twoSide` is true
   */
  getRenderedNextDateYear(): number;

  /**
   * Used to get difference between first weekday and 1st month start day
   *
   * @param index - 0: current, 1: next | '1' used when `twoSide` is true
   *
   * Always returns 0 if `dayRenderType` is `fill`
   */
  getDayMonthOffset(index?: 0 | 1): number;

  /**
   * Use to change month
   *
   * @param month - month number
   * @param forceClosing - by enable this picker will be closed after set month
   */
  changeMonth(month: number, forceClosing?: boolean): void;

  /**
   * Use to change year
   *
   * @param year - year number
   * @param forceClosing - by enable this picker will be closed after set month
   */
  changeYear(year: number, forceClosing?: boolean): void;

  /**
   * Use to navigate to next month
   */
  handleShowNextMonth(): void;

  /**
   * Use to navigate prev month
   */
  handleShowPrevMonth(): void;

  /**
   * Use to navigate next year
   */
  handleShowNextYear(): void;

  /**
   * Use to navigate prev year
   */
  handleShowPrevYear(): void;

  /**
   * Go to today date
   */
  goToToday(): void;

  /**
   * Get if picker is open
   */
  isOpen(): boolean;

  /**
   * Change open state of Picker
   *
   * @param open - true or false
   */
  setOpen(open: boolean): void;

  /**
   * Get Picker mode
   */
  getMode(): PickerMode;

  /**
   * Change picker mode
   *
   * @param mode - set mode
   */
  setMode(mode: PickerMode): void;

  /**
   * Set selected date directly.
   *
   * @param date - date as `YYYY-MM-DD`
   */
  setDate(date: string): void;

  /**
   * Remove all event listeners
   */
  dispose(): void;

  /**
   * Return picker state
   */
  getPickerState(): PickerState;
}
