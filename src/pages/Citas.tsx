
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import UserSidebar from "@/components/UserSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Card, 
  CardContent,
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { format, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

// Interface for time slots
interface TimeSlot {
  id: string;
  time: string;
  available: number;
}

// Interface for time periods
interface TimePeriod {
  name: string;
  slots: TimeSlot[];
}

const Citas: React.FC = () => {
  const { currentUser } = useAuth();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Mock data - available days (you would fetch this from a database)
  const availableDays = [
    new Date(2025, 3, 3), // April 3, 2025
    new Date(2025, 3, 5), 
    new Date(2025, 3, 10),
    new Date(2025, 3, 12),
    new Date(2025, 3, 17),
    new Date(2025, 3, 19),
    new Date(2025, 3, 24),
    new Date(2025, 3, 26),
  ];

  // Mock data - time slots
  const timePeriods: TimePeriod[] = [
    {
      name: "Mañana",
      slots: [
        { id: "1", time: "07:30 am - 09:00 am", available: 15 },
        { id: "2", time: "09:00 am - 10:30 am", available: 15 },
        { id: "3", time: "10:30 am - 12:00 pm", available: 15 }
      ]
    },
    {
      name: "Tarde",
      slots: [
        { id: "4", time: "12:00 pm - 01:30 pm", available: 15 },
        { id: "5", time: "01:30 pm - 03:00 pm", available: 15 },
        { id: "6", time: "03:00 pm - 04:30 pm", available: 15 }
      ]
    }
  ];

  // Function to check if a day is available
  const isDayAvailable = (day: Date): boolean => {
    return availableDays.some(availableDay => isSameDay(availableDay, day));
  };

  // Handle time slot selection
  const handleTimeSlotSelect = (slotId: string) => {
    setSelectedTimeSlot(slotId);
  };

  // Function to handle appointment booking
  const handleBookAppointment = () => {
    if (!date || !selectedTimeSlot) return;
    
    const selectedSlot = timePeriods.flatMap(period => period.slots).find(slot => slot.id === selectedTimeSlot);
    
    if (!selectedSlot) return;
    
    // Here you would make an API call to book the appointment
    // For now, just show a success toast
    toast({
      title: "Cita programada",
      description: `Tu cita ha sido programada para el ${format(date, "PPP", { locale: es })} a las ${selectedSlot.time}.`,
    });
    
    setShowConfirmation(true);
  };

  if (!currentUser) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="flex min-h-screen pt-16">
        <UserSidebar />
        
        <div className="flex-1 p-4 md:p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Mis Citas</h1>
            <p className="text-gray-600 text-sm">Gestiona tus citas médicas</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <Card className="md:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Calendario</CardTitle>
                <CardDescription>Selecciona una fecha disponible</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mt-1">
                  <div className="flex items-center justify-between mb-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="font-medium">March 2025</div>
                    <div className="w-8"></div> {/* Spacer for alignment */}
                  </div>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border-0"
                    classNames={{
                      day_selected: "bg-blue-600 text-primary-foreground hover:bg-blue-600 hover:text-primary-foreground",
                      day: cn(
                        "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
                        "hover:bg-accent hover:text-accent-foreground"
                      ),
                      day_today: "bg-accent text-accent-foreground font-bold",
                      day_disabled: "text-muted-foreground opacity-30",
                      head_cell: "text-xs font-medium text-gray-500",
                      caption: "hidden", // Hide default caption since we made our own
                    }}
                    disabled={(date) => !isDayAvailable(date)}
                  />
                </div>
              </CardContent>
            </Card>
            
            {!showConfirmation ? (
              <Card className="md:col-span-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Horarios Disponibles</CardTitle>
                  <CardDescription>
                    {date ? (
                      `Selecciona un horario para el ${format(date, "d 'de' MMMM 'de' yyyy", { locale: es })}`
                    ) : (
                      "Primero selecciona una fecha"
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {date && isDayAvailable(date) ? (
                    <ScrollArea className="h-[350px] pr-4">
                      {timePeriods.map((period) => (
                        <div key={period.name} className="mb-5">
                          <h3 className="text-md font-medium mb-3">{period.name}</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {period.slots.map((slot) => (
                              <Button
                                key={slot.id}
                                variant={selectedTimeSlot === slot.id ? "default" : "outline"}
                                className={cn(
                                  "justify-start h-auto py-2 px-3 border-gray-200 rounded",
                                  selectedTimeSlot === slot.id ? "bg-blue-600 text-white" : ""
                                )}
                                onClick={() => handleTimeSlotSelect(slot.id)}
                              >
                                <div className="flex flex-col items-start">
                                  <span className="text-left text-sm">{slot.time}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {slot.available} turnos disponibles
                                  </span>
                                </div>
                              </Button>
                            ))}
                          </div>
                        </div>
                      ))}
                      
                      <div className="mt-6">
                        <Button 
                          className="w-full bg-blue-600 hover:bg-blue-700" 
                          disabled={!selectedTimeSlot}
                          onClick={handleBookAppointment}
                        >
                          Reservar Cita
                        </Button>
                      </div>
                    </ScrollArea>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <p>{date ? "No hay horarios disponibles para esta fecha." : "Selecciona una fecha para ver los horarios disponibles."}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Cita Confirmada</CardTitle>
                  <CardDescription>
                    Tu cita ha sido reservada con éxito
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
                    <h3 className="font-medium text-green-800 mb-2">Detalles de la cita:</h3>
                    <p className="text-green-700">
                      <strong>Fecha:</strong> {date && format(date, "PPP", { locale: es })}
                    </p>
                    <p className="text-green-700">
                      <strong>Hora:</strong> {
                        selectedTimeSlot && 
                        timePeriods
                          .flatMap(period => period.slots)
                          .find(slot => slot.id === selectedTimeSlot)?.time
                      }
                    </p>
                  </div>
                  
                  <p className="text-gray-600 mb-4 text-sm">
                    Se ha enviado un correo electrónico de confirmación a tu dirección de correo.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => {
                        setShowConfirmation(false);
                        setSelectedTimeSlot(null);
                        setDate(new Date());
                      }}
                    >
                      Agendar otra cita
                    </Button>
                    <Button variant="outline">
                      Volver al panel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Citas;
