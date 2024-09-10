[Readme](../README.md) || [Full Documentation](../docs/index.md) | [Customization](./customization.md) | [Localization](./localization.md) | [Complexity](./complexity.md) | [Dive Deep](./diveDeep.md) | [Usage](./usage.md)

## Complexity

Here is brief explanations about complexity, and the most expensive function is the function that calculate days array, and here is some info about this function.

## Time Complexity

It doesn't matter whether you use localization or not, but depends on some properties like:

- weekOffset // minor effect
- dayRenderType
  - 1st day of month may not start from fist weekday, this flag determine how this gap will be filled.
- datePickerAutoRow
  - Current month in middle, prev and next month distribute evenly
- datePickerMaxRow
  - How many rows you want to show
- twoSide
  - Because calculate days most called twice, one for current month and other for next month

let's just consider worse scenario

- datePickerMaxRow = 11 // not recommended to use higher number <br>
  Because all the operation is about to calculate difference, create array and fill it with proper date this operation just about to create 11 \* 7 date (effect of the other operations is small). <br>
  Also effect of other properties can be ignored, except twoSide and if this flag is true the day calculation function execute twice. <br>
  So can say this calculation is linear time and mostly depends on datePickerMaxRow property. (`this is more to this flag,`[check this](./diveDeep.md#datepickermaxrow-and-datepickerautorow))

## Space Complexity

One thing ignored in time complexity section is after create dates and consider other calculation there is few arrays that most be merged. <br>
Also need to check how expensive is to hold one day, actually one day is just an object with few property so [check day interface](../docs/drm-datepickerjs.days.md). <br>

**_Therefore this function is just contain some math calculation create arrays of days and merging that arrays, so if you don't use this picker on very very low RAM devices you can ignore complexity._**
