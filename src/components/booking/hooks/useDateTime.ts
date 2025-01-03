import { useState, useCallback } from "react";

export const useDateTime = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState("");

  const handleDateChange = useCallback((newDate: Date) => {
    setDate(newDate);
  }, []);

  const handleTimeChange = useCallback((newTime: string) => {
    setTime(newTime);
  }, []);

  return {
    date,
    time,
    handleDateChange,
    handleTimeChange,
  };
};