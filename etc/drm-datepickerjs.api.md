## API Report File for "drm-datepickerjs"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

// @public
export function addZero(number: number): string;

// @public
export abstract class BasePicker extends EventEmitter<string, PickerEvents> implements IBasePicker {
    constructor(props: BasePickerOptions);
    changeMonth(month: number, forceClosing?: boolean): void;
    changeYear(year: number, forceClosing?: boolean): void;
    getDate(): string;
    getDayMonthOffset(index?: 0 | 1): number;
    getDays(monthSate?: PickerMonthState): Days[];
    getMode(): PickerMode;
    getMonthList(): MonthListObject[];
    getPickerState(): PickerState;
    getRenderedDateOriginal(): string;
    getRenderedMonth(): number;
    getRenderedMonthName(): string;
    getRenderedNextDateYear(): number;
    getRenderedNextMonth(): number;
    getRenderedNextMonthName(): string;
    getRenderedYear(): number;
    getSelectedDateOriginal(): string;
    getYearsList(minimumYear: number, maximumYear: number): Array<number>;
    goToToday(): void;
    handleShowNextMonth(): void;
    handleShowNextYear(): void;
    handleShowPrevMonth(): void;
    handleShowPrevYear(): void;
    isLoading(): boolean;
    isOpen(): boolean;
    onChangeDate(cb: EventCallBackType<string>): void;
    setDate(date: string): void;
    setMode(mode: PickerMode): void;
    setOpen(open: boolean): void;
}

// @public
export interface BasePickerOptions {
    date?: string;
    dateFormatter?: DateFormatterType;
    datePickerAutoRow?: boolean;
    datePickerMaxRow?: number;
    dayRenderType?: PickerDayRenderType;
    delayTimeout?: number;
    locale: PickerLocale;
    mode?: PickerMode;
    normalized?: boolean;
    open?: boolean;
    twoSide?: boolean;
    weekOffset?: number;
}

// @public
export function createDate(date?: string): Date;

// @public
export type DateFormatterType = (date: string) => string;

// @public
export class DatePicker extends BasePicker {
    constructor(props: BasePickerOptions);
    changeDay(date: string, state: DaysStateTypes): void;
    isSelectedDay(date: string): boolean;
}

// @public
export interface Days {
    // (undocumented)
    date: string;
    // (undocumented)
    day: number;
    // (undocumented)
    state: DaysStateTypes;
}

// @public
export type DaysStateTypes = "prev" | "next" | "current";

// @public
export type EventCallBackType<T> = (data: T) => void;

// @public
export class EventEmitter<T extends string, K extends string> {
    constructor();
    // (undocumented)
    dispose(): void;
    // (undocumented)
    emit(eventName: K, data: T): void;
    // (undocumented)
    off(eventName: K): void;
    // (undocumented)
    on<P extends T>(eventName: K, listener: EventCallBackType<T & P>): void;
}

// @public
export function formatDate(date?: Date): string;

// @public
export interface IBasePicker {
    changeMonth(month: number, forceClosing?: boolean): void;
    changeYear(year: number, forceClosing?: boolean): void;
    dispose(): void;
    getDate(): string;
    getDayMonthOffset(index?: 0 | 1): number;
    getDays(monthSate: PickerMonthState): Days[];
    getMode(): PickerMode;
    getMonthList(): MonthListObject[];
    getPickerState(): PickerState;
    getRenderedDateOriginal(): string;
    getRenderedMonth(): number;
    getRenderedMonthName(): string;
    getRenderedNextDateYear(): number;
    getRenderedNextMonth(): number;
    getRenderedNextMonthName(): string;
    getRenderedYear(): number;
    getSelectedDateOriginal(): string;
    getYearsList(minimumYear: number, maximumYear: number): Array<number>;
    goToToday(): void;
    handleShowNextMonth(): void;
    handleShowNextYear(): void;
    handleShowPrevMonth(): void;
    handleShowPrevYear(): void;
    isOpen(): boolean;
    onChangeDate(cb: EventCallBackType<string>): void;
    setDate(date: string): void;
    setMode(mode: PickerMode): void;
    setOpen(open: boolean): void;
}

