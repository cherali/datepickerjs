import { describe, test, expect, afterAll } from "vitest";
import { RangePicker } from "../../src/pickers/RangePicker";
import { createDate, formatDate } from "../../src/utils/dateUtils";

const locale = year => ({
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

const faLocale = year => ({
  months: {
    1: { name: "فروردین", numberOfDays: 31 },
    2: { name: "اردیبهشت", numberOfDays: 31 },
    3: { name: "خرداد", numberOfDays: 31 },
    4: { name: "تیر", numberOfDays: 31 },
    5: { name: "مرداد", numberOfDays: 31 },
    6: { name: "شهریور", numberOfDays: 31 },
    7: { name: "مهر", numberOfDays: 30 },
    8: { name: "آبان", numberOfDays: 30 },
    9: { name: "آذر", numberOfDays: 30 },
    10: { name: "دی", numberOfDays: 30 },
    11: { name: "بهمن", numberOfDays: 30 },
    12: { name: "اسفند", numberOfDays: year % 4 === 3 ? 30 : 29 },
  },
});

function formatter(date: string) {
  const formattedDate = new Intl.DateTimeFormat("FA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    numberingSystem: "latn",
  })
    .format(createDate(date))
    .split("/");

  const day = formattedDate[2];
  const month = formattedDate[1];
  const year = formattedDate[0];

  return `${year}-${month}-${day}`;
}

const date = formatDate(createDate("2024-09-08"));

describe("Testing `RangePicker` Functionality", () => {
  const picker = new RangePicker({
    date,
    locale,
    dayRenderType: "fill",
    twoSide: true,
    delayTimeout: 10,
  });

  const picker2 = new RangePicker({
    date,
    locale,
    dayRenderType: "fill",
    twoSide: false,
    endDate: "2024-09-15",
  });

  const picker3 = new RangePicker({
    locale,
    twoSide: true,
    dayRenderType: "fill",
  });

  const picker4 = new RangePicker({
    date,
    locale: faLocale,
    dayRenderType: "fill",
    dateFormatter: formatter,
    weekOffset: 1,
    twoSide: true,
  });

  describe("Testing Date", () => {
    test("Test selected day", () => {
      expect(picker.isSelectedDay("2024-09-08")).toBe(true);
    });

    test("Test set end Date", () => {
      picker.setEndDate("2024-09-20");
      expect(picker.getEndDate()).toBe("2024-09-20");
    });

    test("Test get selected end date", () => {
      expect(picker.getSelectedEndDate()).toBe("2024-09-20");
    });

    test("Test get selected end date unformatted", () => {
      expect(picker.getSelectedEndDateUnformatted()).toBe("2024-09-20");
    });

    test("Test if date in range - true", () => {
      expect(picker.isDateInRange("2024-09-15")).toBe(true);
    });

    test("Test if date in range - false", () => {
      picker2.changeDay("2024-09-10", "current");
      picker2.changeDay("2024-09-05", "current");

      expect(picker2.isDateInRange("2024-05-01", true, true)).toBe(false);
      picker2.changeDay("2024-09-08", "current");
    });

    test("Test if start date", () => {
      expect(picker.isStartDate("2024-09-15")).toBe(false);
    });

    test("Test if end date", () => {
      expect(picker.isEndDate("2024-09-15")).toBe(false);
    });
  });

  describe("Testing selection", () => {
    test("Testing isSelecting", () => {
      picker.changeDay("2024-09-20", "current");
      expect(picker.isSelecting()).toBe(true);
    });

    test("Testing select end", () => {
      picker.changeDay("2024-09-22", "current");
      expect(picker.isLoading()).toBe(false);
    });

    test("1. Testing onCellHover", () => {
      picker.changeDay("2024-09-20", "current");
      picker.onCellHover("2024-09-21");
      expect(picker.getPickerState()).toBe("selecting");
    });

    test("2. Testing onCellHover", () => {
      picker.onCellHover("2024-09-21");
      picker.onCellHover("2024-09-22");
      picker.changeDay("2024-09-22", "current");
      expect(picker.getPickerState()).toBe("rendered");
    });

    test("3. Testing onCellHover", () => {
      picker3.changeDay("2024-11-01", "next");
      expect(picker3.getPickerState()).toBe("selecting");
    });

    test("A. Testing selection", () => {
      picker2.changeDay("2024-09-10", "current");
      expect(picker2.getPickerState()).toBe("selecting");
    });

    test("B. Testing selection", () => {
      picker2.changeDay("2024-11-09", "next");
      expect(picker2.getPickerState()).toBe("rendered");
    });

    test("Testing past selection", () => {
      picker.changeDay("2024-09-20", "current");
      picker.handleShowPrevMonth();

      picker.changeDay("2024-06-30", "prev");
      expect(picker.isSelectedDay("2024-06-30")).toBe(true);
    });
  });

  describe("Testing days array", () => {
    test("Testing for length", () => {
      expect(picker.getDays().length).toBe(42);
    });

    test("Testing for first item in array", () => {
      expect(picker.getDays()[0]).toStrictEqual({
        state: "prev",
        day: 28,
        date: "2024-04-28",
      });
    });

    test("Testing for last item in array", () => {
      expect(picker.getDays().pop()).toStrictEqual({
        state: "next",
        day: 8,
        date: "2024-06-08",
      });
    });
  });

  describe("Testing for localization", () => {
    test("Testing for selectedDate", () => {
      expect(picker4.getDate()).toBe("1403-06-18");
    });

    test("Testing days array - first item", () => {
      const firstItem = picker4.getDays()[0];
      expect(formatter(firstItem.date)).toBe("1403-04-30");
      expect(firstItem.state).toBe("prev");
    });

    test("Testing days array - last item", () => {
      const lastItem = picker4.getDays().pop()!;
      expect(formatter(lastItem.date)).toBe("1403-06-09");
      expect(lastItem.state).toBe("next");
    });
  });

  describe("Testing go to today", () => {
    afterAll(() => {
      picker.setDate(date);
    });
    test("go to today", () => {
      picker.goToToday();
      expect(picker.getSelectedDateOriginal()).toBe(formatDate(createDate()));
    });
  });
});
