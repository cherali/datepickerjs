[Readme](../README.md) || [Full Documentation](../docs/index.md) | [Customization](./customization.md) | [Localization](./localization.md) | [Complexity](./complexity.md) | [Dive Deep](./diveDeep.md) | [Usage](./usage.md)

## Customization

This package gives you bunch of function in order to create your own picker, so it's depends on yoy how to use that functions to create any picker or calendars.<br>
For available options on picker creation see the following links:

- [DatePicker](../docs/drm-datepickerjs.basepickeroptions.md)
- [RangePicker](../docs/drm-datepickerjs.rangepickeroptions.md)
- [MultiSelectPicker](../docs/drm-datepickerjs.multiselectpickeroptions.md)

If you using MultiSelect

## Default Value

Default value of picker constructor

- twoSide: (optional) - `false`
- locale: (required)
- dateFormatter:(optional) - `(date) => date`
- weekOffset: (optional) - `0`
- dayRenderType: (optional) - `space`
- datePickerAutoRow: (optional) - `false`
- datePickerMaxRow: (optional) - `6`
- delayTimeout: (optional) - `150`
- date: (optional) - `undefined`
- normalized: (optional) - `true`
- open: (optional) - `false`

RangePicker

- endDate: (optional) - `undefined`

MultiSelectPicker

- endDate: (optional) - `undefined`
- selectedDate: (optional) - `undefined`

## MultiSelectPicker Range Selection

By holding `ctrlKey` you can select range of date, this behavior can be disabled or if you don't like to use `ctrlKey` you can change it to any key, like `Alt+f4` just for fun :))) <br>
Just search for `ctrlKey` in [examples](../examples) and change the key or remove that part.

## MultiSelectPicker Range De-Selection
It's possible to de select in range by holding `shiftKey`, you can change this key if you want. <br>
Just search for `shiftKey` in [examples](../examples) and change the key or remove that part.

## Custom event

You can add any types of event to this picker for example this 2 events can be implemented

- 1: simple

```tsx
const events = {
  "2023-03-31": ["EVENT!"],
};
```

- 2: complex:

```tsx
const events = {
  "2023-03-31": [
    { eventType: "event", text: "This is a complex EVENT - normal - #1" },
    { eventType: "holiday", text: "This is a complex EVENT - red color - #2" },
  ],
};
```

and because days array dates calculated in gregorian calendar, matching the event object costs `1`, then you can render based on your UI.<br>
Also you can pass date to your formatter and add events based on your calendar.

## Notes

- Make picker assessable.
- Disabling a date or range depends on your choice.

<hr>

Also see [localization](./localization.md)
<br>
Want to learn more about this picker? [check this out](./diveDeep.md)
