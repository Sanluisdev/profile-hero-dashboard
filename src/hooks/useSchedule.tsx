
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

// Types for our schedule
export type TimeRange = {
  id: string;
  start: string;
  end: string;
};

export type DaySchedule = {
  dayName: string;
  isWorkDay: boolean;
  timeRanges: TimeRange[];
};

export function useSchedule() {
  const [schedule, setSchedule] = useState<DaySchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setLoading(true);
        // Try to get the schedule from Firestore first
        const scheduleCollection = collection(db, "schedule");
        const snapshot = await getDocs(scheduleCollection);
        
        if (!snapshot.empty) {
          const scheduleData = snapshot.docs.map(doc => doc.data() as DaySchedule);
          setSchedule(scheduleData);
        } else {
          // If no data in Firestore, use default schedule
          const defaultSchedule = getDefaultSchedule();
          setSchedule(defaultSchedule);
        }
        setError(null);
      } catch (err) {
        console.error("Error fetching schedule:", err);
        setError("Error al cargar el horario");
        // Fall back to default schedule on error
        setSchedule(getDefaultSchedule());
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  // Default schedule if nothing is saved or there's an error
  const getDefaultSchedule = (): DaySchedule[] => {
    const daysOfWeek = [
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
      "Domingo",
    ];

    return daysOfWeek.map((day) => ({
      dayName: day,
      isWorkDay: day !== "Domingo",
      timeRanges: day !== "Domingo" 
        ? [{ id: crypto.randomUUID(), start: "09:00", end: "17:00" }] 
        : [],
    }));
  };

  // Helper function to get available times for a specific date
  const getAvailableTimesForDate = (date: Date) => {
    if (!date || schedule.length === 0) return [];

    // Get the day of the week (0 = Sunday, 1 = Monday, etc.)
    const dayIndex = date.getDay();
    // Adjust to our day index (0 = Lunes, 6 = Domingo)
    const adjustedDayIndex = dayIndex === 0 ? 6 : dayIndex - 1;
    
    const daySchedule = schedule[adjustedDayIndex];
    
    // If it's not a work day, return empty array
    if (!daySchedule || !daySchedule.isWorkDay) {
      return [];
    }

    // Convert time ranges to hour slots (e.g. 9:00-17:00 becomes [9:00, 10:00, 11:00, ...])
    const availableSlots: { id: string, time: string }[] = [];
    
    daySchedule.timeRanges.forEach(range => {
      const startHour = parseInt(range.start.split(":")[0], 10);
      const endHour = parseInt(range.end.split(":")[0], 10);
      
      for (let hour = startHour; hour < endHour; hour++) {
        const formattedHour = hour.toString().padStart(2, "0");
        const nextHour = (hour + 1).toString().padStart(2, "0");
        
        availableSlots.push({
          id: crypto.randomUUID(),
          time: `${formattedHour}:00 - ${nextHour}:00`
        });
      }
    });
    
    return availableSlots;
  };

  // Helper function to check if a date is a work day
  const isWorkDay = (date: Date) => {
    if (!date || schedule.length === 0) return false;

    const dayIndex = date.getDay();
    const adjustedDayIndex = dayIndex === 0 ? 6 : dayIndex - 1;
    
    return schedule[adjustedDayIndex]?.isWorkDay || false;
  };

  return {
    schedule,
    loading,
    error,
    getAvailableTimesForDate,
    isWorkDay
  };
}
