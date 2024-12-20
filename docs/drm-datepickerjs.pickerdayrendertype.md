<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [drm-datepickerjs](./drm-datepickerjs.md) &gt; [PickerDayRenderType](./drm-datepickerjs.pickerdayrendertype.md)

## PickerDayRenderType type

Picker day render type

Used to determine how to render days.

A month not always start from first day of week, in this situation what you want to do with those days.

If you want to leave those days empty, use `space` type.

If you want to fill those days with prev and next month days, use `fill` type.

This also determine how to deal with empty slots when reaching the end of month.

**Signature:**

```typescript
export type PickerDayRenderType = "fill" | "space";
```
