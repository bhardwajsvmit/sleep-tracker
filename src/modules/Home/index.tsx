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
import { useMotionValue, motion, useTransform, AnimatePresence } from "framer-motion";
import SleepDataCard from "./SleepDataCard";



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
      <motion.div
        style={{
          alignItems: "center",
          gap: "16px",
          padding: "24px",
          minHeight: "100vh",
          flexDirection: "column",
          display: "flex",
          width: "100%",
        }}
      >
        <Button sx={{ maxWidth: "200px" }} onClick={handleLogOut}>
          Logout
        </Button>
        <Box
          display={"flex"}
          flexDirection={"column"}
          gap="16px"
          alignItems={"center"}
        >
          <Button onClick={() => setShowAddForm(true)}>Add</Button>

          {sleepData[loggedInUserId]?.length>0 && (
            <Typography color={"GrayText"}>
              Average Sleep Duration: {averageSleepDuration} hrs
            </Typography>
          )}
          <AnimatePresence>
            <motion.div
              style={{
                flexDirection: "column",
                gap: "16px",
                alignItems: "center",
                display: "flex",
              }}
            >
              {loggedInUserId &&
                memoisedSleepData?.map((sleepEntry, _index) => {
                  return (
                    <SleepDataCard
                      key={sleepEntry?.key}
                      sleepEntry={sleepEntry}
                      setShowEditForm={setShowEditForm}
                      setSelectedSleepEntry={setSelectedSleepEntry}
                    />
                  );
                })}
            </motion.div>
          </AnimatePresence>

          {/* <Typography color={"GrayText"}>
          Average Wake up Time: {averageWakeUpTime}
        </Typography>
        <Typography color={"GrayText"}>
          Average Sleep Time: {averageSleepingTime}
        </Typography> */}
        </Box>
      </motion.div>
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
