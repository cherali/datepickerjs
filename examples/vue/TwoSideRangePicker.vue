<script setup lang="ts">
import { onMounted, onScopeDispose, ref } from 'vue'
import {
  RangePicker,
  type Days,
  type PickerLocale,
  createDate,
  formatDate,
} from "drm-datepickerjs";

const locale: PickerLocale = year => ({
  months: {
    1: { name: "January", numberOfDays: 31 },
    2: { name: "February", numberOfDays: year % 4 === 0 ? 29 : 28 },
    3: { name: "March", numberOfDays: 31 },
    4: { name: "April", numberOfDays: 30 },
    5: { name: "May", numberOfDays: 31 },
    6: { name: "June", numberOfDays: 30 },
    7: { name: "July", numberOfDays: 31 },
    8: { name: "August", numberOfDays: 31 },
    9: { name: "September", numberOfDays: 30 },
    10: { name: "October", numberOfDays: 31 },
    11: { name: "November", numberOfDays: 30 },
    12: { name: "December", numberOfDays: 31 },
  },
});

const weeksTitle = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const datepickerHeight = 300;

const date = ref(createDate())

const containerRef = ref<HTMLDivElement>();

const {
  onChangeDate,
  isOpen,
  setOpen,
  getMode,
  setMode,
  getDate,
  isSelectedDay,
  changeDay,
  getRenderedMonthName,
  getRenderedYear,
  handleShowNextMonth,
  handleShowPrevMonth,
  getMonthList,
  changeMonth,
  getYearsList,
  changeYear,
  getRenderedMonth,
  isLoading,
  goToToday,
  getDays,
  getRenderedNextMonthName,
  getRenderedNextDateYear,
  onCellHover,
  getEndDate,
  isDateInRange,
  isSelecting,
  isEndDate,
  getDayMonthOffset,
} = new RangePicker({
  date: formatDate(date.value),
  locale,
  dayRenderType: "fill",
  twoSide: true,
  normalized: true,
})

const handleClickOutside = event => {
  if (
    containerRef.value &&
    !containerRef.value.contains(event.target)
  ) {
    setOpen(false);
  }
};

onMounted(() => {
  onChangeDate(async () => {
    date.value = createDate(getDate())
  });

  document.addEventListener("click", handleClickOutside, true);
})

onScopeDispose(() => {
  document.removeEventListener("click", handleClickOutside, true);
})

const handleHoverCell = (date: string) => {
  onCellHover(date);
};

const getRangePickerBackgroundColor = (
  day: Days,
  currentColor: string,
  selectColor: string,
  hoveredColor: string,
  otherColor: string,
) => {
  if (
    isSelecting() &&
    isDateInRange(day.date) &&
    isEndDate(day.date) &&
    day.state == "current"
  )
    return "#23cdcd";
  else if (isSelecting() && isDateInRange(day.date) && day.state == "current")
    return "#deffff";
  else if (day.state !== "current") return otherColor;
  else if (isSelectedDay(day.date)) return selectColor;
  else if (!isSelecting() && isDateInRange(day.date)) return hoveredColor;
  else return currentColor;
};

const getRangePickerColor = (
  day: Days,
  currentColor: string,
  selectColor: string,
  hoveredColor: string,
  otherColor: string,
) => {
  if (isSelectedDay(day.date) && day.state === "current") return selectColor;
  else if (
    !isSelecting() &&
    isDateInRange(day.date) &&
    day.state === "current"
  )
    return hoveredColor;
  else if (day.state === "current") return currentColor;
  else return otherColor;
};

const dayStyle = day => ({
  backgroundColor: getRangePickerBackgroundColor(
    day,
    "#cacaca",
    "#2cf2f2",
    "#b7fafa",
    "#d8d8d8",
  ),
  color: getRangePickerColor(day, "#000", "#099090", "#066060", "#888"),
  width: "100%",
  border: "none",
  padding: "5px 0",
});

function getDateRef() {
  return formatDate(date.value)
}

</script>

