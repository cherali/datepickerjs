import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useTransition,
  MouseEvent,
  KeyboardEventHandler,
} from "react";
import {
  MultiSelectPicker,
  PickerLocale,
  createDate,
  formatDate,
  Days,
  DaysStateTypes,
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

function MultiSelectPickerExample() {
  const [isPending, startTransition] = useTransition();
  const [date, setDate] = useState<Date>(createDate()); // create date based on timezone
  const containerRef = useRef<HTMLDivElement>(null);
  const isShiftKey = useRef<boolean>(false);

  const monthWrapperRef = useRef<HTMLDivElement>(null);
  const yearWrapperRef = useRef<HTMLDivElement>(null);
  const selectedMonthRef = useRef<HTMLDivElement>(null);
  const selectedYearRef = useRef<HTMLDivElement>(null);

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
    isDateInRange,
    isSelecting,
    getDayMonthOffset,
    getSelectedDates,
    getFirstSelectedDate,
    selectInRange,
    deSelectInRange,
    clearSelection,
  } = useMemo(
    // use memo to insure that only one instance of datePicker exist and don't change on re-rendering
    () =>
      new MultiSelectPicker({
        date: formatDate(date), // convert date to iso format YYYY-MM-DD
        locale: locale,
        dayRenderType: "fill",
        twoSide: true,
        normalized: true,
      }),
    [],
  );

  useEffect(() => {
    // change date listener
    onChangeDate(() => setDate(createDate(getDate())));

    // close date picker on click outside
    const handleClickOutside = event => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target) &&
        !isPending
      ) {
        startTransition(() => {
          setOpen(false);
        });
      }
    };

    document.addEventListener("click", handleClickOutside, true);

    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  const daysList = getDays();
  const daysListNext = getDays("next");

  const detectShiftKey: KeyboardEventHandler<HTMLDivElement> = event => {
    if (event.shiftKey !== isShiftKey.current) {
      isShiftKey.current = event.shiftKey;
    }
  };

  const handleHoverCell = (date: string) => () => {
    if (isSelecting()) {
      onCellHover(date);
    }
  };

  const handleSmoothScroll = (
    parentRef: React.RefObject<HTMLDivElement>,
    itemRef: React.RefObject<HTMLDivElement>,
  ) => {
    setTimeout(() => {
      parentRef.current?.scrollTo({
        top:
          (itemRef.current?.offsetTop || 0) -
            (parentRef.current?.offsetTop || 0) -
            datepickerHeight / 2 || 0,
        left: 0,
        behavior: "smooth",
      });
    });
  };

  const RenderTitle = ({ year, month }: { year: number; month: string }) => (
    <div>
      <button
        style={{
          border: "none",
          height: "auto",
          backgroundColor: "transparent",
        }}
        onClick={() => {
          setMode("year");

          handleSmoothScroll(yearWrapperRef, selectedYearRef);
        }}
      >
        <span style={{ display: "inline" }}>{year}</span>
      </button>
      <button
        style={{
          backgroundColor: "transparent",
          border: "none",
        }}
        onClick={() => {
          setMode("month");

          handleSmoothScroll(monthWrapperRef, selectedMonthRef);
        }}
      >
        <span style={{ display: "inline" }}>{month}</span>
      </button>
    </div>
  );

  const getPickerBackgroundColor = (
    day: Days,
    currentColor: string,
    selectColor: string,
    otherColor: string,
  ) => {
    const selecting = isSelecting() && day.state == "current";

    if (selecting && isDateInRange(day.date, true) && isShiftKey.current)
      return "#ff8686";
    else if (selecting && isDateInRange(day.date)) return "#a1ffff";
    else if (day.state !== "current") return otherColor;
    else if (isSelectedDay(day.date)) return selectColor;
    return currentColor;
  };

  const getPickerColor = (
    day: Days,
    currentColor: string,
    selectColor: string,
    otherColor: string,
  ) => {
    if (isSelectedDay(day.date) && day.state === "current") return selectColor;
    else if (day.state === "current") return currentColor;
    return otherColor;
  };

  const dayStyle = (day: Days) => ({
    backgroundColor: getPickerBackgroundColor(
      day,
      "#cacaca",
      "#2cf2f2",
      "#d8d8d8",
    ),
    color: getPickerColor(day, "#000", "#099090", "#888"),
    width: "100%",
    border: "none",
    padding: "5px 0",
  });

  const changeDayClick =
    (date: string, state: DaysStateTypes) => (evt: MouseEvent) => {
      if (evt.ctrlKey) {
        selectInRange(date, state);
      } else if (evt.shiftKey) {
        deSelectInRange(date, state);
      } else {
        changeDay(date);
      }
    };

  return (
    <div
      style={{ display: "inline-block", width: "auto" }}
      onKeyDown={detectShiftKey}
    >
      <button onClick={goToToday}>go to today</button>

      <div ref={containerRef} style={{ width: 600 }}>
        <input
          type="text"
          onFocus={() => setOpen(true)}
          value={getFirstSelectedDate()}
          onChange={() => {}}
        />

        {getSelectedDates().size > 1 && (
          <span style={{ marginInlineStart: 8 }}>
            +{getSelectedDates().size - 1}
          </span>
        )}

        <button style={{ marginInlineStart: 8 }} onClick={clearSelection}>
          clear selection
        </button>

        {isOpen() && !isLoading() && (
          <div
            style={{
              display: "flex",
              width: 600,
              gap: 16,
              flexDirection: "row",
            }}
          >
            {getMode() === "month" && (
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexDirection: "row-reverse",
                  }}
                >
                  <div style={{ flex: 1 }}></div>
                  <div>
                    <RenderTitle
                      year={getRenderedYear()}
                      month={getRenderedMonthName()}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <button onClick={() => setMode("day")}>back</button>
                  </div>
                </div>

                <div style={{ width: "100%", margin: "0 auto" }}>
                  <div
                    ref={monthWrapperRef}
                    style={{ height: datepickerHeight, overflow: "auto" }}
                  >
                    {getMonthList().map(month => (
                      <div
                        key={month.name}
                        ref={
                          getRenderedMonth() === month.monthNumber
                            ? selectedMonthRef
                            : undefined
                        }
                        style={{
                          backgroundColor:
                            getRenderedMonth() === month.monthNumber
                              ? "#cacaca"
                              : "#fff",
                          padding: "5px 0",
                        }}
                      >
                        <button
                          style={{
                            width: "100%",
                            padding: 0,
                            margin: 0,
                            backgroundColor: "transparent",
                            border: "none",
                          }}
                          onClick={() => changeMonth(month.monthNumber)}
                        >
                          <span>{month.name}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {getMode() === "year" && (
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexDirection: "row-reverse",
                  }}
                >
                  <div style={{ flex: 1 }}></div>
                  <div>
                    <RenderTitle
                      year={getRenderedYear()}
                      month={getRenderedMonthName()}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <button onClick={() => setMode("day")}>back</button>
                  </div>
                </div>

                <div style={{ width: "100", margin: "0 auto" }}>
                  <div
                    ref={yearWrapperRef}
                    style={{
                      display: "flex",
                      height: datepickerHeight,
                      overflow: "auto",
                      flexWrap: "wrap",
                      gap: 3,
                    }}
                  >
                    {getYearsList(1950, 2050).map(year => (
                      <div
                        key={year}
                        ref={
                          getRenderedYear() === year
                            ? selectedYearRef
                            : undefined
                        }
                        style={{
                          backgroundColor:
                            getRenderedYear() === year ? "#cacaca" : "#fafafa",
                          padding: "5px 0",
                          textAlign: "center",
                          width: "19%",
                        }}
                      >
                        <button
                          onClick={() => changeYear(year)}
                          style={{
                            backgroundColor: "transparent",
                            border: "none",
                            color:
                              getRenderedYear() === year ? "black" : "#808080",
                          }}
                        >
                          {year}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {getMode() === "day" && (
              <>
                <div style={{ flex: 1 }}>
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <button onClick={handleShowPrevMonth}>prev</button>
                      </div>
                      <RenderTitle
                        year={getRenderedYear()}
                        month={getRenderedMonthName()}
                      />
                      <div></div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        padding: "7px 0 5px",
                        flexWrap: "wrap",
                      }}
                    >
                      {weeksTitle.map(week => (
                        <div
                          key={week}
                          style={{
                            backgroundColor: "#dadada",
                            textAlign: "center",
                            width: `${100 / 7}%`,
                          }}
                        >
                          <span>{week}</span>
                        </div>
                      ))}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                      }}
                    >
                      {/* if you using fill dayRenderType remove this block  */}
                      {Array(getDayMonthOffset(0))
                        .fill("")
                        .map((_, index) => (
                          <div
                            key={index}
                            style={{
                              width: `${100 / 7}%`,
                            }}
                          ></div>
                        ))}

                      {daysList.map((day, index) => {
                        return (
                          <div
                            key={index}
                            style={{
                              width: `${100 / 7}%`,
                            }}
                            onMouseEnter={handleHoverCell(day.date)}
                          >
                            <button
                              style={dayStyle(day)}
                              disabled={day.day === 0}
                              onClick={changeDayClick(day.date, day.state)}
                            >
                              {day.day}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <hr />

                {daysListNext.length > 0 && (
                  <div
                    style={{
                      flex: 1,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div></div>
                        <RenderTitle
                          year={getRenderedNextDateYear()}
                          month={getRenderedNextMonthName()}
                        />
                        <div>
                          <button onClick={handleShowNextMonth}>next</button>
                        </div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          padding: "7px 0 5px",
                          flexWrap: "wrap",
                        }}
                      >
                        {weeksTitle.map(week => (
                          <div
                            key={week}
                            style={{
                              backgroundColor: "#dadada",
                              textAlign: "center",
                              width: `${100 / 7}%`,
                            }}
                          >
                            <span>{week}</span>
                          </div>
                        ))}
                      </div>

                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                        }}
                      >
                        {/* if you using fill dayRenderType remove this block  */}
                        {Array(getDayMonthOffset(1))
                          .fill("")
                          .map((_, index) => (
                            <div
                              key={index}
                              style={{
                                width: `${100 / 7}%`,
                              }}
                            ></div>
                          ))}

                        {daysListNext.map((day, index) => (
                          <div
                            key={index}
                            style={{
                              width: `${100 / 7}%`,
                            }}
                            onMouseEnter={handleHoverCell(day.date)}
                          >
                            <button
                              style={dayStyle(day)}
                              disabled={day.day === 0}
                              onClick={changeDayClick(day.date, day.state)}
                            >
                              {day.day}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MultiSelectPickerExample;
