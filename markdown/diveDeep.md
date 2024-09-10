[Readme](../README.md) || [Full Documentation](../docs/index.md) | [Customization](./customization.md) | [Localization](./localization.md) | [Complexity](./complexity.md) | [Dive Deep](./diveDeep.md) | [Usage](./usage.md)

## Dive Deep

Here is more information about this package
**_`prev` means `previous`_**

- twoSide
  - whether you want to show current and next month or not, choosing this it depends on your usage, you can set this to false if you using DatePicker.
- normalize
  - when this property combines with `twoSide: true` becomes important, by default when clicking on `next` or `prev` button, picker renders 2 next or prev month, i.e, if currently showing Jan and Feb, by clicking on next button if this property is `true` picker renders Mar and Apr, you can set this property to `false` if you want to render Feb, Mar, in summary false: monthStep=1, true: monthStep=2
- datePickerMaxRow
  - maximum row you want in your picker
- datePickerAutoRow
  - whether put current month in middle then fill the rest evenly with current month and next month days or not
- endDate
  - recommend use this if you passing `date` property to constructor
- delayTimeout
  - used to create a small delay after go to today button clicked for better UX

### datePickerMaxRow and datePickerAutoRow

There is more to this 2 property... <br>
If autoRow is true current month renders in middle. <br>
Lets imagine maxRow is `10` and dayRenderType is `fill`, the current month have 31 days, in worse case this fill 6 rows ([why?](#fill-calculation)), picker still need to create date for 4 remaining rows... so for autoRow=true 2 days array fills with 2 row (14 days) of prev month follows by current month follows next month (fills the rest empty spots), but if autoRow=false, days array fills with few (maximum 6 days) days of prev month (depends on current month) follows by current month follows by next month, all the remaining spot fills with next month days, in this scenario we have the following math:

```js
6 + 31 = 37 // max spot needed for worse case
7 * 10 = 70 // number of available spot
70 - 37 = 33, // remaining spots, most be fill with next month!
```

but next month may have max 31 days, so need to fill 2 remaining spot with next next month, and in this case depends on others property you may encountered with weird behavior, thats why not recommended to set maxRow more than 11 if autoRow is true, in this case 8 will be good number but 9 may cause problem!!

### fill calculation

1st day of month might be last weekday, so we have 6 offset plus 31 days, totally 37 days, 7(number of days in week) \* 5 is 35 and not enough spot to fill 37 days, therefore 6 rows needed in order to to totally cover current month.
