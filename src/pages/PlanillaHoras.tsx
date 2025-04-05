
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

type TimeRange = {
  id: string;
  start: string;
  end: string;
};

type DaySchedule = {
  dayName: string;
  isWorkDay: boolean;
  timeRanges: TimeRange[];
};

const PlanillaHoras: React.FC = () => {
  const daysOfWeek = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];

  const [schedule, setSchedule] = useState<DaySchedule[]>(
    daysOfWeek.map((day) => ({
      dayName: day,
      isWorkDay: day !== "Domingo",
      timeRanges: day !== "Domingo" ? [{ id: crypto.randomUUID(), start: "09:00", end: "17:00" }] : [],
    }))
  );

  const addTimeRange = (dayIndex: number) => {
    setSchedule((prev) => {
      const newSchedule = [...prev];
      newSchedule[dayIndex].timeRanges.push({
        id: crypto.randomUUID(),
        start: "09:00",
        end: "17:00",
      });
      return newSchedule;
    });
  };

  const removeTimeRange = (dayIndex: number, rangeId: string) => {
    setSchedule((prev) => {
      const newSchedule = [...prev];
      newSchedule[dayIndex].timeRanges = newSchedule[dayIndex].timeRanges.filter(
        (range) => range.id !== rangeId
      );
      return newSchedule;
    });
  };

  const updateTimeRange = (dayIndex: number, rangeId: string, field: "start" | "end", value: string) => {
    setSchedule((prev) => {
      const newSchedule = [...prev];
      const rangeIndex = newSchedule[dayIndex].timeRanges.findIndex((range) => range.id === rangeId);
      if (rangeIndex !== -1) {
        newSchedule[dayIndex].timeRanges[rangeIndex][field] = value;
      }
      return newSchedule;
    });
  };

  const toggleWorkDay = (dayIndex: number) => {
    setSchedule((prev) => {
      const newSchedule = [...prev];
      newSchedule[dayIndex].isWorkDay = !newSchedule[dayIndex].isWorkDay;
      
      // Si se marca como no laborable, limpiar los rangos de tiempo
      if (!newSchedule[dayIndex].isWorkDay) {
        newSchedule[dayIndex].timeRanges = [];
      } else if (newSchedule[dayIndex].timeRanges.length === 0) {
        // Si se marca como laborable y no tiene rangos, agregar uno por defecto
        newSchedule[dayIndex].timeRanges = [{ id: crypto.randomUUID(), start: "09:00", end: "17:00" }];
      }
      
      return newSchedule;
    });
  };

  const saveSchedule = () => {
    // Aquí se implementaría la lógica para guardar en una base de datos
    console.log("Guardando horario:", schedule);
    toast.success("Horario guardado correctamente");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Planilla de Horas</h1>
        <p className="text-gray-600">Configure la disponibilidad semanal</p>
      </div>
      
      <div className="grid gap-6">
        {schedule.map((day, dayIndex) => (
          <Card key={day.dayName} className="w-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl">{day.dayName}</CardTitle>
              <div className="flex items-center">
                <label className="text-sm mr-2">Día laborable</label>
                <input
                  type="checkbox"
                  checked={day.isWorkDay}
                  onChange={() => toggleWorkDay(dayIndex)}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
              </div>
            </CardHeader>
            
            <CardContent>
              {day.isWorkDay ? (
                <>
                  {day.timeRanges.map((range) => (
                    <div key={range.id} className="flex items-center gap-2 mb-3">
                      <div className="flex-1 flex items-center">
                        <span className="mr-2">De</span>
                        <Input
                          type="time"
                          value={range.start}
                          onChange={(e) => updateTimeRange(dayIndex, range.id, "start", e.target.value)}
                          className="flex-1"
                        />
                      </div>
                      <div className="flex-1 flex items-center">
                        <span className="mx-2">a</span>
                        <Input
                          type="time"
                          value={range.end}
                          onChange={(e) => updateTimeRange(dayIndex, range.id, "end", e.target.value)}
                          className="flex-1"
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeTimeRange(dayIndex, range.id)}
                        disabled={day.timeRanges.length === 1}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => addTimeRange(dayIndex)} 
                    className="mt-2"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Agregar horario
                  </Button>
                </>
              ) : (
                <div className="text-gray-500 py-2">Ninguno - Día no laborable</div>
              )}
            </CardContent>
          </Card>
        ))}
        
        <div className="flex justify-end mt-4">
          <Button onClick={saveSchedule} className="bg-blue-600 hover:bg-blue-700">
            Guardar Horarios
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PlanillaHoras;
