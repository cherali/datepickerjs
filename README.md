# drm-datepickerjs

An headless, event-base, picker for Javascript project, with customization and localization support. This package provides your core functionality to create any picker your want, it does't matter which design system you use for UI and how much you need to customize the picker. <br>
This package provides you with 3 different of pickers

- DatePicker
  - used for simple date selection like birthday
- RangePicker
  - used to select a range of date
- MultiSelectPicker
  - used to randomly select dates, also range selection is available

<br>
This pickers are JS classes, so if you want you can add more functionality to this picker (just create a class, extends form one of pickers and add your functionality).

## Introduction

This package created in order to work regardless which tool you use, for example it doesn't matter you use a style system or write your style in pure css, it doesn't matter you use one of the existing JS framework or use a custom framework that you created by your own.<br>
Also with this package you can add your localization easily, and it's up to you to determine the switch condition.<br>
This package use JS `new Date()` to create dates and stores date based on gregorian calendar, this gives you more flexibility for example you can show one calendar as your primary calendar and show others calendar by only create a helper function that convert gregorian date to your target calendar, passing date to this converter gives you converted date, then you can do whatever you want with this date.

## Features

- Headless UI
- Framework/library independent
- Easy localization
- Event base Picker
- Support `leap` year
- Zero dependency
- `Low bundle size` (less than 5KB)
- Supports Type (entire package written in Typescript)
- Available Pickers: `DatePicker`, `RangePicker`, `MultiSelectPicker`

You can create your `custom event` and show it anywhere you want [check this](./markdown/customization.md#custom-event), <br>
Also with MultiSelectPicker you can select range of dates by holding `shiftKey` [see customization for more info](./markdown/customization.md#multiselectpicker-range-selection)

## Notes

- make sure the picker instance remain the same on each renders.

## Installation

```bash
npm i drm-datepickerjs
```

```bash
yarn add drm-datepickerjs
```

```bash
pnpm i drm-datepickerjs
```

## Documentation Links

There is more to this package recommend to read following documentations.

- [Full Documentation](./docs/index.md)
- [Customization and default options](./markdown/customization.md)
- [Localization](./markdown/localization.md)
- [Complexity](./markdown/complexity.md)
- [Dive Deep](./markdown/diveDeep.md)
- [Usage](./markdown/usage.md)
- [Examples](./examples/examples.md)
