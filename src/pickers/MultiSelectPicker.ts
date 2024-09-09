import {
  addZero,
  createDate,
  formatDate,
  getDate,
  getFullYear,
  getMonth,
  isValidDateFormat,
} from "../utils/dateUtils";
import { BasePicker } from "../core/BasePicker";
import type {
  DaysStateTypes,
  MultiSelectPickerOptions,
} from "../types/PickerTypes";
import type { IMultiSelectPicker } from "../types/MultiSelectTypes";

/**
 * Multi Select picker allows user to select more than one date.
 * @public
 */
class MultiSelectPicker extends BasePicker implements IMultiSelectPicker {
  /** @internal */
  private _selectedEndDate: string | undefined;

  /** @internal */
  private _hoveredDate: string | undefined;

  /** @internal */
  private _selectedDatesLookup: Map<string, number>;

  constructor(props: MultiSelectPickerOptions) {
    super(props);
    super._bindAll(MultiSelectPicker.prototype);

    this._selectedEndDate = props.endDate
      ? formatDate(createDate(props.endDate))
      : "";

    this._selectedDatesLookup =
      props.selectedDate ?? this._calculateSelectedDaysLookup();
  }

  /** @internal */
  private _calculateSelectedDaysLookup(): Map<string, number> {
    if (this._selectedDate || this._selectedEndDate) {
      const lookup = new Map<string, number>();

      this._getDatesInRange(
        this._selectedDate,
        this._selectedEndDate || this._selectedDate,
      ).forEach(day => {
        lookup.set(day, 1);
      });
      return lookup;
    }

    return new Map();
  }

  /** @internal */
  private _getDatesInRange(
    startDate: string,
    endDate: string,
    includeStart = true,
    includeEnd = true,
  ): string[] {
    const dates: string[] = [];
    const start = createDate(startDate);
    const end = createDate(endDate);

    if (includeStart) {
      dates.push(formatDate(createDate(startDate)));
    }

    while (start < end) {
      start.setDate(start.getDate() + 1);
      dates.push(formatDate(start));
    }

    if (!includeEnd) {
      dates.pop();
    }

    return dates;
  }

  /**
   * {@inheritdoc IMultiSelectPicker.getSelectedDates}
   * @public
   */
  public getSelectedDates() {
    return this._selectedDatesLookup;
  }

  /**
   * {@inheritdoc IMultiSelectPicker.getFirstSelectedDate}
   * @public
   */
  public getFirstSelectedDate() {
    return this._selectedDatesLookup.keys().next().value;
  }

  /**
   * {@inheritdoc IMultiSelectPicker.addDate}
   * @public
   */
  public addDate(date: string) {
    if (isValidDateFormat(date)) {
      this._selectedDatesLookup.set(date, 1);
    }
  }

  /**
   * {@inheritdoc IMultiSelectPicker.removeDate}
   * @public
   */
  public removeDate(date: string) {
    if (isValidDateFormat(date)) {
      this._selectedDatesLookup.delete(date);
    }
  }

  /**
   * {@inheritdoc IMultiSelectPicker.toggleDate}
   * @public
   */
  public toggleDate(date: string) {
    if (isValidDateFormat(date)) {
      if (this._selectedDatesLookup.has(date)) {
        this._selectedDatesLookup.delete(date);
      } else {
        this._selectedDatesLookup.set(date, 1);
      }
    }
  }

  /**
   * {@inheritdoc IMultiSelectPicker.clearSelection}
   * @public
   */
  public clearSelection() {
    this._selectedDatesLookup = new Map();

    this._triggerUpdate("changeDate");
  }

  /**
   * {@inheritdoc IMultiSelectPicker.changeDay}
   * @public
   */
  public changeDay(date: string) {
    this.toggleDate(date);

    this.emit("changeDate", formatDate(createDate(date)));
  }

