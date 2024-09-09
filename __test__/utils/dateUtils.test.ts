import { expect, test, describe } from "vitest";
import {
  addZero,
  createDate,
  formatDate,
  getDate,
  getFullYear,
  getMonth,
  isValidDateFormat,
  validateDate,
} from "../../src/utils/dateUtils";

describe("Testing `dateUtils` Functionality", () => {
  const date = "2024-09-08";
  const reverseDate = "08-09-2024";
  const newDate = new Date();

  describe("Tests For `validateDate`", () => {
    test(`${date} Should Do Nothing`, () => {
      expect(() => validateDate(date)).not.toThrow();
    });

    test(`new Date().toString() Should Throw`, () => {
      expect(() => validateDate(newDate.toString())).toThrow();
    });
  });

  describe("Tests For `isValidDateFormat`", () => {
    test(`${date} Should Return 'True'`, () => {
      expect(isValidDateFormat(date)).toBe(true);
    });

    test(`new Date().toString()' Should Return 'false'`, () => {
      expect(isValidDateFormat(newDate.toString())).toBe(false);
    });
  });

  describe("Tests For `formatDate`", () => {
    test(`Should Return "" - empty string`, () => {
      expect(formatDate()).toEqual("");
    });
    test(`new Date(${date}) Should Return As YYYY-MM-DD: ${date}`, () => {
      expect(formatDate(new Date(date))).toEqual(date);
    });
  });

  describe("Tests For `getFullYear`", () => {
    test(`${date} Should be 2024`, () => {
      expect(getFullYear(date)).toEqual(2024);
    });

    test(`${reverseDate} Should Throw`, () => {
      expect(() => getFullYear(reverseDate)).toThrow();
    });
  });

  describe("Tests For `getMonth`", () => {
    test(`${date} Should be 9`, () => {
      expect(getMonth(date)).toEqual(9);
    });

    test(`${reverseDate} Should Throw`, () => {
      expect(() => getMonth(reverseDate)).toThrow();
    });
  });

  describe("Tests For `getDate`", () => {
    test(`${date} Should be 8`, () => {
      expect(getDate(date)).toEqual(8);
    });

    test(`${reverseDate} Should Throw`, () => {
      expect(() => getDate(reverseDate)).toThrow();
    });
  });

  describe("Tests For `addZero`", () => {
    test(`10 Should be 10`, () => {
      expect(addZero(10)).toEqual("10");
    });

    test(`9 Should be 09`, () => {
      expect(addZero(9)).toEqual("09");
    });
  });

  describe("Tests For `createDate`", () => {
    test(`${reverseDate} Should Throw`, () => {
      expect(() => createDate(reverseDate)).toThrow();
    });

    test(`${date} Should be Date`, () => {
      expect(createDate(date)).toBeInstanceOf(Date);
    });
    test(`Pass Nothing - Should be Date`, () => {
      expect(createDate()).toBeInstanceOf(Date);
    });
  });
});
