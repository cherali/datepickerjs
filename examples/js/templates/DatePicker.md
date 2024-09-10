## JavaScript HTML Template for DatePicker

if you using JS you need this template in your .html file

```html
<template id="title">
  <div>
    <button style="border: none; height: auto; background-color: transparent;" class="set-year-mode">
      <h2 style="display: inline;">_year_</h2>
    </button>
    <button style="background-color: transparent; border: none;" class="set-month-mode">
      <h2 style="display: inline;">_month_</h2>
    </button>
  </div>
</template>

<template id="week-item">
  <div style="background-color: #dadada; text-align: center; width: calc(100%/7);">
    <span>_week_</span>
  </div>
</template>

<template id="day-item">
  <div style="width: calc(100% / 7);">
    <button _style_ class="--days" data-value="_date_" data-value-state="_state_">
      _day_
    </button>
  </div>
</template>

<template id="day-list">
  <div style="display: _display_;flex: 1;">
    <div>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <button id="prev-btn">prev</button>
        </div>

        _title_

        <div>
          <button id="next-btn">next</button>
        </div>
      </div>

      _weeksTitle_

      <div style="display: flex; flex-wrap: wrap;">

        _dayOffset_

        _dayList_

      </div>
    </div>
  </div>
</template>

<template id="month-list">
  <div style="display:_display_ ;flex: 1;">
    <div style="display: flex; justify-content: space-between; align-items: center; flex-direction: row-reverse;">
      <div style=" flex: 1; text-align: end;"> </div>

      <div>
        _title_
      </div>

      <div style="flex: 1;">
        <button class="--back">back</button>
      </div>
    </div>

    <div style=" width: 100%; margin: 0 auto;">
      <div style=" height: _pickerHeight_; overflow: auto;">
        _monthList_
      </div>
    </div>
  </div>

</template>

<template id="year-list">
  <div style=" flex: 1; display: _display_;">
    <div style="display: flex; justify-content: space-between; align-items: center; flex-direction: row-reverse;">
      <div style="flex: 1; text-align: end;"></div>
      <div>
        _title_
      </div>
      <div style="flex: 1;">
        <button class="--back">back</button>
      </div>
    </div>

    <div style="width: 100%; margin: 0 auto;">
      <div style="display: flex; height: _pickerHeight_; overflow: auto; flex-wrap: wrap; gap: 3px;">
        _yearList_
      </div>
    </div>
  </div>

  </div>
</template>
```
