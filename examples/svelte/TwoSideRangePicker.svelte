<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import {
    type Days,
    type PickerLocale,
    RangePicker,
    createDate,
    formatDate,
  } from "drm-datepickerjs";
  import { get, writable } from "svelte/store";
  import { browser } from "$app/environment";

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
  let containerRef: any;

  const date = writable(createDate());

  const datePicker = new RangePicker({
    date: formatDate(get(date)),
    locale,
    dayRenderType: "fill",
    twoSide: true,
    normalized: true,
  });

  $: isOpen = false;
  $: mode = datePicker.getMode();
  $: daysList = datePicker.getDays();
  $: daysListNext = datePicker.getDays("next");
  $: endDate = datePicker.getEndDate();

  $: currentYear = datePicker.getRenderedYear();
  $: currentMonth = datePicker.getRenderedMonthName();
  $: nextYear = datePicker.getRenderedNextDateYear();
  $: nextMonth = datePicker.getRenderedNextMonthName();

  const handleClickOutside = (event: MouseEvent) => {
    if (containerRef && !containerRef.contains(event.target)) {
      isOpen = false;
      datePicker.setMode("day");
      datePicker.setOpen(false);
    }
  };

  onMount(() => {
    datePicker.onChangeDate(() => {
      date.set(createDate(datePicker.getDate()));
      daysList = datePicker.getDays();
      daysListNext = datePicker.getDays("next");
      mode = datePicker.getMode();
      endDate = datePicker.getEndDate();

      currentMonth = datePicker.getRenderedMonthName();
      currentYear = datePicker.getRenderedYear();

      nextYear = datePicker.getRenderedNextDateYear();
      nextMonth = datePicker.getRenderedNextMonthName();
    });

    if (browser) {
      document.addEventListener("click", handleClickOutside, true);
    }
  });

  onDestroy(() => {
    if (browser) {
      document.removeEventListener("click", handleClickOutside, true);
    }
  });

  const getPickerBackgroundColor = (
    day: Days,
    currentColor: string,
    selectColor: string,
    hoveredColor: string,
    otherColor: string,
  ) => {
    if (
      datePicker.isSelecting() &&
      datePicker.isDateInRange(day.date) &&
      datePicker.isEndDate(day.date) &&
      day.state == "current"
    )
      return "#23cdcd";
    else if (
      datePicker.isSelecting() &&
      datePicker.isDateInRange(day.date) &&
      day.state == "current"
    )
      return "#deffff";
    else if (day.state !== "current") return otherColor;
    else if (datePicker.isSelectedDay(day.date)) return selectColor;
    else if (!datePicker.isSelecting() && datePicker.isDateInRange(day.date))
      return hoveredColor;
    else return currentColor;
  };

  const getPickerColor = (
    day: Days,
    currentColor: string,
    selectColor: string,
    hoveredColor: string,
    otherColor: string,
  ) => {
    if (datePicker.isSelectedDay(day.date) && day.state === "current")
      return selectColor;
    else if (
      !datePicker.isSelecting() &&
      datePicker.isDateInRange(day.date) &&
      day.state === "current"
    )
      return hoveredColor;
    else if (day.state === "current") return currentColor;
    else return otherColor;
  };

  const dayStyle = (day: Days) => `
    background-color: ${getPickerBackgroundColor(day, "#cacaca", "#2cf2f2", "#b7fafa", "#d8d8d8")};
    color: ${getPickerColor(day, "#000", "#099090", "#066060", "#888")};
    width: 100%;
    border: none;
    padding: 5px 0;
  `;
</script>

