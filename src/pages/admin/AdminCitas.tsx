
import React, { useState } from "react";
import { Calendar, ChevronLeft, ChevronRight, Download, Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";

// Sample appointment data
const sampleAppointments = [
  {
    id: "#38",
    date: "01/04/2025 2:20 pm",
    customer: "demo customer1",
    service: "Classic",
    duration: "40 Mins",
    status: "Pending",
    payment: "$ 31.36",
    createdDate: "31/03/2025 6:12 pm"
  },
];

type AppointmentStatus = "All" | "Pending" | "Completed" | "Cancelled";

const AdminCitas: React.FC = () => {
  const [dateRange, setDateRange] = useState<{start: string, end: string}>({
    start: "28/03/2025",
    end: "03/04/2025"
  });
  const [customerSearch, setCustomerSearch] = useState<string>("");
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<AppointmentStatus>("All");
  const [appointments, setAppointments] = useState(sampleAppointments);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  
  const handleFilter = () => {
    console.log("Filtering with:", { dateRange, customerSearch, selectedService, selectedStatus });
    // In a real app, this would filter the appointments based on the selected criteria
  };
  
  const handleReset = () => {
    setDateRange({ start: "28/03/2025", end: "03/04/2025" });
    setCustomerSearch("");
    setSelectedService("");
    setSelectedStatus("All");
  };
  
  const handleExport = () => {
    console.log("Exporting appointments data");
    // In a real app, this would export the appointments to a CSV/Excel file
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage Appointments</h1>
        <div className="flex gap-3">
          <Button className="bg-emerald-500 hover:bg-emerald-600">
            <span className="mr-1">+</span> Add New
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <span>Share URL</span>
          </Button>
        </div>
      </div>
      
      <Card className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm mb-1 text-gray-500">Appointment Date</label>
            <div className="flex items-center border rounded-md">
              <div className="flex-1 flex items-center pl-3">
                <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-sm">{dateRange.start}</span>
              </div>
              <div className="px-2">-</div>
              <div className="flex-1 flex items-center">
                <span className="text-sm">{dateRange.end}</span>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm mb-1 text-gray-500">Customer Name</label>
            <Input 
              placeholder="Start typing to fetch Customer" 
              value={customerSearch}
              onChange={(e) => setCustomerSearch(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm mb-1 text-gray-500">Service</label>
            <Select value={selectedService} onValueChange={setSelectedService}>
              <SelectTrigger>
                <SelectValue placeholder="Select Service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="classic">Classic</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="deluxe">Deluxe</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm mb-1 text-gray-500">Status</label>
            <Select 
              value={selectedStatus} 
              onValueChange={(value) => setSelectedStatus(value as AppointmentStatus)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <Input 
            placeholder="Appointment ID" 
            className="max-w-[200px]"
          />
          
          <div className="flex-1 relative">
            <Input 
              placeholder="Search for Customers, Services..." 
              className="w-full pl-9"
            />
            <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleReset}>Reset</Button>
            <Button className="bg-emerald-500 hover:bg-emerald-600" onClick={handleFilter}>Apply</Button>
            <Button variant="outline" className="flex items-center gap-1" onClick={handleExport}>
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </Card>
      
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <input type="checkbox" className="rounded border-gray-300" />
                </TableHead>
                <TableHead className="cursor-pointer">
                  ID <ChevronDown className="inline h-4 w-4" />
                </TableHead>
                <TableHead className="cursor-pointer">
                  Date <ChevronDown className="inline h-4 w-4" />
                </TableHead>
                <TableHead className="cursor-pointer">
                  Customer <ChevronDown className="inline h-4 w-4" />
                </TableHead>
                <TableHead className="cursor-pointer">
                  Service <ChevronDown className="inline h-4 w-4" />
                </TableHead>
                <TableHead className="cursor-pointer">
                  Duration <ChevronDown className="inline h-4 w-4" />
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="cursor-pointer">
                  Payment <ChevronDown className="inline h-4 w-4" />
                </TableHead>
                <TableHead className="cursor-pointer">
                  Created Date <ChevronDown className="inline h-4 w-4" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>
                    <input type="checkbox" className="rounded border-gray-300" />
                  </TableCell>
                  <TableCell>{appointment.id}</TableCell>
                  <TableCell>{appointment.date}</TableCell>
                  <TableCell>{appointment.customer}</TableCell>
                  <TableCell>{appointment.service}</TableCell>
                  <TableCell>{appointment.duration}</TableCell>
                  <TableCell>
                    <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-md inline-flex items-center">
                      {appointment.status} <ChevronDown className="ml-1 h-4 w-4" />
                    </div>
                  </TableCell>
                  <TableCell>{appointment.payment}</TableCell>
                  <TableCell>{appointment.createdDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="p-4 border-t flex items-center justify-between text-sm">
          <div>Showing 1 out of 1</div>
          <div className="flex items-center gap-2">
            <span>Per Page</span>
            <Select value={perPage.toString()} onValueChange={(value) => setPerPage(Number(value))}>
              <SelectTrigger className="w-[70px]">
                <SelectValue placeholder="20" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex items-center ml-4">
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-md" disabled>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="mx-2 bg-emerald-500 text-white w-8 h-8 rounded-md flex items-center justify-center">
                1
              </span>
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-md" disabled>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminCitas;
