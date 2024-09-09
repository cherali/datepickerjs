import { createDate, formatDate, isValidDateFormat } from "../utils/dateUtils";
import { BasePicker } from "../core/BasePicker";
import type { BasePickerOptions, DaysStateTypes } from "../types/PickerTypes";

/**
 * DatePicker is a simple picker.
 * Used when a single selection date will suffice
 * @public
 */
class DatePicker extends BasePicker {
  constructor(props: BasePickerOptions) {
    super(props);
    super._bindAll(DatePicker.prototype);
  }

  /**
   * {@inheritdoc IBasePickerAbs.changeDay}
   * @public
   */
  public changeDay(date: string, state: DaysStateTypes): void {
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

      this._selectedDate = date;

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
        this._updateChangeDay(date);
      }
    }
  }

  /**
   * {@inheritdoc IBasePickerAbs.isSelectedDay}
   * @public
   */
  public isSelectedDay(date: string) {
    return this._selectedDate === date;
  }

  /** @internal */
  private _updateChangeDay(date: string) {
    this._isLoading = false;
    this._selectedDate = date;

    this._triggerUpdate("calculateDays");
  }
}

export { DatePicker };
