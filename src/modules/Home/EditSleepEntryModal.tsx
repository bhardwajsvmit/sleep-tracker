import { AppContext } from "@/context/AppContext";
import {
  AppContextTypes,
  sleepDataEntryType,
} from "@/context/types/AppContextTypes";
import { Box, Button, Dialog, Typography } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import React, { useContext, useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  selectedSleepEntry: sleepDataEntryType | null;
}

const EditSleepEntryModal = ({ open, onClose, selectedSleepEntry }: Props) => {
  const {  sleepData,setSleepData, loggedInUserId } = useContext(
    AppContext
  ) as AppContextTypes;

  const [error, setError] = useState<string | null>("");
  const [sleepRange, setSleepRange] = useState<(Dayjs | null)[]>([
    dayjs(selectedSleepEntry?.sleepStart) || null,
    dayjs(selectedSleepEntry?.wakeUp) || null,
  ]);

  const handleEditSleepEntry = (key: string) => {
    const sleepStart = dayjs(sleepRange[0]).format();
    const wakeUp = dayjs(sleepRange[1]).format();

    const newSleepEntry = { wakeUp, sleepStart, key };

    setSleepData((curSleepData) => {
      curSleepData[loggedInUserId][
        curSleepData[loggedInUserId].findIndex(
          (sleepData) => sleepData.key === key
        )
      ] = { ...newSleepEntry };
      return { ...curSleepData };
    });
    onClose();
  };
    
    const foundSleepEntry = sleepData[loggedInUserId].find(
        (item) => item.key === selectedSleepEntry?.key
      )

  const disableButton =
    !sleepRange[0] ||
    !sleepRange[1] ||
    !!error ||
    dayjs(sleepRange[0]).format() === dayjs(foundSleepEntry?.sleepStart).format() &&
    dayjs(sleepRange[1]).format() === dayjs(foundSleepEntry?.wakeUp).format();
      

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
              value={sleepRange[0]}
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
              {...(sleepRange[0]
                ? { maxDateTime: dayjs(sleepRange[0]).add(1, "day") }
                : {})}
              {...(sleepRange[0] ? { minDateTime: sleepRange[0] } : {})}
              value={sleepRange[1]}
              onChange={(value, context) => {
                setError(context.validationError);
                setSleepRange((curRange) => [curRange[0], value]);
              }}
            />
          </Box>

          <Button
            disabled={disableButton}
            onClick={() =>
              selectedSleepEntry?.key &&
              handleEditSleepEntry(selectedSleepEntry?.key)
            }
          >
            Update Sleep Entry
          </Button>
        </LocalizationProvider>
      </Box>
    </Dialog>
  );
};

export default EditSleepEntryModal;
