"use client";
import React, { useContext, useMemo, useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import {
  AppContextTypes,
  sleepDataEntryType,
  sleepDataType,
} from "@/context/types/AppContextTypes";
import { AppContext } from "@/context/AppContext";
import Login from "../Login";
import SleepEntryModal from "./SleepEntryModal";
import EditSleepEntryModal from "./EditSleepEntryModal";

const HomePage = () => {
  const {
    sleepData,
    setIsAuthenticated,
    setLoggedInUser,
    setSleepData,
    loggedInUserId,
  } = useContext(AppContext) as AppContextTypes;

  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [showEditForm, setShowEditForm] = useState<boolean>(false);
  const [selectedSleepEntry, setSelectedSleepEntry] =
    useState<sleepDataEntryType | null>(null);

  const handleLogOut = () => {
    setIsAuthenticated(false);
    setLoggedInUser(null);
  };

  const handleDeleteSleepEntry = (key: string) => {
    setSleepData((curSleepData) => {
      const newData = curSleepData[loggedInUserId].splice(
        curSleepData[loggedInUserId].findIndex(
          (sleepData) => sleepData.key === key
        ),
        1
      );
      return { ...curSleepData, loggedInUserId: newData };
    });
  };

  const handleEditSleepEntry = (data: sleepDataEntryType) => {
    setSelectedSleepEntry(data);
    setShowEditForm(true);
  };

  const {
    memoisedSleepData,
    averageSleepDuration,
    // averageWakeUpTime,
    // averageSleepingTime,
  } = useMemo(() => {
    if (!sleepData[loggedInUserId]?.length) {
      return {};
    }
    const memoisedSleepData = sleepData[loggedInUserId]?.sort(
      (a: sleepDataEntryType, b: sleepDataEntryType) =>
        Date.parse(a.sleepStart) - Date.parse(b.sleepStart)
    );
    const totalSleepDuration = memoisedSleepData.reduce(
      (accumulator, curVal) =>
        accumulator +
        dayjs(curVal.wakeUp).diff(dayjs(curVal.sleepStart), "m", true),
      0
    );

    const averageSleepDurationInMinutes =
      totalSleepDuration / memoisedSleepData.length;
    const totalHours = Math.floor(averageSleepDurationInMinutes / 60);
    const totalMinutes = averageSleepDurationInMinutes - totalHours * 60;
    // const x = memoisedSleepData.reduce(
    //   (accumulator, curVal) => accumulator + dayjs(curVal.wakeUp).unix(),
    //   0
    // );
    // const y = memoisedSleepData.reduce(
    //   (accumulator, curVal) => accumulator + dayjs(curVal.sleepStart).unix(),
    //   0
    // );
    // const averageWakeUpTime = x / memoisedSleepData.length;
    // const averageSleepingTime = y / memoisedSleepData.length;

    return {
      memoisedSleepData,
      averageSleepDuration: `${totalHours}:${totalMinutes}`,
      // averageWakeUpTime: dayjs.unix(averageWakeUpTime).format(),
      // averageSleepingTime: dayjs.unix(averageSleepingTime).format(),
    };
  }, [sleepData, loggedInUserId]);

  return (
    <>
      <Box
        display={"flex"}
        width={"100%"}
        flexDirection={"column"}
        minHeight={"80vh"}
        p="24px"
        gap="16px"
        alignItems={"center"}
      >
        <Button sx={{maxWidth:"200px"}} onClick={handleLogOut}>Logout</Button>
        <Box display={"flex"} flexDirection={"column"} gap="16px" alignItems={"center"} >
          <Button onClick={() => setShowAddForm(true)}>Add</Button>

          {sleepData[loggedInUserId]?.length && (
            <Typography color={"GrayText"}>
              Average Sleep Duration: {averageSleepDuration} hrs
            </Typography>
          )}
          {loggedInUserId &&
            memoisedSleepData?.map((sleepEntry, _index) => {
              const totalSleepDurationInMinutes = dayjs(sleepEntry.wakeUp).diff(
                dayjs(sleepEntry.sleepStart),
                "m",
                true
              );
              const totalHours = Math.floor(totalSleepDurationInMinutes / 60);
              const totalMinutes =
                totalSleepDurationInMinutes - totalHours * 60;

              return (
                <Box bgcolor={"white"} p="16px" key={sleepEntry?.key} border={`1px solid grey`} borderRadius={"8px"} >
                  <Typography color={"GrayText"}>
                    Sleep Time:{" "}
                    {dayjs(sleepEntry.sleepStart).format("DD-MM-YYYY HH:mm")}
                  </Typography>
                  <Typography color={"GrayText"}>
                    Wake-up Time:{" "}
                    {dayjs(sleepEntry.wakeUp).format("DD-MM-YYYY HH:mm")}
                  </Typography>
                  <Typography color={"GrayText"}>
                    Sleep duration: {totalHours}:{totalMinutes} hrs
                  </Typography>
                  <Button onClick={() => handleEditSleepEntry(sleepEntry)}>
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDeleteSleepEntry(sleepEntry.key)}
                  >
                    Delete
                  </Button>
                </Box>
              );
            })}

          {/* <Typography color={"GrayText"}>
          Average Wake up Time: {averageWakeUpTime}
        </Typography>
        <Typography color={"GrayText"}>
          Average Sleep Time: {averageSleepingTime}
        </Typography> */}
        </Box>
      </Box>
      {showAddForm && (
        <SleepEntryModal
          open={showAddForm}
          onClose={() => setShowAddForm(false)}
        />
      )}
      {showEditForm && (
        <EditSleepEntryModal
          open={showEditForm}
          onClose={() => setShowEditForm(false)}
          selectedSleepEntry={selectedSleepEntry}
        />
      )}
    </>
  );
};

export default HomePage;
