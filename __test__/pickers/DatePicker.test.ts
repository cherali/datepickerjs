import { expect, test, describe, vi, afterAll } from "vitest";
import { DatePicker } from "../../src/pickers/DatePicker";
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

describe("Testing `DatePicker` Functionality", () => {
  const picker = new DatePicker({
    date: date,
    locale,
    dayRenderType: "fill",
    delayTimeout: 10,
  });

  const picker2 = new DatePicker({
    date,
    locale,
    dayRenderType: "space",
    normalized: true,
  });

  const picker3 = new DatePicker({
    locale,
    twoSide: true,
    datePickerAutoRow: true,
    datePickerMaxRow: 7,
    normalized: true,
  });

  const picker4 = new DatePicker({
    locale,
    twoSide: true,
    normalized: true,
    dayRenderType: "fill",
    datePickerAutoRow: true,
    datePickerMaxRow: 11,
  });

  const picker5 = new DatePicker({
    date,
    locale: faLocale,
    dayRenderType: "fill",
    dateFormatter: formatter,
    weekOffset: 1,
  });

  describe("Testing for open", () => {
    test("open is false", () => {
      expect(picker.isOpen()).toBe(false);
    });

    test("open is true", () => {
      picker.setOpen(true);
      expect(picker.isOpen()).toBe(true);
    });
  });

  describe("Testing for mode", () => {
    test("mode is day", () => {
      expect(picker.getMode()).toBe("day");
    });

    test("mode is month", () => {
      picker.setMode("month");

      expect(picker.getMode()).toBe("month");
    });

    test("mode is year", () => {
      picker.setMode("year");
      expect(picker.getMode()).toBe("year");
    });

    test("mode is day", () => {
      picker.setMode("day");
      expect(picker.getMode()).toBe("day");
    });
  });

  describe("Testing for state", () => {
    test("Testing state", () => {
      expect(picker.getPickerState()).toBe("rendered");
    });
  });

  describe("Testing for loading", () => {
    test("loading is false", () => {
      expect(picker.isLoading()).toBe(false);
    });
  });

  describe("Testing for selected date", () => {
    test("selected date is 2024-09-08", () => {
      expect(picker.isSelectedDay("2024-09-08")).toBe(true);
    });

    test("selected original date is 2024-09-08", () => {
      expect(picker.getSelectedDateOriginal()).toBe(date);
    });

    test("selected date is 2024-09-09", () => {
      picker.setDate("2024-09-09");
      expect(picker.isSelectedDay("2024-09-09")).toBe(true);
    });

    test("set date to 10-09-2024 should throw", () => {
      expect(() => picker.setDate("10-09-2024")).toThrow();
    });
  });

  describe("Testing for changing date", () => {
    test("change date event called", () => {
      const mockFn = vi.fn();

      picker.onChangeDate(mockFn);
      picker.setDate(date);

      expect(mockFn).toHaveBeenCalled();
    });
  });

  describe("Testing for get Date", () => {
    test("getDate is 2024-09-08", () => {
      expect(picker.getDate()).toBe(date);
    });

    test("getDate is ''", () => {
      expect(picker3.getDate()).toBe("");
    });
  });

  describe("Testing for go to today", () => {
    // set date to 2024-09-08 after test runs
    afterAll(() => {
      picker.setDate(date);
    });

    test("go to today", () => {
      picker.goToToday();

      const today = createDate();

      expect(picker.isSelectedDay(formatDate(today))).toBe(true);
    });
  });

  describe("Testing for days, months, years", () => {
    test("length of days array should be 30", () => {
      expect(picker2.getDays().length).toBe(30);
    });

    test("get daysList of next month should throw", () => {
      expect(() => picker.getDays("next")).toThrow();
    });

    test("length of days array should be 30", () => {
      picker3.setDate(date);
      expect(picker3.getDays().length).toBe(30);
    });

    test("length of next days array should be 31", () => {
      expect(picker3.getDays("next").length).toBe(31);
    });

    test("length of months array should be 12", () => {
      expect(picker.getMonthList().length).toBe(12);
    });

    test("length of years array should be 11", () => {
      expect(picker.getYearsList(2020, 2030).length).toBe(11);
    });

    test("getYearsList should throw", () => {
      expect(() => picker.getYearsList(2030, 2020)).toThrow();
    });
  });

  describe("Testing for navigate between months, and years", () => {
    afterAll(() => {
      picker.setDate(date);
    });

    test("Print current month name", () => {
      expect(picker2.getRenderedMonthName()).toBe("September");
    });

    test("Print next month name", () => {
      expect(picker2.getRenderedNextMonthName()).toBe("October");
    });

    test("Print next month", () => {
      expect(picker2.getRenderedNextMonth()).toBe(10);
    });

    test("Print next date year", () => {
      expect(picker.getRenderedNextDateYear()).toBe(2024);
    });

    test("Navigate to 2025", () => {
      picker.handleShowNextYear();
      expect(picker.getRenderedYear()).toBe(2025);
    });

    test("Navigate to 2023", () => {
      picker.handleShowPrevYear();
      picker.handleShowPrevYear();
      expect(picker.getRenderedYear()).toBe(2023);
    });

    test("Navigate to 10th month", () => {
      picker2.handleShowNextMonth();
      expect(picker2.getRenderedMonth()).toBe(10);
    });

    test("Navigate to 8th month", () => {
      picker.changeDay(date, "current");
      picker.handleShowPrevMonth();
      expect(picker.getRenderedMonth()).toBe(8);
    });

    test("Navigate to 5th month", () => {
      picker.changeMonth(5);
      expect(picker.getRenderedMonth()).toBe(5);
    });

    test("Navigate to 2028 year", () => {
      picker.changeYear(2028);
      expect(picker.getRenderedYear()).toBe(2028);
    });
  });

  describe("Testing monthOffset", () => {
    test("offset 0", () => {
      expect(picker.getDayMonthOffset(0)).toBe(0);
    });

    test("offset 1", () => {
      expect(picker.getDayMonthOffset(1)).toBe(0);
    });
  });

  describe("Testing changeDay", () => {
    test("A1. change day to 2024-09-10", () => {
      picker.changeDay("2024-09-10", "current");
      expect(picker.getDate()).toBe("2024-09-10");
    });

    test("A2. change day to 2024-08-10", () => {
      picker.changeDay("2024-08-10", "prev");
      expect(picker.getDate()).toBe("2024-08-10");
    });

    test("B1. change day to 2024-09-11", () => {
      picker2.changeDay("2024-09-11", "current");
      expect(picker2.getDate()).toBe("2024-09-11");
    });

    test("C1. change day to 2024-09-15", () => {
      picker3.changeDay("2024-09-15", "current");
      expect(picker3.getDate()).toBe("2024-09-15");
    });

    test("D1. change day to 2024-09-17", () => {
      picker4.changeDay("2024-09-17", "current");
      expect(picker4.getDate()).toBe("2024-09-17");
    });

    test("D2. change day to 2024-08-18", () => {
      picker4.changeDay("2024-08-18", "prev");
      expect(picker4.getDate()).toBe("2024-08-18");
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
        date: "2024-07-28",
      });
    });

    test("Testing for last item in array", () => {
      expect(picker.getDays().pop()).toStrictEqual({
        state: "next",
        day: 7,
        date: "2024-09-07",
      });
    });
  });

  describe("Testing for localization", () => {
    test("Testing for selectedDate", () => {
      expect(picker5.getDate()).toBe("1403-06-18");
    });

    test("Testing days array - first item", () => {
      const firstItem = picker5.getDays()[0];
      expect(formatter(firstItem!.date)).toBe("1403-05-27");
      expect(firstItem!.state).toBe("prev");
    });

    test("Testing days array - last item", () => {
      const lastItem = picker5.getDays().pop()!;
      expect(formatter(lastItem.date)).toBe("1403-07-06");
      expect(lastItem.state).toBe("next");
    });
  });

  describe("Testing dispose", () => {
    test("disposing onChangeDate event for all pickers", () => {
      const mockFn = vi.fn();
      picker.onChangeDate(mockFn);
      picker2.onChangeDate(mockFn);
      picker3.onChangeDate(mockFn);
      picker4.onChangeDate(mockFn);
      picker5.onChangeDate(mockFn);

      picker.off("changeOpen");
      picker.off("calculateDays");

      picker.dispose();
      picker2.dispose();
      picker3.dispose();
      picker4.dispose();
      picker5.dispose();

      picker.setDate(date);
      picker2.setDate(date);
      picker3.setDate(date);
      picker4.setDate(date);
      picker5.setDate(date);

      expect(mockFn).not.toHaveBeenCalled();
    });
  });
});
