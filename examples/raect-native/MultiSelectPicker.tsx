import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Dimensions,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  MultiSelectPicker,
  PickerLocale,
  createDate,
  formatDate,
  Days,
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
  const [date, setDate] = useState<Date>(createDate()); // create date based on timezone
  const [rangeSelection, setRangeSelection] = useState(false);

  const inputRef = useRef<TextInput>(null);
  const monthWrapperRef = useRef<ScrollView>(null);
  const yearWrapperRef = useRef<ScrollView>(null);
  const selectedMonthRef = useRef<View>(null);
  const selectedYearRef = useRef<View>(null);

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
    isDateInRange,
    isSelecting,
    isEndDate,
    getDayMonthOffset,
    getSelectedDates,
    getFirstSelectedDate,
    selectInRange,
    clearSelection,
  } = useMemo(
    // use memo to insure that only one instance of datePicker exist and don't change on re-rendering
    () =>
      new MultiSelectPicker({
        date: formatDate(date), // convert date to iso format YYYY-MM-DD
        locale,
        dayRenderType: "fill",
        twoSide: true,
        normalized: true,
      }),
    [],
  );

  useEffect(() => {
    // change date listener
    onChangeDate(() => setDate(createDate(getDate())));
  }, []);

  const daysList = getDays();
  const daysListNext = getDays("next");

  const handleClickOutside = () => {
    setOpen(false);
    inputRef.current?.blur();
  };

  const handleSmoothScroll = (
    parentRef: React.RefObject<ScrollView>,
    itemRef: React.RefObject<View>,
  ) => {
    setTimeout(() => {
      if (parentRef.current) {
        itemRef.current?.measureLayout(
          parentRef.current.getInnerViewNode(),
          (_, y) => {
            parentRef.current?.scrollTo({ y, animated: true });
          },
        );
      }
    });
  };

  const RenderTitle = ({ year, month }: { year: number; month: string }) => (
    <View style={{ flexDirection: "row", gap: 4 }}>
      <Pressable
        onPress={() => {
          setMode("year");

          handleSmoothScroll(yearWrapperRef, selectedYearRef);
        }}
      >
        <Text>{year}</Text>
      </Pressable>
      <Pressable
        onPress={() => {
          setMode("month");

          handleSmoothScroll(monthWrapperRef, selectedMonthRef);
        }}
      >
        <Text>{month}</Text>
      </Pressable>
    </View>
  );

  const getPickerBackgroundColor = (
    day: Days,
    currentColor: string,
    selectColor: string,
    otherColor: string,
  ) => {
    if (isSelecting() && isDateInRange(day.date) && day.state == "current")
      return "#a1ffff";
    else if (day.state !== "current") return otherColor;
    else if (isSelectedDay(day.date)) return selectColor;
    else return currentColor;
  };

  const getPickerColor = (
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
    backgroundColor: getPickerBackgroundColor(
      day,
      "#cacaca",
      "#2cf2f2",
      "#d8d8d8",
    ),
    color: getPickerColor(day, "#000", "#099090", "#888"),
    paddingVertical: 5,
  });

  const changeDayPress = (date: any, state: any) => () => {
    if (rangeSelection) {
      selectInRange(date, state);
    } else {
      changeDay(date);
    }
  };

  return (
    <View>
      <TouchableOpacity
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          height: isOpen() ? Dimensions.get("window").height : 0,
        }}
        onPress={handleClickOutside}
        disabled={!isOpen()}
        activeOpacity={1}
      />

      <View style={{ flexDirection: "row", gap: 16, marginBottom: 8 }}>
        <Pressable onPress={goToToday}>
          <Text>go to today</Text>
        </Pressable>

        <Pressable
          onPress={() => setRangeSelection(s => !s)}
          style={{ backgroundColor: "#cacaca" }}
        >
          <Text>{rangeSelection ? "Disable" : "Enable"} Range Selection</Text>
        </Pressable>
      </View>

      <View>
        <View style={{ flexDirection: "row", gap: 16, alignItems: "center" }}>
          <TextInput
            ref={inputRef}
            onFocus={() => {
              setOpen(true);
              inputRef.current?.blur(); // remove this line if you want date can be selectable
            }}
            value={getFirstSelectedDate()}
            onChangeText={() => {}}
            showSoftInputOnFocus={false} // prevent keyboard from opening
            style={{ width: 80 }}
          />

          {getSelectedDates().size > 1 && (
            <Text>+{getSelectedDates().size - 1}</Text>
          )}

          <Pressable onPress={clearSelection}>
            <Text>clear selection</Text>
          </Pressable>
        </View>

        {isOpen() && !isLoading() && (
          <View
            style={{
              gap: 16,
              flexDirection: "row",
            }}
          >
            {getMode() === "month" && (
              <View style={{ flex: 1 }}>
                <View
                  style={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexDirection: "row-reverse",
                  }}
                >
                  <View style={{ flex: 1 }}></View>
                  <View>
                    <RenderTitle
                      year={getRenderedYear()}
                      month={getRenderedMonthName()}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Pressable onPress={() => setMode("day")}>
                      <Text>back</Text>
                    </Pressable>
                  </View>
                </View>

                <View style={{ width: "100%", margin: "auto" }}>
                  <ScrollView
                    ref={monthWrapperRef}
                    style={{
                      height: datepickerHeight,
                    }}
                  >
                    <View>
                      {getMonthList().map(month => (
                        <View
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
                            paddingVertical: 5,
                          }}
                        >
                          <Pressable
                            onPress={() => changeMonth(month.monthNumber)}
                          >
                            <Text style={{ textAlign: "center" }}>
                              {month.name}
                            </Text>
                          </Pressable>
                        </View>
                      ))}
                    </View>
                  </ScrollView>
                </View>
              </View>
            )}

            {getMode() === "year" && (
              <View style={{ flex: 1 }}>
                <View
                  style={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexDirection: "row-reverse",
                  }}
                >
                  <View style={{ flex: 1 }}></View>
                  <View>
                    <RenderTitle
                      year={getRenderedYear()}
                      month={getRenderedMonthName()}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Pressable onPress={() => setMode("day")}>
                      <Text>back</Text>
                    </Pressable>
                  </View>
                </View>

                <View style={{ width: "100%", margin: "auto" }}>
                  <ScrollView
                    ref={yearWrapperRef}
                    style={{
                      height: datepickerHeight,
                    }}
                  >
                    <View
                      style={{
                        flexWrap: "wrap",
                        flexDirection: "row",
                        gap: 3,
                        justifyContent: "space-between",
                      }}
                    >
                      {getYearsList(1950, 2050).map(year => (
                        <View
                          key={year}
                          ref={
                            getRenderedYear() === year
                              ? selectedYearRef
                              : undefined
                          }
                          style={{
                            backgroundColor:
                              getRenderedYear() === year
                                ? "#cacaca"
                                : "#fafafa",
                            paddingHorizontal: 1,
                            width: "19%",
                          }}
                        >
                          <Pressable onPress={() => changeYear(year)}>
                            <Text
                              style={{
                                textAlign: "center",
                                color:
                                  getRenderedYear() === year
                                    ? "black"
                                    : "#808080",
                              }}
                            >
                              {year}
                            </Text>
                          </Pressable>
                        </View>
                      ))}
                    </View>
                  </ScrollView>
                </View>
              </View>
            )}

            {getMode() === "day" && (
              <>
                <View style={{ flex: 1 }}>
                  <View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <View>
                        <Pressable onPress={handleShowPrevMonth}>
                          <Text>prev</Text>
                        </Pressable>
                      </View>
                      <RenderTitle
                        year={getRenderedYear()}
                        month={getRenderedMonthName()}
                      />
                      <View></View>
                    </View>

                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        paddingTop: 7,
                        paddingBottom: 5,
                      }}
                    >
                      {weeksTitle.map(week => (
                        <View
                          key={week}
                          style={{
                            backgroundColor: "#dadada",
                            width: `${100 / 7}%`,
                          }}
                        >
                          <Text style={{ textAlign: "center" }}>{week}</Text>
                        </View>
                      ))}
                    </View>

                    <View
                      style={{
                        flexWrap: "wrap",
                        flexDirection: "row",
                      }}
                    >
                      {/* if you using fill dayRenderType remove this block  */}
                      {Array(getDayMonthOffset(0))
                        .fill("")
                        .map((_, index) => (
                          <View
                            key={index}
                            style={{
                              width: `${100 / 7}%`,
                            }}
                          ></View>
                        ))}

                      {daysList.map((day, index) => {
                        return (
                          <View
                            key={index}
                            style={{
                              width: `${100 / 7}%`,
                            }}
                          >
                            <Pressable
                              style={dayStyle(day)}
                              disabled={day.day === 0}
                              onPress={changeDayPress(day.date, day.state)}
                            >
                              <Text style={{ textAlign: "center" }}>
                                {day.day}
                              </Text>
                            </Pressable>
                          </View>
                        );
                      })}
                    </View>
                  </View>
                </View>

                {daysListNext.length > 0 && (
                  <View
                    style={{
                      flexDirection: "row",
                      flex: 1,
                    }}
                  >
                    <View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <View></View>
                        <RenderTitle
                          year={getRenderedNextDateYear()}
                          month={getRenderedNextMonthName()}
                        />

                        <View>
                          <Pressable onPress={handleShowNextMonth}>
                            <Text>next</Text>
                          </Pressable>
                        </View>
                      </View>

                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          paddingTop: 7,
                          paddingBottom: 5,
                        }}
                      >
                        {weeksTitle.map(week => (
                          <View
                            key={week}
                            style={{
                              backgroundColor: "#dadada",
                              width: `${100 / 7}%`,
                            }}
                          >
                            <Text style={{ textAlign: "center" }}>{week}</Text>
                          </View>
                        ))}
                      </View>

                      <View
                        style={{
                          flexWrap: "wrap",
                          flexDirection: "row",
                        }}
                      >
                        {/* if you using fill dayRenderType remove this block  */}
                        {Array(getDayMonthOffset(1))
                          .fill("")
                          .map((_, index) => (
                            <View
                              key={index}
                              style={{
                                width: `${100 / 7}%`,
                              }}
                            ></View>
                          ))}

                        {daysListNext.map((day, index) => {
                          return (
                            <View
                              key={index}
                              style={{
                                width: `${100 / 7}%`,
                              }}
                            >
                              <Pressable
                                style={dayStyle(day)}
                                disabled={day.day === 0}
                                onPress={changeDayPress(day.date, day.state)}
                              >
                                <Text style={{ textAlign: "center" }}>
                                  {day.day}
                                </Text>
                              </Pressable>
                            </View>
                          );
                        })}
                      </View>
                    </View>
                  </View>
                )}
              </>
            )}
          </View>
        )}

        {/* provide more info when user select date */}
        {getMode() === "day" && isOpen() && !isLoading() && rangeSelection && (
          <View>
            {!isSelecting() && <Text>select start date</Text>}
            {isSelecting() && <Text>select end date</Text>}
          </View>
        )}
      </View>
    </View>
  );
}

export default MultiSelectPickerExample;
