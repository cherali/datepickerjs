import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { NgFor, NgIf, NgStyle } from "@angular/common";
import {
  createDate,
  RangePicker,
  Days,
  formatDate,
  PickerLocale,
} from "drm-datepickerjs";

@Component({
  selector: "app-two-side-range-picker",
  standalone: true,
  imports: [NgIf, NgFor, NgStyle],
  templateUrl: "./two-side-range-picker.component.html",
})
export class TwoSideRangePickerComponent implements OnInit, OnDestroy {
  @ViewChild("containerRef") containerRef!: ElementRef<HTMLDivElement>;

  locale: PickerLocale = year => ({
    months: {
      1: { name: "January", numberOfDays: 31 },
      2: { name: "February", numberOfDays: year % 4 === 0 ? 29 : 28 },
      3: { name: "March", numberOfDays: 31 },
      4: { name: "April", numberOfDays: 30 },
      5: { name: "May", numberOfDays: 31 },
      6: { name: "June", numberOfDays: 30 },
      7: { name: "July", numberOfDays: 31 },
      8: { name: "August", numberOfDays: 31 },
      9: { name: "September", numberOfDays: 30 },
      10: { name: "October", numberOfDays: 31 },
      11: { name: "November", numberOfDays: 30 },
      12: { name: "December", numberOfDays: 31 },
    },
  });

  weeksTitle = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  datepickerHeight = 300;
  date = createDate();
  hoveredDate: string = "";
  daysList: Days[];
  daysListNext: Days[];

  datePicker: RangePicker;

  constructor() {
    this.datePicker = new RangePicker({
      date: formatDate(this.date),
      locale: this.locale,
      dayRenderType: "fill",
      normalized: true,
      twoSide: true,
    });

    this.daysList = this.datePicker.getDays();
    this.daysListNext = this.datePicker.getDays("next");

    // Create the instance when the component is instantiated.
    this.setupDateChangeListener();
  }

  ngOnInit(): void {
    document.addEventListener(
      "click",
      this.handleClickOutside.bind(this),
      true,
    );
  }

  ngOnDestroy(): void {
    document.removeEventListener(
      "click",
      this.handleClickOutside.bind(this),
      true,
    );
  }

  setupDateChangeListener(): void {
    this.datePicker.onChangeDate(() => {
      this.date = createDate(this.datePicker.getDate());
    });
  }

  handleClickOutside(event: MouseEvent): void {
    if (
      this.containerRef &&
      !this.containerRef.nativeElement.contains(event.target as Node)
    ) {
      this.datePicker.setOpen(false);
    }
  }

  get rangePickerBackgroundColor() {
    return (
      day: Days,
      currentColor: string,
      selectColor: string,
      hoveredColor: string,
      otherColor: string,
    ) => {
      if (
        this.datePicker.isSelecting() &&
        this.datePicker.isDateInRange(day.date) &&
        this.datePicker.isEndDate(day.date) &&
        day.state == "current"
      )
        return "#23cdcd";
      else if (
        this.datePicker.isSelecting() &&
        this.datePicker.isDateInRange(day.date) &&
        day.state == "current"
      )
        return "#deffff";
      else if (day.state !== "current") return otherColor;
      else if (this.datePicker.isSelectedDay(day.date)) return selectColor;
      else if (
        !this.datePicker.isSelecting() &&
        this.datePicker.isDateInRange(day.date)
      )
        return hoveredColor;
      else return currentColor;
    };
  }

  get rangePickerColor() {
    return (
      day: Days,
      currentColor: string,
      hoveredColor: string,
      selectColor: string,
      otherColor: string,
    ) => {
      if (this.datePicker.isSelectedDay(day.date) && day.state === "current")
        return selectColor;
      else if (
        !this.datePicker.isSelecting() &&
        this.datePicker.isDateInRange(day.date) &&
        day.state === "current"
      )
        return hoveredColor;
      else if (day.state === "current") return currentColor;
      else return otherColor;
    };
  }

  dayStyle(day: Days): any {
    return {
      backgroundColor: this.rangePickerBackgroundColor(
        day,
        "#cacaca",
        "#2cf2f2",
        "#b7fafa",
        "#d8d8d8",
      ),
      color: this.rangePickerColor(day, "#000", "#099090", "#066060", "#888"),
      width: "100%",
      border: "none",
      padding: "5px 0",
    };
  }

  handleHoverCell(date: string) {
    if (this.hoveredDate !== date && this.datePicker.isSelecting()) {
      setTimeout(() => {
        this.hoveredDate = date;
        this.datePicker.onCellHover(this.hoveredDate);
      }, 100);
    }
  }
}
