
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";

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
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setLoading(true);
        console.log("Obteniendo horarios desde Firestore...");
        
        // Try to get the schedule from Firestore first
        const scheduleCollection = collection(db, "schedule");
        const snapshot = await getDocs(scheduleCollection);
        
        if (!snapshot.empty) {
          // Ordenar los documentos por su ID (asumiendo que tienen formato day-0, day-1, etc.)
          const scheduleData = snapshot.docs
            .sort((a, b) => {
              const aIndex = parseInt(a.id.split('-')[1]);
              const bIndex = parseInt(b.id.split('-')[1]);
              return aIndex - bIndex;
            })
            .map(doc => doc.data() as DaySchedule);
          
          console.log("Horarios recuperados:", scheduleData.length);
          setSchedule(scheduleData);
        } else {
          console.log("No se encontraron horarios, usando valores predeterminados");
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

  // Verificar permisos de administrador
  const verifyAdminStatus = async () => {
    if (!currentUser) {
      return { isAdmin: false, message: "No hay usuario autenticado" };
    }
    
    try {
      console.log("Verificando permisos de administrador para:", currentUser.uid);
      const userDocRef = doc(db, "users", currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        console.error("El documento del usuario no existe en Firestore");
        return { isAdmin: false, message: "El usuario no existe en la base de datos" };
      }
      
      const userData = userDoc.data();
      console.log("Datos del usuario:", userData);
      
      if (userData?.isAdmin !== true) {
        return { 
          isAdmin: false, 
          message: "El usuario no tiene permisos de administrador" 
        };
      }
      
      return { isAdmin: true, message: "Usuario con permisos de administrador" };
    } catch (error) {
      console.error("Error al verificar permisos de administrador:", error);
      return { 
        isAdmin: false, 
        message: "Error al verificar permisos de administrador" 
      };
    }
  };

  // Save schedule to firestore
  const saveSchedule = async () => {
    try {
      // Primero verificamos que el usuario sea administrador
      const adminStatus = await verifyAdminStatus();
      if (!adminStatus.isAdmin) {
        console.error("Error de permisos:", adminStatus.message);
        return { 
          success: false, 
          message: `Error de permisos: ${adminStatus.message}` 
        };
      }
      
      console.log("Guardando horarios en Firestore...");
      
      // First, clear any existing schedule
      const scheduleCollection = collection(db, "schedule");
      const snapshot = await getDocs(scheduleCollection);
      
      // Delete all existing documents
      const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      
      // Add new schedule documents
      const savePromises = schedule.map(async (day, index) => {
        // Use ordinal index as document ID to preserve order
        const docRef = doc(db, "schedule", `day-${index}`);
        await setDoc(docRef, day);
        console.log(`Guardado día ${index}: ${day.dayName}`);
      });
      
      await Promise.all(savePromises);
      console.log("Todos los horarios guardados correctamente");
      
      return { success: true, message: "Horario guardado correctamente" };
    } catch (error) {
      console.error("Error al guardar horario:", error);
      return { 
        success: false, 
        message: "Error al guardar el horario. Verifica los permisos y la conexión." 
      };
    }
  };

  return {
    schedule,
    setSchedule,
    loading,
    error,
    getAvailableTimesForDate,
    isWorkDay,
    saveSchedule,
    verifyAdminStatus
  };
}