  /**
   * {@inheritdoc IMultiSelectPicker.selectInRange}
   * @public
   */
  public selectInRange(date: string, state: DaysStateTypes) {
    if (isValidDateFormat(date)) {
      let isCurrent = state === "current";

      if (this._twoSide && this._dayRenderType === "fill" && this._normalized) {
        const current = this._days.find(f => f.date === date);
        const next = this.getDays("next").find(f => f.date === date);
        isCurrent =
          Boolean(current?.state === "current" || current?.state === "next") ||
          Boolean(next?.state === "current" || next?.state === "prev");
      }

      if (this._dayRenderType === "fill" && !isCurrent) {
        this._forceLoadingStart();
      }

      const pickerState = this._state;

      if (this._selectedDate && this._selectedEndDate) {
        this._selectedEndDate = undefined;
        this._hoveredDate = undefined;
      }

      if (
        pickerState === "rendered" ||
        createDate(this._selectedDate).getTime() > createDate(date).getTime()
      ) {
        this._selectedDate = date;
        this._state = "selecting";
      } else if (pickerState === "selecting") {
        this._selectedEndDate = date;
        this._state = "rendered";
      }

      let updateDate = date;

      if (this._normalized) {
        const renderedDate = this._calculateRenderedDate(
          date,
          this._normalized,
          this._twoSide,
          this._dateFormatter,
        );
        updateDate = renderedDate;
      }

      this._renderedDate = updateDate;

      this._days = this._calculateDays(updateDate);

      this.emit("changeDate", formatDate(createDate(updateDate)));

      if (!isCurrent && this._dayRenderType === "fill") {
        if (this._selectedDate && !this._selectedEndDate) {
          this._selectedEndDate = date;
        }
        this._updateChangeDay(date);
      }

      const lookup = new Map<string, number>();

      this._getDatesInRange(
        this._selectedDate,
        this._selectedEndDate || this._selectedDate,
      ).forEach(day => {
        lookup.set(day, 1);
      });

      this._selectedDatesLookup = new Map([
        ...this._selectedDatesLookup,
        ...lookup,
      ]);
    }
  }

  /**
   * {@inheritdoc IBasePickerAbs.isSelectedDay}
   * @public
   */
  public isSelectedDay(date: string) {
    return this._selectedDatesLookup.has(date);
  }

  /** @internal */
  private _updateChangeDay(date: string) {
    this._isLoading = false;

    if (!this._selectedDate) {
      this._selectedDate = date;
      this._state = "selecting";
    } else if (this._selectedDate) {
      this._selectedEndDate = date;
      this._state = "rendered";
    }

    this._triggerUpdate("calculateDays");
  }

  /**
   * {@inheritdoc IMultiSelectPicker.getEndDate}
   * @public
   */
  public getEndDate() {
    if (!this._selectedEndDate) return "";
    const selectedDate = this._dateFormatter(this._selectedEndDate);
    return `${getFullYear(selectedDate)}-${addZero(getMonth(selectedDate))}-${addZero(getDate(selectedDate))}`;
  }

  /**
   * {@inheritdoc IBasePicker.goToToday}
   * @public
   */
  public override goToToday() {
    this._open = true;
    this._forceLoadingStart();

    const newDate = formatDate(createDate());

    this._renderedDate = newDate;
    this._selectedDate = newDate;
    this._selectedEndDate = "";
    this._hoveredDate = "";

    this._forceLoadingEnd();
    this._triggerUpdate("calculateDays");
    this._triggerUpdate("changeDate");
  }

  /**
   * {@inheritdoc IMultiSelectPicker.onCellHover}
   * @public
   */
  public onCellHover(date: string) {
    if (this._state === "selecting") {
      this._hoveredDate = date;

      if (this._selectedDate) {
        if (this._selectedEndDate) {
          this._hoveredDate = undefined;
          this._state = "rendered";
        }

        this._triggerUpdate("changeDate");
      }
    }
  }

  /**
   * {@inheritdoc IMultiSelectPicker.isDateInRange}
   * @public
   */
  public isDateInRange(date: string, includeStart = false, includeEnd = true) {
    const startDate = createDate(this._selectedDate).getTime();
    const endDate = createDate(
      this._hoveredDate || this._selectedEndDate || this._selectedDate,
    ).getTime();

    const dateTime = createDate(date).getTime();

    const startCondition = includeStart
      ? dateTime >= startDate
      : dateTime > startDate;
    const endCondition = includeEnd ? dateTime <= endDate : dateTime < endDate;

    if (this._state === "selecting" || this._state === "rendered")
      return startCondition && endCondition;

    return false;
  }

  /**
   * {@inheritdoc IMultiSelectPicker.isSelecting}
   * @public
   */
  public isSelecting() {
    return this._state === "selecting";
  }

  /**
   * {@inheritdoc IMultiSelectPicker.isStartDate}
   * @public
   */
  public isStartDate(date: string) {
    return this._selectedDate === date;
  }

  /**
   * {@inheritdoc IMultiSelectPicker.isEndDate}
   * @public
   */
  public isEndDate(date: string) {
    return this._hoveredDate === date;
  }
}

export { MultiSelectPicker };
