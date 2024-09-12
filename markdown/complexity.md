[Readme](../README.md) || [Full Documentation](../docs/index.md) | [Customization](./customization.md) | [Localization](./localization.md) | [Complexity](./complexity.md) | [Dive Deep](./diveDeep.md) | [Usage](./usage.md)

## Complexity

Here is a brief explanation about complexity. The most expensive function is the function that calculate days array, and here is some info about this function.

## Time Complexity

It doesn't matter whether you use localization or not, but depends on some properties like:

- weekOffset // minor effect
- dayRenderType
  - 1st day of month, may not start from fist weekday, this flag determine how this gap will be filled.
- datePickerAutoRow
  - if `true` current month in middle, prev and next month distribute evenly ([more info](./diveDeep.md#datepickermaxrow-and-datepickerautorow))
- datePickerMaxRow
  - how many rows you want to show
- twoSide
  - because calculate days must called twice, one for current month and other for next month

let's just consider worse scenario...

- datePickerMaxRow = 11 // not recommended to use higher number <br>
  Because all the operation is about to calculate difference, create array and fill it with proper date this operation just about to create 11 \* 7 date (effect of the other operations is small). <br>
  Also effect of other properties can be ignored, except twoSide, and if this flag is true the day calculation function must called twice. <br>
  So can say this calculation is linear time and mostly depends on datePickerMaxRow property. (`this is more to this flag,`[check this](./diveDeep.md#datepickermaxrow-and-datepickerautorow))

## Space Complexity

After create dates and consider other calculation there is few arrays that must be merged. <br>
Also need to check how expensive is to hold one day, and one day is just an object with few property so [check day interface](../docs/drm-datepickerjs.days.md). <br>

**_Therefore this function is just contain some math calculation create arrays of days and merging that arrays, so if you don't use this picker on very very low RAM devices you can ignore complexity._**
