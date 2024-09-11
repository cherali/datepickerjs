import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  OnDestroy,
} from "@angular/core";
import {
  DatePicker,
  Days,
  PickerLocale,
  createDate,
  formatDate,
} from "drm-datepickerjs";
import { NgIf, NgFor, NgStyle } from "@angular/common";

@Component({
  selector: "app-date-picker",
  standalone: true,
  imports: [NgIf, NgFor, NgStyle],
  templateUrl: "./date-picker.component.html",
})
export class SimpleDatePickerComponent implements OnInit, OnDestroy {
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

  datePicker: DatePicker;

  constructor() {
    this.datePicker = new DatePicker({
      date: formatDate(this.date),
      locale: this.locale,
      dayRenderType: "fill",
    });

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

  get pickerBackgroundColor() {
    return (
      day: Days,
      currentColor: string,
      selectColor: string,
      otherColor: string,
    ) => {
      if (day.state !== "current") return otherColor;
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
}
