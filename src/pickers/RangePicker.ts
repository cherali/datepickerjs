import {
  addZero,
  createDate,
  formatDate,
  getDate,
  getFullYear,
  getMonth,
  isValidDateFormat,
  validateDate,
} from "../utils/dateUtils";
import { BasePicker } from "../core/BasePicker";
import type { DaysStateTypes, RangePickerOptions } from "../types/PickerTypes";
import type { IRangePicker } from "../types/RangePickerTypes";

/**
 * RangePicker allows user to select range of dates
 * @public
 */
class RangePicker extends BasePicker implements IRangePicker {
  /** @internal */
  private _selectedEndDate: string | undefined;

  /** @internal */
  private _hoveredDate: string | undefined;

  constructor(props: RangePickerOptions) {
    super(props);
    super._bindAll(RangePicker.prototype);

    this._selectedEndDate = props.endDate
      ? formatDate(createDate(props.endDate))
      : "";
  }

  /**
   * {@inheritdoc IBasePickerAbs.changeDay}
   * @public
   */
  public changeDay(date: string, state: DaysStateTypes) {
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
    }
  }

  /**
   * {@inheritdoc IBasePickerAbs.isSelectedDay}
   * @public
   */
  public isSelectedDay(date: string) {
    return this._selectedDate === date || this._selectedEndDate === date;
  }

  /**
   * {@inheritdoc IRangePicker.getSelectedEndDate}
   * @public
   */
  public getSelectedEndDate() {
    return this._selectedEndDate && this._dateFormatter(this._selectedEndDate);
  }

  /**
   * {@inheritdoc IRangePicker.getSelectedEndDateUnformatted}
   * @public
   */
  public getSelectedEndDateUnformatted() {
    return this._selectedEndDate;
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
   * {@inheritdoc IRangePicker.getEndDate}
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
   * {@inheritdoc IRangePicker.onCellHover}
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
   * {@inheritdoc IRangePicker.isDateInRange}
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
   * {@inheritdoc IRangePicker.isSelecting}
   * @public
   */
  public isSelecting() {
    return this._state === "selecting";
  }

  /**
   * {@inheritdoc IRangePicker.isStartDate}
   * @public
   */
  public isStartDate(date: string) {
    return this._selectedDate === date;
  }

  /**
   * {@inheritdoc IRangePicker.isEndDate}
   * @public
   */
  public isEndDate(date: string) {
    return this._hoveredDate === date;
  }

  /**
   * {@inheritdoc IRangePicker.setEndDate}
   * @public
   */
  public setEndDate(date: string) {
    validateDate(date);

    this._selectedEndDate = date;
    this._forceUpdate();
  }
}

export { RangePicker };
