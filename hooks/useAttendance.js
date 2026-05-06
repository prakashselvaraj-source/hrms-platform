"use client";

import { useEffect, useState } from "react";
import * as service from "../services/attendanceService";

export default function useAttendance() {
  const [data, setData] = useState([]);
  const [today, setToday] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState("00:00:00");

  const loadAttendance = async () => {
    const res = await service.getAttendance();
    const list = res.data.content;

    setData(list);

    // Find today's record
    const todayDate = new Date().toISOString().split("T")[0];
    const todayRecord = list.find((a) => a.date === todayDate);

    setToday(todayRecord);
  };

  const loadStats = async () => {
    const res = await service.getStats();
    setStats(res.data);
  };

  const handleCheckIn = async () => {
    setLoading(true);
    try {
      await service.checkIn();
      await loadAttendance();
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setLoading(true);
    try {
      await service.checkOut();
      await loadAttendance();
    } finally {
      setLoading(false);
    }
  };

  // ⏱️ TIMER LOGIC
  useEffect(() => {
    if (!today?.checkIn || today?.checkOut) return;

    const interval = setInterval(() => {
      const start = new Date(today.checkIn);
      const now = new Date();

      const diff = Math.floor((now - start) / 1000);

      const hrs = String(Math.floor(diff / 3600)).padStart(2, "0");
      const mins = String(Math.floor((diff % 3600) / 60)).padStart(2, "0");
      const secs = String(diff % 60).padStart(2, "0");

      setTimer(`${hrs}:${mins}:${secs}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [today]);

  useEffect(() => {
    loadAttendance();
    loadStats();
  }, []);

  return {
    data,
    today,
    stats,
    timer,
    loading,
    handleCheckIn,
    handleCheckOut,
  };
}