<template>
  <div :key="getDateRef()" style="display: inline-block; width: auto;" ref="containerRef">
    <button @click="goToToday">go to today</button>

    <div style="width: 600px">
      <input type="text" :value="getDate()" @focus="() => setOpen(true)" @change="() => { }">
      <input type="text" :value="getEndDate()" @focus="() => setOpen(true)" @change="() => { }">
    </div>

    <div v-if="isOpen() && !isLoading()" style="display: flex; width: 600px; gap: 16px; flex-direction: row;">
      <div v-if="getMode() === 'month'" style="flex: 1 ">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-direction: row-reverse;">
          <div style="flex: 1; ">
          </div>
          <div>

            <div>
              <button style="border: none; background-color: transparent;" @click="setMode('year')">
                <span style="display: inline;">{{ getRenderedYear() }}</span>
              </button>
              <button style="border: none; background-color: transparent;" @click="setMode('month')">
                <span style="display: inline;">{{ getRenderedMonthName() }}</span>
              </button>
            </div>


          </div>
          <div style=" flex: 1">
            <button @click="setMode('day')">back</button>

          </div>
        </div>



        <div style="width: 100%; margin: 0 auto;">
          <div :style="{ overflow: 'auto', height: `${datepickerHeight}px` }">
            <div v-for="month in getMonthList()" :key="month.name"
              :style="{ backgroundColor: getRenderedMonth() === month.monthNumber ? '#cacaca' : '#fff', padding: '5px 0' }">
              <button style="width: 100%; padding: 0; margin: 0; background-color: transparent; border: none;"
                @click="changeMonth(month.monthNumber)">
                <span>{{ month.name }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>


      <div v-if="getMode() === 'year'" style="flex: 1;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-direction: row-reverse;">
          <div style="flex: 1;">
          </div>
          <div>

            <div>
              <button style="border: none; background-color: transparent;" @click="setMode('year')">
                <span style="display: inline;">{{ getRenderedYear() }}</span>
              </button>
              <button style="border: none; background-color: transparent;" @click="setMode('month')">
                <span style="display: inline;">{{ getRenderedMonthName() }}</span>
              </button>
            </div>
          </div>
          <div style="flex: 1;">
            <button @click="setMode('day')">back</button>
          </div>
        </div>

        <div style="width: 100%; margin: 0 auto;">
          <div
            :style="{ height: `${datepickerHeight}px`, display: 'flex', overflow: 'auto', flexWrap: 'wrap', gap: 3 }">
            <div v-for="year in getYearsList(1950, 2050)" :key="year"
              :style="{ backgroundColor: getRenderedYear() === year ? '#cacaca' : '#fafafa', padding: '5px 0', textAlign: 'center', width: '19%' }">
              <button @click="changeYear(year)"
                :style="{ backgroundColor: 'transparent', border: 'none', color: getRenderedYear() === year ? 'black' : '#808080' }">
                {{ year }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="getMode() === 'day'" style="flex: 1; display: flex; gap: 4px">
        <div style="flex: 1; ">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <button @click="handleShowPrevMonth">prev</button>

              <div>
                <button style="border: none; background-color: transparent;" @click="setMode('year')">
                  <span style="display: inline;">{{ getRenderedYear() }}</span>
                </button>
                <button style="border: none; background-color: transparent;" @click="setMode('month')">
                  <span style="display: inline;">{{ getRenderedMonthName() }}</span>
                </button>
              </div>

              <div></div>

            </div>

            <div style="display: flex; padding: 7px 0 5px; flex-wrap: wrap;">
              <div v-for="week in weeksTitle" :key="week"
                style="background-color: #dadada; text-align: center; width: calc(100% / 7);">
                <span>{{ week }}</span>
              </div>
            </div>

            <div style="display: flex; flex-wrap: wrap;">
              <div v-for="index in Array(getDayMonthOffset(0)).fill('')" :key="index" style="width: calc(100% / 7);">
              </div>
              <div v-for="(day, index) in getDays()" :key="index" style="width: calc(100% / 7);"
                @mouseenter="handleHoverCell(day.date)">
                <button :style="dayStyle(day)" :disabled="day.day === 0" @click="changeDay(day.date, day.state)">
                  {{ day.day }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <hr />

        <div v-if="getDays('next').length > 0" style="flex: 1;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div></div>

              <div>
                <button style="border: none; background-color: transparent;" @click="setMode('year')">
                  <span style="display: inline;">{{ getRenderedNextDateYear() }}</span>
                </button>
                <button style="border: none; background-color: transparent;" @click="setMode('month')">
                  <span style="display: inline;">{{ getRenderedNextMonthName() }}</span>
                </button>
              </div>

              <button @click="handleShowNextMonth">next</button>
            </div>

            <div style="display: flex; padding: 7px 0 5px; flex-wrap: wrap;">
              <div v-for="week in weeksTitle" :key="week"
                style="background-color: #dadada; text-align: center; width: calc(100% / 7);">
                <span>{{ week }}</span>
              </div>
            </div>

            <div style="display: flex; flex-wrap: wrap;">
              <div v-for="index in Array(getDayMonthOffset(1)).fill('')" :key="index" style="width: calc(100% / 7);">
              </div>
              <div v-for="(day, index) in getDays('next')" :key="index" style="width: calc(100% / 7);"
                @mouseenter="handleHoverCell(day.date)">
                <button :style="dayStyle(day)" :disabled="day.day === 0" @click="changeDay(day.date, day.state)">
                  {{ day.day }}
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>