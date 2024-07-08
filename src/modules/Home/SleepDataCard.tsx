import { AppContext } from "@/context/AppContext";
import {
  AppContextTypes,
  sleepDataEntryType,
} from "@/context/types/AppContextTypes";
import { Button, Typography } from "@mui/material";
import dayjs from "dayjs";
import {
  useMotionValue,
  useTransform,
  motion,
  useAnimate,
} from "framer-motion";
import React, { Dispatch, SetStateAction, useContext } from "react";

interface Props {
  sleepEntry: sleepDataEntryType;
  setSelectedSleepEntry: Dispatch<SetStateAction<sleepDataEntryType | null>>;
  setShowEditForm: Dispatch<SetStateAction<boolean>>;
}

const SleepDataCard = ({
  sleepEntry,
  setSelectedSleepEntry,
  setShowEditForm,
}: Props) => {
  const { setSleepData, loggedInUserId, sleepData } = useContext(
    AppContext
  ) as AppContextTypes;

  const [scope, animate] = useAnimate();

  const x = useMotionValue(0);

  const background = useTransform(
    x,
    [-100, 0, 100],
    ["#fc0000", "#ffffff", "rgb(255, 0, 0)"]
  );

  const handleDeleteSleepEntry = async (key: string) => {
    await animate(scope.current, {
      opacity: [1, 0],
    });
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

  const totalSleepDurationInMinutes = dayjs(sleepEntry.wakeUp).diff(
    dayjs(sleepEntry.sleepStart),
    "m",
    true
  );
  const totalHours = Math.floor(totalSleepDurationInMinutes / 60);
  const totalMinutes = totalSleepDurationInMinutes - totalHours * 60;

  return (
    <motion.div
      key={sleepEntry?.key}
      style={{
        padding: "16px",
        border: `1px solid grey`,
        borderRadius: "8px",
        background,
        x,
      }}
      ref={scope}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={() => {
        // console.log(x.get());
        if (+x.get() > 80) {
          handleDeleteSleepEntry(sleepEntry.key);
        }
      }}
    >
      <Typography color={"GrayText"}>
        Sleep Time: {dayjs(sleepEntry.sleepStart).format("DD-MM-YYYY HH:mm")}
      </Typography>
      <Typography color={"GrayText"}>
        Wake-up Time: {dayjs(sleepEntry.wakeUp).format("DD-MM-YYYY HH:mm")}
      </Typography>
      <Typography color={"GrayText"}>
        Sleep duration: {totalHours}:{totalMinutes} hrs
      </Typography>
      <Button onClick={() => handleEditSleepEntry(sleepEntry)}>Edit</Button>
      <Button onClick={() => handleDeleteSleepEntry(sleepEntry.key)}>
        Delete
      </Button>
    </motion.div>
  );
};

export default SleepDataCard;
