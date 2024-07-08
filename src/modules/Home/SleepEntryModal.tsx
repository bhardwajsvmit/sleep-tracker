import { AppContext } from "@/context/AppContext";
import { AppContextTypes } from "@/context/types/AppContextTypes";
import { isValidEmail, isValidPassword } from "@/utils";
import {
  Box,
  Button,
  Dialog,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import React, { useContext, useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
}

const SleepEntryModal = ({ open, onClose }: Props) => {
  const { setSleepData, loggedInUserId } = useContext(
    AppContext
  ) as AppContextTypes;
  const [error, setError] = useState<string | null>("");
  const [sleepRange, setSleepRange] = useState<(Dayjs | null)[]>([null, null]);

  const handleAddSleepEntry = (data: any) => {
    const sleepStart = dayjs(data[0]).format();
    const wakeUp = dayjs(data[1]).format();

    const newSleepEntry = { wakeUp, sleepStart, key: crypto.randomUUID() };

    setSleepData((curSleepData) => {
      curSleepData[loggedInUserId]
        ? curSleepData[loggedInUserId].push(newSleepEntry)
        : (curSleepData[loggedInUserId] = [newSleepEntry]);
      return { ...curSleepData };
    });
    onClose();
  };

  const disableButton =
    !!error ||
    !sleepRange[0] ||
    !sleepRange[1] ||
    dayjs(sleepRange[0]).format() === dayjs(sleepRange[1]).format();

  return (
    <Dialog onClose={onClose} open={open}>
      <Box
        display={"flex"}
        width={"600px"}
        height={"500px"}
        bgcolor={"white"}
        flexDirection={"column"}
        p="24px"
        gap="16px"
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box
            display={"flex"}
            flexDirection={"column"}
            width={"100%"}
            justifyContent={"flex-start"}
            alignItems={"flex-start"}
            gap="4px"
          >
            <Typography>Sleep start time</Typography>
            <DateTimePicker
              sx={{ width: "100%" }}
              disableFuture
              format="DD-MM-YYYY HH:mm"
              onOpen={() => setSleepRange((curRange) => [curRange[0], null])}
              onChange={(value, _context) => {
                setSleepRange((_curRange) => [value, null]);
              }}
            />
          </Box>
          <Box
            display={"flex"}
            flexDirection={"column"}
            width={"100%"}
            justifyContent={"flex-start"}
            alignItems={"flex-start"}
            gap="4px"
          >
            <Typography>Wake up time</Typography>
            <DateTimePicker
              sx={{ width: "100%" }}
              disableFuture
              format="DD-MM-YYYY HH:mm"
              disabled={!sleepRange[0]}
              {...(sleepRange[0] ? { maxDateTime: dayjs(sleepRange[0]).add(1, "day") } : {})}
              {...(sleepRange[0] ? { minDateTime:sleepRange[0] } : {})}
              onChange={(value, context) => {
                setError(context.validationError);
                setSleepRange((curRange) => [curRange[0], value]);
              }}
            />
          </Box>

          <Button
            disabled={disableButton}
            onClick={() => handleAddSleepEntry(sleepRange)}
          >
            Add Sleep Entry
          </Button>
        </LocalizationProvider>
      </Box>
    </Dialog>
  );
};

export default SleepEntryModal;
