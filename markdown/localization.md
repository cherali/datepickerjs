[Readme](../README.md) || [Full Documentation](../docs/index.md) | [Customization](./customization.md) | [Localization](./localization.md) | [Complexity](./complexity.md) | [Dive Deep](./diveDeep.md) | [Usage](./usage.md)

#### Localization

This package can be customize easily and adding localization requires 5 shot step: (here localization for Jalali calendar)

for localization:

- the last step is to provide a function to translate gregorian date to your locale date `the return date format must be YYYY-MM-DD`
- job is done, test it!

This is example how to add Jalali localization

- step 1: <br>
  Change locale function based on your calendar.

```tsx
const faLocale: PickerLocale = year => ({
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
```

- step 2:<br>
  Change week list array

```tsx
const weeksTitle = [
  "شنبه", // sat
  "یک", // sun
  "دو", // mon
  "سه", // tue
  "چهار", // wed
  "پنج", // thu
  "جمعه", // fri
];
```

- step 3: <br>
  Create date formatter that return a localized date with `YYYY-MM-DD` format.

```tsx
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
```

Then pass this formatter to picker constructor

```tsx
dateFormatter: formatter,
```

<br>

- step 4: <br>
  Set weekOffset based on your calendar. <br>
  If Sunday is your first weekday set this to 0 or just leave it alone. <br>
  in Jalali calendar first weekday is Saturday weekOffset most set to 1

```tsx
weekOffset: 1,
```

- step 5: <br>
  Change direction to `rtl` and use proper font in order not to convert numbers.
  <br>

Done.
