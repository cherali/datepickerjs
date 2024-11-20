/**
 * Picker mode
 *
 * Used to determine which mode of picker to show.
 *
 * You may need to show different mode when user opens the picker.
 *
 * The `day` mode is used to show day selection UI.
 *
 * The `month` mode is used to show month selection UI.
 *
 * The `year` mode is used to show year selection UI.
 * @public
 *  */
export type PickerMode = "day" | "month" | "year";

/**
 * Picker day render type
 *
 * Used to determine how to render days.
 *
 * A month not always start from first day of week, in this situation what you want to do with those days.
 *
 * If you want to leave those days empty, use `space` type.
 *
 * If you want to fill those days with prev and next month days, use `fill` type.
 *
 * This also determine how to deal with empty slots when reaching the end of month.
 * @public
 * */
export type PickerDayRenderType = "fill" | "space";

/**
 * Picker day state
 *
 * Used to distinguish days of current, next and previous month.
 * @public
 *  */
export type DaysStateTypes = "prev" | "next" | "current";

/**
 * The Picker state
 *
 * Used to show a loading if necessary
 * @public
 * */
export type PickerState = "loading" | "rendered" | "selecting";

/**
 * Picker month state
 *
 * Used to determine which month to show days.
 *
 * The argument of `getDays` method when `twoSide` is true.
 *
 * The `current` and `next` relative to selected date or rendered date.
 * @public
 * */
export type PickerMonthState = "current" | "next";

/**
 * Use to create locale fn
 * @public
 */
export interface Month {
  name: string;
  numberOfDays: number;
}

/**
 * Use to create locale fn
 * @public
 */
export interface MonthsProps {
  [key: string | number]: Month;
}

/**
 * Use to create locale fn, return type of locale fn
 * @public
 */
export interface LocaleProps {
  months: MonthsProps;
}

/**
 * Type of item that getMonthList function returns
 * @public
 */
export type MonthListObject = Month & { monthNumber: number };

/**
 * @internal
 */
export type MonthListMap = [string, Month];

/**
 * use for typing locale fn
 * @param year - pass the current rendered year, mostly used to identify leap year
 * @returns - an object
 * @public
 */
export type PickerLocale = (year: number) => LocaleProps;

/**
 * The day object that getDays function returns
 * @public
 */
export interface Days {
  day: number;
  state: DaysStateTypes;
  date: string;
}

/**
 * Type of Date formatter
 * @public
 */
export type DateFormatterType = (date: string) => string;

/**
 * Picker events type
 * @public
 */
export type PickerEvents =
  | "changeDate"
  | "changeMode"
  | "changeOpen"
  | "changeState"
  | "calculateDays";

// Base Picker
/**
 * BasePicker and DatePicker constructor inputs.
 * @public
 */
export interface BasePickerOptions {
  /**
   * locale function to pass months to picker
   */
  locale: PickerLocale;

  /**
   * Initial date
   */
  date?: string;

  /**
   * pass date from custom formatter, used to support localization
   */
  dateFormatter?: DateFormatterType;

  /**
   * Move backward and forward the days if first weekday not started form Sunday, mostly used for localization.
   */
  weekOffset?: number;

  /**
   * If 1st of a month does'nt start form first weekday, whether `fill` that spot with prev and next day or just counted and later can show empty `space`
   *
   * available: `fill`, `space`
   */
  dayRenderType?: PickerDayRenderType;

  /**
   * Use to calculate next and prev month to fill days array.
   */
  datePickerAutoRow?: boolean;

  /**
   * Use to extend picker rows
   *
   * Not recommended set this more than 11, for most of usage leave this flag alone!!, and if you set this don't forget to enable auto row
   */
  datePickerMaxRow?: number;

  /**
   * Create delay if you want, this can be used to manipulate UI/UX!.
   */
  delayTimeout?: number;

  /**
   * Calculate the next month, Used to show current and next month in one picker
   */
  twoSide?: boolean;

  /**
   * This determine how to two side date picker behave
   *
   * If this is true the odd months start at first and the next month comes after and monthStep default value = 2 and month navigation jumps every 2 months
   *
   * If false the render month comes first and the next after monthStep is set to 1
   *
   *
   * <em><strong>Set this flag to true for RangePicker</strong></em>
   */
  normalized?: boolean;

  /**
   * Whether the picker open or closed at start
   */
  open?: boolean;

  /**
   * Set picker mode
   */
  mode?: PickerMode;
}

/**
 * RangePicker constructor inputs
 * @public
 */
export interface RangePickerOptions extends BasePickerOptions {
  /**
   * Use with date to mark a Range as selected by default
   *
   * *<em>Set `date` props</em>
   */
  endDate?: string;
}

/**
 * MultiSelect constructor inputs
 * @public
 */
export interface MultiSelectPickerOptions extends BasePickerOptions {
  /**
   * Use with date to mark a Range as selected by default
   *
   * *<em>Set `date` props</em>
   *
   * ** <em><strong>If `date` and `endDate` the range will marked as selected</strong></em>
   */
  endDate?: string;

  /**
   * Use to mark selected some date by default
   */
  selectedDate?: Map<string, number>;
}
