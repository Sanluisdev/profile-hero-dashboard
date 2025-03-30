
import React from "react";
import UserTable from "@/components/UserTable";

const UsersPage: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Gestión de Usuarios</h2>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Usuarios registrados</h3>
        <UserTable />
      </div>
    </div>
  );
};

export default UsersPage;
