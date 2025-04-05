
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
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSchedule } from "@/hooks/useSchedule";

const Citas: React.FC = () => {
  const { currentUser } = useAuth();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  // Use our custom hook to get the schedule
  const { isWorkDay, getAvailableTimesForDate, loading } = useSchedule();
  
  // Get the available time slots for the selected date
  const availableTimeSlots = date ? getAvailableTimesForDate(date) : [];

  // Handle time slot selection
  const handleTimeSlotSelect = (slotId: string) => {
    setSelectedTimeSlot(slotId);
  };

  // Function to handle appointment booking
  const handleBookAppointment = () => {
    if (!date || !selectedTimeSlot) return;
    
    const selectedSlot = availableTimeSlots.find(slot => slot.id === selectedTimeSlot);
    
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
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Mis Citas</h1>
            <p className="text-gray-600">Gestiona tus citas médicas</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Calendario</CardTitle>
                <CardDescription>Selecciona una fecha disponible</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">Cargando horarios...</div>
                ) : (
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border pointer-events-auto"
                    classNames={{
                      day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                      day: cn(
                        "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
                        "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      ),
                      day_today: "bg-accent text-accent-foreground",
                      day_disabled: "text-muted-foreground opacity-50",
                    }}
                    disabled={(date) => !isWorkDay(date)}
                  />
                )}
              </CardContent>
            </Card>
            
            {!showConfirmation ? (
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Horarios Disponibles</CardTitle>
                  <CardDescription>
                    {date ? (
                      `Selecciona un horario para el ${format(date, "PPP", { locale: es })}`
                    ) : (
                      "Primero selecciona una fecha"
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center py-8">Cargando horarios...</div>
                  ) : date && isWorkDay(date) ? (
                    <ScrollArea className="h-[400px] pr-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {availableTimeSlots.map((slot) => (
                          <Button
                            key={slot.id}
                            variant={selectedTimeSlot === slot.id ? "default" : "outline"}
                            className={cn(
                              "justify-start h-auto py-3 px-4",
                              selectedTimeSlot === slot.id ? "border-primary" : "border-gray-200"
                            )}
                            onClick={() => handleTimeSlotSelect(slot.id)}
                          >
                            <div className="flex flex-col items-start">
                              <span className="text-left">{slot.time}</span>
                            </div>
                          </Button>
                        ))}
                      </div>
                      
                      <div className="mt-6">
                        <Button 
                          className="w-full" 
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
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Cita Confirmada</CardTitle>
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
                        availableTimeSlots.find(slot => slot.id === selectedTimeSlot)?.time
                      }
                    </p>
                  </div>
                  
                  <p className="text-gray-600 mb-4">
                    Se ha enviado un correo electrónico de confirmación a tu dirección de correo.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
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