<div bind:this={containerRef} style="display: inline-block; width: auto;">
  <button on:click={() => datePicker.goToToday()}>Go to today</button>

  <div style="width: 600px;">
    <input
      type="text"
      value={formatDate($date)}
      on:focus={() => (isOpen = true)}
    />
    <input type="text" value={endDate} on:focus={() => (isOpen = true)} />
  </div>

  {#if isOpen && !datePicker.isLoading()}
    <div style="display: flex; width: 600px; gap: 16px; flex-direction: row;">
      {#if mode === "month"}
        <div style="flex: 1;">
          <div
            style="display: flex; justify-content: space-between; align-items: center; flex-direction: row-reverse;"
          >
            <div style="flex: 1; text-align: end;"></div>
            <div>
              <button
                style="border: none; background-color: transparent;"
                on:click={() => datePicker.setMode("year")}
              >
                <span>{currentYear}</span>
              </button>
              <button
                style="border: none; background-color: transparent;"
                on:click={() => datePicker.setMode("month")}
              >
                <span>{currentMonth}</span>
              </button>
            </div>
            <div style="flex: 1;">
              <button on:click={() => datePicker.setMode("day")}>Back</button>
            </div>
          </div>

          <div style="width: 100%; margin: 0 auto;">
            <div style="overflow: auto; height: {datepickerHeight}px;">
              {#each datePicker.getMonthList() as month (month.name)}
                <div
                  style="background-color: {datePicker.getRenderedMonth() ===
                  month.monthNumber
                    ? '#cacaca'
                    : '#fff'}; padding: 5px 0;"
                >
                  <button
                    style="width: 100%; padding: 0; margin: 0; background-color: transparent; border: none;"
                    on:click={() => datePicker.changeMonth(month.monthNumber)}
                  >
                    <span>{month.name}</span>
                  </button>
                </div>
              {/each}
            </div>
          </div>
        </div>
      {/if}

      {#if mode === "year"}
        <div style="flex: 1;">
          <div
            style="display: flex; justify-content: space-between; align-items: center; flex-direction: row-reverse;"
          >
            <div style="flex: 1;"></div>
            <div>
              <button
                style="border: none; background-color: transparent;"
                on:click={() => datePicker.setMode("year")}
              >
                <span>{currentYear}</span>
              </button>
              <button
                style="border: none; background-color: transparent;"
                on:click={() => datePicker.setMode("month")}
              >
                <span>{currentMonth}</span>
              </button>
            </div>
            <div style="flex: 1;">
              <button on:click={() => datePicker.setMode("day")}>Back</button>
            </div>
          </div>
          <div style="width: 100%; margin: 0 auto;">
            <div
              style="height: {datepickerHeight}px; display: flex; overflow: auto; flex-wrap: wrap; gap: 3px;"
            >
              {#each datePicker.getYearsList(1950, 2050) as year (year)}
                <div
                  style="background-color: {currentYear === year
                    ? '#cacaca'
                    : '#fafafa'}; padding: 5px 0; text-align: center; width: 19%;"
                >
                  <button
                    on:click={() => datePicker.changeYear(year)}
                    style="background-color: transparent; border: none; color: {currentYear ===
                    year
                      ? 'black'
                      : '#808080'}"
                  >
                    {year}
                  </button>
                </div>
              {/each}
            </div>
          </div>
        </div>
      {/if}

      {#if mode === "day"}
        <div style="display: flex; gap: 8px;">
          <div style="flex: 1;">
            <div>
              <div
                style="display: flex; justify-content: space-between; align-items: center;"
              >
                <button on:click={() => datePicker.handleShowPrevMonth()}
                  >Prev</button
                >
                <div>
                  <button
                    style="border: none; background-color: transparent;"
                    on:click={() => datePicker.setMode("year")}
                  >
                    <span>{currentYear}</span>
                  </button>
                  <button
                    style="border: none; background-color: transparent;"
                    on:click={() => datePicker.setMode("month")}
                  >
                    <span>{currentMonth}</span>
                  </button>
                </div>
                <div></div>
              </div>

              <div style="display: flex; padding: 7px 0 5px; flex-wrap: wrap;">
                {#each weeksTitle as week (week)}
                  <div
                    style="background-color: #dadada; text-align: center; width: calc(100% / 7);"
                  >
                    <span>{week}</span>
                  </div>
                {/each}
              </div>

              <div style="display: flex; flex-wrap: wrap;">
                {#each Array(datePicker.getDayMonthOffset(0)).fill("") as _, index}
                  <div style="width: calc(100% / 7);"></div>
                {/each}
                {#each daysList as day (day.date)}
                  <div style="width: calc(100% / 7);">
                    <button
                      style={dayStyle(day)}
                      disabled={day.day === 0}
                      on:click={() => datePicker.changeDay(day.date, day.state)}
                      on:mouseenter={() => datePicker.onCellHover(day.date)}
                    >
                      {day.day}
                    </button>
                  </div>
                {/each}
              </div>
            </div>
          </div>

          <hr />

          {#if daysListNext.length > 0}
            <div style="flex: 1;">
              <div>
                <div
                  style="display: flex; justify-content: space-between; align-items: center;"
                >
                  <div></div>
                  <div>
                    <button
                      style="border: none; background-color: transparent;"
                      on:click={() => datePicker.setMode("year")}
                    >
                      <span>{nextYear}</span>
                    </button>
                    <button
                      style="border: none; background-color: transparent;"
                      on:click={() => datePicker.setMode("month")}
                    >
                      <span>{nextMonth}</span>
                    </button>
                  </div>

                  <button on:click={() => datePicker.handleShowNextMonth()}
                    >Next</button
                  >
                </div>

                <div
                  style="display: flex; padding: 7px 0 5px; flex-wrap: wrap;"
                >
                  {#each weeksTitle as week (week)}
                    <div
                      style="background-color: #dadada; text-align: center; width: calc(100% / 7);"
                    >
                      <span>{week}</span>
                    </div>
                  {/each}
                </div>

                <div style="display: flex; flex-wrap: wrap;">
                  {#each Array(datePicker.getDayMonthOffset(1)).fill("") as _, index}
                    <div style="width: calc(100% / 7);"></div>
                  {/each}
                  {#each daysListNext as day (day.date)}
                    <div style="width: calc(100% / 7);">
                      <button
                        style={dayStyle(day)}
                        disabled={day.day === 0}
                        on:click={() =>
                          datePicker.changeDay(day.date, day.state)}
                        on:mouseenter={() => datePicker.onCellHover(day.date)}
                      >
                        {day.day}
                      </button>
                    </div>
                  {/each}
                </div>
              </div>
            </div>
          {/if}
        </div>
      {/if}
    </div>
  {/if}
</div>