// @public
export interface IBasePickerAbs {
    changeDay(date: string, state: DaysStateTypes): void;
    isSelectedDay(date: string): boolean;
}

// @public
export interface IMultiSelectPicker {
    addDate(date: string): void;
    changeDay(date: string): void;
    clearSelection(): void;
    deSelectInRange(date: string, state: DaysStateTypes): void;
    getEndDate(): string;
    getFirstSelectedDate(): string;
    getFirstSelectedDateUnformatted(): string;
    getSelectedDates(): Map<string, number>;
    isDateInRange(date: string, includeStart?: boolean, includeEnd?: boolean): boolean;
    isEndDate(date: string): boolean;
    isSelecting(): boolean;
    isStartDate(date: string): boolean;
    onCellHover(date: string): void;
    removeDate(date: string): void;
    selectInRange(date: string, state: DaysStateTypes): void;
    toggleDate(date: string): void;
}

// @public
export interface IRangePicker {
    getEndDate(): string;
    getSelectedEndDate(): string | undefined;
    getSelectedEndDateUnformatted(): string | undefined;
    isDateInRange(date: string, includeStart?: boolean, includeEnd?: boolean): boolean;
    isEndDate(date: string): boolean;
    isSelecting(): boolean;
    isStartDate(date: string): boolean;
    onCellHover(date: string): void;
    setEndDate(date: string): void;
}

// @public
export function isValidDateFormat(date?: string): boolean;

// @public
export interface LocaleProps {
    // (undocumented)
    months: MonthsProps;
}

// @public
export interface Month {
    // (undocumented)
    name: string;
    // (undocumented)
    numberOfDays: number;
}

// @public
export type MonthListObject = Month & {
    monthNumber: number;
};

// @public
export interface MonthsProps {
    // (undocumented)
    [key: string | number]: Month;
}

// @public
export class MultiSelectPicker extends BasePicker implements IMultiSelectPicker {
    constructor(props: MultiSelectPickerOptions);
    addDate(date: string): void;
    changeDay(date: string): void;
    clearSelection(): void;
    deSelectInRange(date: string, state: DaysStateTypes): void;
    getEndDate(): string;
    getFirstSelectedDate(): string;
    getFirstSelectedDateUnformatted(): any;
    getSelectedDates(): Map<string, number>;
    goToToday(): void;
    isDateInRange(date: string, includeStart?: boolean, includeEnd?: boolean): boolean;
    isEndDate(date: string): boolean;
    isSelectedDay(date: string): boolean;
    isSelecting(): boolean;
    isStartDate(date: string): boolean;
    onCellHover(date: string): void;
    removeDate(date: string): void;
    selectInRange(date: string, state: DaysStateTypes): void;
    toggleDate(date: string): void;
}

// @public
export interface MultiSelectPickerOptions extends BasePickerOptions {
    endDate?: string;
    selectedDate?: Map<string, number>;
}

// @public
export type PickerDayRenderType = "fill" | "space";

// @public
export type PickerEvents = "changeDate" | "changeMode" | "changeOpen" | "changeState" | "calculateDays";

// @public
export type PickerLocale = (year: number) => LocaleProps;

// @public
export type PickerMode = "day" | "month" | "year";

// @public
export type PickerMonthState = "current" | "next";

// @public
export type PickerState = "loading" | "rendered" | "selecting";

// @public
export class RangePicker extends BasePicker implements IRangePicker {
    constructor(props: RangePickerOptions);
    changeDay(date: string, state: DaysStateTypes): void;
    getEndDate(): string;
    getSelectedEndDate(): string | undefined;
    getSelectedEndDateUnformatted(): string | undefined;
    goToToday(): void;
    isDateInRange(date: string, includeStart?: boolean, includeEnd?: boolean): boolean;
    isEndDate(date: string): boolean;
    isSelectedDay(date: string): boolean;
    isSelecting(): boolean;
    isStartDate(date: string): boolean;
    onCellHover(date: string): void;
    setEndDate(date: string): void;
}

// @public
export interface RangePickerOptions extends BasePickerOptions {
    endDate?: string;
}

// @public
export function validateDate(date: string): void;

// (No @packageDocumentation comment for this package)

```
