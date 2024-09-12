import { expect, test, describe, afterAll } from "vitest";
import { MultiSelectPicker } from "../../src/pickers/MultiSelectPicker";
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

describe("Testing `MultiSelectPicker` Functionality", () => {
  const picker = new MultiSelectPicker({
    locale,
    dayRenderType: "fill",
    twoSide: true,
    delayTimeout: 10,
  });

  const picker2 = new MultiSelectPicker({
    date,
    locale,
    dayRenderType: "fill",
    twoSide: true,
    endDate: "2024-09-15",
  });

  const picker3 = new MultiSelectPicker({
    locale,
    dayRenderType: "fill",
    twoSide: true,
  });

  const picker4 = new MultiSelectPicker({
    date,
    locale: faLocale,
    dayRenderType: "fill",
    dateFormatter: formatter,
    weekOffset: 1,
    twoSide: true,
  });

  describe("Testing getEndDate", () => {
    test(`Test get end date`, () => {
      expect(picker.getEndDate()).toBe("");
    });
  });

  describe("Testing selection", () => {
    test(`Test if ${date} is selected, most return false`, () => {
      expect(picker.getSelectedDates().has(date)).toBe(false);
    });

    test(`Test if 2024-09-12 is selected, most return true`, () => {
      expect(picker2.getSelectedDates().has(date)).toBe(true);
    });

    test("Test for range deselection", () => {
      picker2.selectInRange("2024-09-08", "current");
      picker2.selectInRange("2024-09-20", "current");

      expect(picker2.getSelectedDates().has("2024-09-15")).toBe(true);

      picker2.deSelectInRange("2024-09-10", "current");
      picker2.deSelectInRange("2024-09-18", "current");

      expect(picker2.getSelectedDates().has("2024-09-15")).toBe(false);
    });
  });

  describe("Testing Date", () => {
    test("Test if date in range", () => {
      expect(picker2.isDateInRange("2024-09-15")).toBe(true);
    });

    test("Test if date in range - true", () => {
      picker2.selectInRange("2024-09-05", "current");
      picker2.selectInRange("2024-09-10", "current");

      expect(picker2.isDateInRange("2024-09-07", true, true)).toBe(true);
    });

    test("Test if date in range - false", () => {
      expect(picker.isDateInRange("2024-09-25")).toBe(false);
    });

    test("Testing isSelecting", () => {
      picker.changeDay("2024-09-20");
      expect(picker.isSelecting()).toBe(false);
    });

    test("Testing isSelectedDay", () => {
      expect(picker.isSelectedDay(date)).toBe(false);
    });

    test("Test if start date", () => {
      expect(picker.isStartDate("2024-09-15")).toBe(false);
    });

    test("Test if end date", () => {
      expect(picker.isEndDate("2024-09-15")).toBe(false);
    });

    test("1. Testing onCellHover", () => {
      picker2.selectInRange("2024-09-20", "current");
      picker2.onCellHover("2024-09-21");
      expect(picker2.getPickerState()).toBe("selecting");
    });

    test("2. Testing onCellHover", () => {
      picker2.onCellHover("2024-09-21");
      picker2.onCellHover("2024-09-22");
      picker2.selectInRange("2024-09-22", "current");
      expect(picker2.getPickerState()).toBe("rendered");
    });

    test("3. Testing onCellHover", () => {
      picker3.selectInRange("2024-11-01", "next");
      expect(picker3.getPickerState()).toBe("selecting");
    });

    test("A. Testing selection", () => {
      picker2.selectInRange("2024-09-10", "current");
      expect(picker2.getPickerState()).toBe("selecting");
    });

    test("B. Testing selection", () => {
      picker2.selectInRange("2024-11-09", "next");
      expect(picker2.getPickerState()).toBe("rendered");
    });
  });

  describe("Testing helper functionality", () => {
    test("Testing for clear selection", () => {
      picker.clearSelection();
      expect(picker.getSelectedDates().size).toBe(0);
    });

    test("Testing for add", () => {
      picker.addDate(date);
      expect(picker.getSelectedDates().has(date)).toBe(true);
    });

    test("Testing for remove", () => {
      picker.removeDate(date);
      expect(picker.getSelectedDates().has(date)).toBe(false);
    });

    test("Testing for toggle - adding", () => {
      picker.toggleDate(date);
      expect(picker.getSelectedDates().has(date)).toBe(true);
    });

    test("Testing for toggle - remove", () => {
      picker.toggleDate(date);
      expect(picker.getSelectedDates().has(date)).toBe(false);
    });

    test("Testing for getFirstSelectedDate", () => {
      picker.clearSelection();
      picker.addDate(date);
      expect(picker.getFirstSelectedDate()).toBe(date);
    });

    test("1. Testing for getFirstSelectedDateUnformatted", () => {
      picker.clearSelection();
      picker.addDate(date);
      expect(picker.getFirstSelectedDateUnformatted()).toBe(date);
    });

    test("2. Testing for getFirstSelectedDateUnformatted", () => {
      picker.clearSelection();
      expect(picker.getFirstSelectedDateUnformatted()).toBe("");
    });
  });

  describe("Testing days array", () => {
    test("Testing for length", () => {
      expect(picker.getDays().length).toBe(42);
    });

    test("Testing for first item in array", () => {
      expect(picker2.getDays()[0]).toStrictEqual({
        state: "prev",
        day: 27,
        date: "2024-10-27",
      });
    });

    test("Testing for last item in array", () => {
      expect(picker.getDays().pop()).toStrictEqual({
        state: "next",
        day: 12,
        date: "2024-10-12",
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
