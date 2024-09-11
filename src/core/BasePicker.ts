import {
  formatDate,
  getDate,
  getFullYear,
  getMonth,
  addZero,
  validateDate,
  createDate,
} from "../utils/dateUtils";
import type {
  PickerState,
  PickerLocale,
  Days,
  PickerDayRenderType,
  PickerMode,
  PickerEvents,
  MonthsProps,
  PickerMonthState,
  MonthListObject,
  MonthListMap,
  DaysStateTypes,
  DateFormatterType,
  BasePickerOptions,
} from "../types/PickerTypes";
import { EventEmitter } from "./EventEmitter";
import type { EventCallBackType } from "../types/EventEmitterTypes";
import type { IBasePicker } from "../types/BasePickerTypes";

/**
 * A helper class to help speed up implementation of pickers
 * @public
 */
export abstract class BasePicker
  extends EventEmitter<string, PickerEvents>
  implements IBasePicker
{
  /** @internal */
  protected _state: PickerState = "loading";

  /** @internal */
  protected _locale: PickerLocale;

  /** @internal */
  protected _selectedDate: string;

  /** @internal */
  protected _renderedDate: string;

  /** @internal */
  protected _days: Array<Days>;

  /** @internal */
  protected _monthOffsetIndex: Array<number> = [0, 0];

  /** @internal */
  protected _weekOffset: number;

  /** @internal */
  protected _dayRenderType: PickerDayRenderType;

  /** @internal */
  protected _datePickerMaxRow: number;

  /** @internal */
  protected _datePickerAutoRow: boolean;

  /** @internal */
  protected _delayTimeout: number;

  /** @internal */
  protected _twoSide: boolean;

  /** @internal */
  protected _normalized: boolean;

  /** @internal */
  protected _monthStep: number;

  /** @internal */
  protected _dateFormatter: DateFormatterType;

  /** @internal */
  protected _open = false;

  /** @internal */
  protected _mode: PickerMode;

  /** @internal */
  protected _isLoading = false;

  constructor(props: BasePickerOptions) {
    super();
    this._bindAll(BasePicker.prototype);

    const selectedDate = formatDate(createDate(props.date));
    const twoSide = props.twoSide ?? false;
    const normalized = props.normalized ?? (twoSide ? true : false);
    const dateFormatter = props?.dateFormatter ?? (date => date);

    this._locale = props.locale;
    this._dateFormatter = dateFormatter;

    this._open = props.open ?? false;
    this._mode = props.mode ?? "day";

    this._weekOffset = props.weekOffset || 0;

    this._dayRenderType = props.dayRenderType || "space";
    this._datePickerMaxRow = props.datePickerMaxRow || 6;
    this._datePickerAutoRow = props.datePickerAutoRow ?? false;
    this._delayTimeout = props.delayTimeout ?? 150;

    this._twoSide = twoSide;
    this._normalized = normalized;
    this._monthStep = twoSide ? (normalized ? 2 : 1) : 1;

    this._selectedDate = props.date ? selectedDate : "";
    this._renderedDate = this._calculateRenderedDate(
      selectedDate,
      normalized,
      twoSide,
      dateFormatter,
    );

    this._days = this._calculateDays();

    this.on("calculateDays", this._onCalculateDays);
    this.on("changeOpen", this._onChangeOpen);
    this.on("changeMode", this._onChangeView);
    this.on<PickerState>("changeState", this._onChangeState);

    this._state = "rendered";
  }

  /**
   * Use to bind this to methods
   * @param prototype - ClassName.prototype
   * @internal
   */
  protected _bindAll(prototype: object) {
    Object.getOwnPropertyNames(prototype).forEach(key => {
      if (key !== "constructor" && key != "_bindAll") {
        const method = this[key as keyof this];
        if (typeof method == "function") {
          this[key as keyof this] = method.bind(this);
        }
      }
    });
  }

  /**
   * {@inheritdoc IBasePicker.getMode}
   * @public
   */
  public getMode() {
    return this._mode;
  }

  /**
   * Returns picker loading state
   * @returns boolean
   * @public
   */
  public isLoading() {
    return this._isLoading;
  }

  /**
   * {@inheritdoc IBasePicker.isOpen}
   * @public
   */
  public isOpen() {
    return this._open;
  }

  /**
   * {@inheritdoc IBasePicker.getPickerState}
   * @public
   */
  public getPickerState() {
    return this._state;
  }

  /**
   * {@inheritdoc IBasePicker.onChangeDate}
   * @public
   */
  public onChangeDate(cb: EventCallBackType<string>) {
    this.on("changeDate", cb);
  }

  /** @internal */
  protected _triggerUpdate(eventName: PickerEvents) {
    if (this._selectedDate) {
      const sDate = createDate(this._selectedDate);
      sDate.setMilliseconds(createDate().getMilliseconds());

      this.emit(eventName, formatDate(sDate));
    } else {
      this.emit(eventName, formatDate(createDate()));
    }
  }

  /** @internal */
  private _onCalculateDays() {
    this._days = this._calculateDays();
  }

  /** @internal */
  private _onChangeOpen() {
    this._triggerUpdate("changeDate");
  }

  /** @internal */
  private _onChangeView() {
    this._triggerUpdate("changeDate");
  }

  /** @internal */
  private _onChangeState(state: PickerState) {
    this._state = state;
    this._isLoading = state === "loading";

    this._days = this._calculateDays();
    this._triggerUpdate("changeDate");
  }

  /** @internal */
  protected _forceLoadingStart() {
    if (this._delayTimeout > 0) {
      this.emit("changeState", "loading");
    }
  }

  /** @internal */
  protected _forceLoadingEnd() {
    if (this._delayTimeout > 0) {
      setTimeout(() => {
        this.emit("changeState", "rendered");
      }, this._delayTimeout);
    }
  }

  /** @internal */
  protected _getPastMonth(month: number) {
    let m = month;

    if (month === 1) m = 12;
    else m -= 1;

    return m;
  }

  /** @internal */
  protected _get2PastMonth(month: number) {
    return this._getPastMonth(this._getPastMonth(month));
  }

  /** @internal */
  protected _calculateRenderedDate(
    date: string,
    isNormalized: boolean,
    twoSide: boolean,
    formatter: DateFormatterType,
    forceUseDate = false,
  ) {
    if (!isNormalized || !twoSide) return date;

    const newDate = createDate(
      forceUseDate ? date : this._renderedDate || date,
    );

    const isPastRenderedMonth =
      this._days?.find(f => f.date === date)?.state === "prev";
    const isNextRenderedMonth = this._renderedDate
      ? this.getDays("next")?.find(f => f.date === date)?.state === "next"
      : false;

    const month = getMonth(formatter(formatDate(newDate)));
    const days = this._getLocale(getFullYear(formatter(formatDate(newDate))))
      .months[this._getPastMonth(month) as keyof MonthsProps]!.numberOfDays;

    if (isNextRenderedMonth) return date;
    else if (isPastRenderedMonth) {
      const pastDays = this._getLocale(
        getFullYear(formatter(formatDate(newDate))),
      ).months[this._get2PastMonth(month) as keyof MonthsProps]!.numberOfDays;
      newDate.setDate(newDate.getDate() - 1 - days - pastDays);
    } else if (month % 2 === 0) newDate.setDate(newDate.getDate() - 1 - days);

    return formatDate(newDate);
  }

  /** @internal */
  protected _getSelectedDate() {
    return this._dateFormatter(this._selectedDate);
  }

  /** @internal */
  protected _getRenderedDate() {
    return this._dateFormatter(this._renderedDate);
  }

  /** @internal */
  protected _calculateMonthOfDate<T>(date: string): T {
    return getMonth(date) as T;
  }

  /** @internal */
  protected _nextMonthDate() {
    const newDate = createDate(this._renderedDate);
    newDate.setMonth(newDate.getMonth() + 1);

    return this._dateFormatter(formatDate(newDate));
  }

  /** @internal */
  protected _calculateDays(date?: string, monthIndex = 0): Array<Days> {
    const cDate = date || this._renderedDate;

    const day = getDate(this._dateFormatter(cDate));
    const dDay = getDate(cDate);
    const difDay = dDay - day;

    const nDate = createDate(cDate);
    nDate.setDate(difDay + 1);

    const prevDate = createDate(formatDate(nDate));

    const numberOfZeros = nDate.getDay();

    const fullYear = getFullYear(this._dateFormatter(cDate));
    const month = this._calculateMonthOfDate<keyof MonthsProps>(
      this._dateFormatter(cDate),
    );

    const arraySize = this._getLocale(fullYear).months[month]!.numberOfDays;

    let daysArray: Array<Days> = Array(arraySize)
      .fill("")
      .map((_, index) => {
        const date = `${nDate.getFullYear()}-${addZero(nDate.getMonth() + 1)}-${addZero(nDate.getDate())}`;
        nDate.setDate(nDate.getDate() + 1);
        return { day: index + 1, state: "current", date };
      });

    if (this._dayRenderType === "space") {
      this._monthOffsetIndex[monthIndex] = numberOfZeros;
    } else if (this._dayRenderType === "fill") {
      this._monthOffsetIndex[0] = -this._weekOffset;
      this._monthOffsetIndex[1] = -this._weekOffset;

      const startLength =
        ((numberOfZeros + this._weekOffset) % 7) +
        this._calculateAutoRowStartLength(daysArray.length);
      const pDate = createDate(formatDate(prevDate));
      pDate.setMonth(pDate.getMonth() - 1);

      const formattedPDate = this._dateFormatter(formatDate(pDate));

      const prevMonthDayNumber = this._getLocale(getFullYear(formattedPDate))
        .months[getMonth(formattedPDate) as keyof MonthsProps]!.numberOfDays;

      prevDate.setDate(prevDate.getDate() - startLength);

      const start: Array<Days> = Array(startLength)
        .fill("")
        .map((_, index) => {
          const date = `${prevDate.getFullYear()}-${addZero(prevDate.getMonth() + 1)}-${addZero(prevDate.getDate())}`;
          prevDate.setDate(prevDate.getDate() + 1);

          return {
            day: prevMonthDayNumber - startLength + index + 1,
            state: "prev",
            date,
          };
        });

      daysArray = [...start, ...daysArray];

      const endLength = this._calculateAutoRowEndLength(daysArray.length);
      const end: Array<Days> = Array(endLength)
        .fill("")
        .map((_, index) => {
          const date = `${nDate.getFullYear()}-${addZero(nDate.getMonth() + 1)}-${addZero(nDate.getDate())}`;
          nDate.setDate(nDate.getDate() + 1);
          return { day: index + 1, state: "next", date };
        });

      daysArray.push(...end);
    } else throw new Error("can't calculate days.");

    return daysArray;
  }

  /** @internal */
  protected _calculateAutoRowEndLength(length: number) {
    let rows = Math.ceil(length / 7);

    const rowsMargin =
      this._datePickerAutoRow && rows < this._datePickerMaxRow
        ? this._datePickerMaxRow - rows
        : 0;
    rows += rowsMargin;

    return this._datePickerAutoRow
      ? rows * 7 - length
      : (rows + Math.ceil((this._datePickerMaxRow - rows) / 2)) * 7 - length;
  }

  /** @internal */
  protected _calculateAutoRowStartLength(length: number) {
    return !this._datePickerAutoRow
      ? 0
      : Math.floor((this._datePickerMaxRow - Math.ceil(length / 7)) / 2) * 7;
  }

  /** @internal */
  protected _getLocale(year: number) {
    return this._locale(year);
  }

  /** @internal */
  protected _forceUpdate(date?: string) {
    this._days = this._calculateDays(date);
    this._triggerUpdate("changeDate");
  }

  /** @internal */
  protected _getYear() {
    return getFullYear(this._getSelectedDate());
  }

  /** @internal */
  protected _updateDate(date: string) {
    this._renderedDate = date;

    this._forceUpdate();
  }

  /**
   * {@inheritdoc IBasePicker.getDays}
   * @public
   */
  public getDays(monthSate: PickerMonthState = "current") {
    if (monthSate === "current") return this._days;
    else if (monthSate === "next" && !this._twoSide)
      throw new Error("TwoSide flag most be true to get next month days.");

    const nextMonthDate = createDate(this._renderedDate);
    nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);

    return this._calculateDays(formatDate(nextMonthDate), 1);
  }

  /**
   * {@inheritdoc IBasePicker.getMonthList}
   * @public
   */
  public getMonthList() {
    return Object.entries(
      this._getLocale(this._getYear()).months,
    ).map<MonthListObject>(([key, value]: MonthListMap) => ({
      monthNumber: Number(key),
      ...value,
    }));
  }

  /**
   * {@inheritdoc IBasePicker.getYearsList}
   * @public
   */
  public getYearsList(minimumYear: number, maximumYear: number): Array<number> {
    if (maximumYear <= minimumYear)
      throw new Error("maximum year most be greater than minimum year");

    return Array(maximumYear - minimumYear + 1)
      .fill("")
      .map((_, index) => minimumYear + index);
  }

  /**
   * {@inheritdoc IBasePicker.getDate}
   * @public
   */
  public getDate() {
    if (!this._selectedDate) return "";
    const selectedDate = this._getSelectedDate();
    return `${getFullYear(selectedDate)}-${addZero(getMonth(selectedDate))}-${addZero(getDate(selectedDate))}`;
  }

  /**
   * {@inheritdoc IBasePicker.getSelectedDateOriginal}
   * @public
   */
  public getSelectedDateOriginal() {
    return this._selectedDate;
  }

  /**
   * {@inheritdoc IBasePicker.getRenderedDateOriginal}
   * @public
   */
  public getRenderedDateOriginal() {
    return this._renderedDate;
  }

  /**
   * {@inheritdoc IBasePicker.getRenderedMonth}
   * @public
   */
  public getRenderedMonth() {
    return getMonth(this._getRenderedDate());
  }

  /**
   * {@inheritdoc IBasePicker.getRenderedMonthName}
   * @public
   */
  public getRenderedMonthName() {
    return this._getLocale(this._getYear()).months[
      this._calculateMonthOfDate<keyof MonthsProps>(this._getRenderedDate())
    ]!.name;
  }

  /**
   * {@inheritdoc IBasePicker.getRenderedYear}
   * @public
   */
  public getRenderedYear() {
    return getFullYear(this._getRenderedDate());
  }

  /**
   * {@inheritdoc IBasePicker.getRenderedNextMonth}
   * @public
   */
  public getRenderedNextMonth() {
    return getMonth(this._nextMonthDate());
  }

  /**
   * {@inheritdoc IBasePicker.getRenderedNextMonthName}
   * @public
   */
  public getRenderedNextMonthName() {
    return this._getLocale(getFullYear(this._nextMonthDate())).months[
      this._calculateMonthOfDate<keyof MonthsProps>(this._nextMonthDate())
    ]!.name;
  }

  /**
   * {@inheritdoc IBasePicker.getRenderedNextDateYear}
   * @public
   */
  public getRenderedNextDateYear() {
    return getFullYear(this._nextMonthDate());
  }

  /**
   * {@inheritdoc IBasePicker.getDayMonthOffset}
   *
   * @public
   */
  public getDayMonthOffset(index: 0 | 1 = 0) {
    return (this._monthOffsetIndex[index]! + this._weekOffset) % 7;
  }

  /**
   * {@inheritDoc IBasePicker.changeMonth}
   * @public
   */
  public changeMonth(month: number, forceClosing = true) {
    const formattedDate = this._dateFormatter(
      formatDate(createDate(this._renderedDate)),
    );
    const difMonth = month - getMonth(formattedDate);

    const newDate = createDate(this._renderedDate);
    newDate.setMonth(newDate.getMonth() + difMonth);

    this._renderedDate = this._calculateRenderedDate(
      formatDate(newDate),
      this._normalized,
      this._twoSide,
      this._dateFormatter,
      true,
    );

    if (forceClosing) this._mode = "day";

    this._forceUpdate();
  }

  /**
   * {@inheritDoc IBasePicker.changeYear}
   * @public
   */
  public changeYear(year: number, forceClosing = true) {
    const difYear = getFullYear(this._dateFormatter(this._renderedDate)) - year;

    const newDate = createDate(this._renderedDate);
    newDate.setFullYear(getFullYear(this._renderedDate) - difYear);

    this._renderedDate = formatDate(newDate);

    if (forceClosing) this._mode = "day";

    this._forceUpdate();
  }

  /**
   * {@inheritDoc IBasePicker.handleShowNextMonth}
   * @public
   */
  public handleShowNextMonth() {
    const newDate = createDate(this._renderedDate);
    newDate.setMonth(newDate.getMonth() + this._monthStep);

    this._updateDate(formatDate(newDate));
  }

  /**
   * {@inheritDoc IBasePicker.handleShowPrevMonth}
   * @public
   */
  public handleShowPrevMonth() {
    const newDate = createDate(this._renderedDate);
    newDate.setMonth(newDate.getMonth() - this._monthStep);

    this._updateDate(formatDate(newDate));
  }

  /**
   * {@inheritDoc IBasePicker.handleShowNextYear}
   * @public
   */
  public handleShowNextYear() {
    const newDate = createDate(this._renderedDate);
    newDate.setFullYear(newDate.getFullYear() + 1);

    this._updateDate(formatDate(newDate));
  }

  /**
   * {@inheritDoc IBasePicker.handleShowPrevYear}
   * @public
   */
  public handleShowPrevYear() {
    const newDate = createDate(this._renderedDate);
    newDate.setFullYear(newDate.getFullYear() - 1);

    this._updateDate(formatDate(newDate));
  }

  /**
   * {@inheritDoc IBasePicker.goToToday}
   * @public
   */
  public goToToday() {
    this._open = true;
    this._forceLoadingStart();

    const newDate = formatDate(createDate());

    this._renderedDate = newDate;
    this._selectedDate = newDate;

    this._forceLoadingEnd();
    this._triggerUpdate("calculateDays");
    this._triggerUpdate("changeDate");
  }

  /**
   * {@inheritDoc IBasePicker.setOpen}
   * @public
   */
  public setOpen(open: boolean) {
    if (this._open !== open) {
      this._open = open;

      this.emit("changeOpen", "");
    }
  }

  /**
   * {@inheritDoc IBasePicker.setMode}
   * @public
   */
  public setMode(mode: PickerMode) {
    if (mode !== this._mode) {
      this._mode = mode;

      this.emit("changeMode", "");
    }
  }

  /**
   * {@inheritDoc IBasePicker.setDate}
   * @public
   */
  public setDate(date: string) {
    validateDate(date);

    this._selectedDate = date;
    this._forceUpdate();
  }

  // abstracts
  /** @internal */
  public abstract changeDay(date: string, state: DaysStateTypes): void;

  /** @internal */
  public abstract isSelectedDay(date: string): boolean;
}
