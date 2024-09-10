import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useTransition,
} from "react";
import {
  DatePicker,
  Days,
  PickerLocale,
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

function SimpleDatePicker() {
  const [isPending, startTransition] = useTransition();
  const [date, setDate] = useState<Date>(createDate()); // create date based on timezone
  const containerRef = useRef<HTMLDivElement>(null);

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
    getDayMonthOffset,
  } = useMemo(
    // use memo to insure that only one instance of datePicker exist and don't change on re-rendering
    () =>
      new DatePicker({
        date: formatDate(date), // convert date to iso format YYYY-MM-DD
        locale,
        dayRenderType: "fill",
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
        <h2 style={{ display: "inline" }}>{year}</h2>
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
        <h2 style={{ display: "inline" }}>{month}</h2>
      </button>
    </div>
  );

  const getRangePickerBackgroundColor = (
    day: Days,
    currentColor: string,
    selectColor: string,
    otherColor: string,
  ) => {
    if (day.state !== "current") return otherColor;
    else if (isSelectedDay(day.date)) return selectColor;
    else return currentColor;
  };

  const getRangePickerColor = (
    day: Days,
    currentColor: string,
    selectColor: string,
    otherColor: string,
  ) => {
    if (isSelectedDay(day.date) && day.state === "current") return selectColor;
    else if (day.state === "current") return currentColor;
    else return otherColor;
  };

  const dayStyle = (day: Days) => ({
    backgroundColor: getRangePickerBackgroundColor(
      day,
      "#cacaca",
      "#2cf2f2",
      "#d8d8d8",
    ),
    color: getRangePickerColor(day, "#000", "#099090", "#888"),
    width: "100%",
    border: "none",
    padding: "5px 0",
  });

  return (
    <div style={{ display: "inline-block", width: "auto" }}>
      <button onClick={goToToday}>go to today</button>

      <div ref={containerRef} style={{ width: 300 }}>
        <input
          type="text"
          onFocus={() => {
            setOpen(true);
          }}
          value={getDate()}
          onChange={() => {}}
        />

        {isOpen() && (
          <div
            style={{
              display: "flex",
              width: 300,
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
                  <div style={{ flex: 1, textAlign: "end" }}></div>
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
                          padding: "1px 5px",
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
                          <p>{month.name}</p>
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

                <div style={{ width: "100%", margin: "0 auto" }}>
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
                          padding: "1px 0px",
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

            {getMode() === "day" && !isLoading() && (
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
                        >
                          <button
                            style={dayStyle(day)}
                            disabled={day.day === 0}
                            onClick={() => changeDay(day.date, day.state)}
                          >
                            {day.day}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SimpleDatePicker;
