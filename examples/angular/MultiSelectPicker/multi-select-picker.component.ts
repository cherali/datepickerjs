import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { NgForOf, NgIf, NgStyle } from "@angular/common";
import {
  createDate,
  Days,
  DaysStateTypes,
  formatDate,
  PickerLocale,
  MultiSelectPicker,
} from "drm-datepickerjs";

@Component({
  selector: "app-multi-select-picker",
  standalone: true,
  imports: [NgForOf, NgIf, NgStyle],
  templateUrl: "./multi-select-picker.component.html",
})
export class MultiSelectPickerComponent implements OnInit, OnDestroy {
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
  isShiftKey = false;

  datePicker: MultiSelectPicker;

  constructor() {
    this.datePicker = new MultiSelectPicker({
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

  @HostListener("keydown", ["$event"]) onKeyDown(event: PointerEvent) {
    if (event.shiftKey != this.isShiftKey) {
      this.isShiftKey = event.shiftKey;
    }
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

  get pickerBackgroundColor() {
    return (
      day: Days,
      currentColor: string,
      selectColor: string,
      otherColor: string,
    ) => {
      const selecting = this.datePicker.isSelecting() && day.state == "current";
      if (
        selecting &&
        this.datePicker.isDateInRange(day.date, true) &&
        this.isShiftKey
      )
        return "#ff8686";
      else if (selecting && this.datePicker.isDateInRange(day.date))
        return "#a1ffff";
      else if (day.state !== "current") return otherColor;
      else if (this.datePicker.isSelectedDay(day.date)) return selectColor;
      else return currentColor;
    };
  }

  get pickerColor() {
    return (
      day: Days,
      currentColor: string,
      selectColor: string,
      otherColor: string,
    ) => {
      if (this.datePicker.isSelectedDay(day.date) && day.state === "current")
        return selectColor;
      else if (day.state === "current") return currentColor;
      else return otherColor;
    };
  }

  dayStyle(day: Days): any {
    return {
      backgroundColor: this.pickerBackgroundColor(
        day,
        "#cacaca",
        "#2cf2f2",
        "#d8d8d8",
      ),
      color: this.pickerColor(day, "#000", "#099090", "#888"),
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

  changeDayClick =
    (date: string, state: DaysStateTypes) => (evt: MouseEvent) => {
      if (evt.ctrlKey) {
        this.datePicker.selectInRange(date, state);
      } else if (evt.shiftKey) {
        this.datePicker.deSelectInRange(date, state);
      } else {
        this.datePicker.changeDay(date);
      }
    };
}
