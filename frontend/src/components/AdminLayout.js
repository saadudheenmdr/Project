import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      
      {/* Persistent Sidebar */}
      <aside style={{ width: '250px', backgroundColor: '#1e293b', color: 'white', padding: '20px' }}>
        <h2 style={{ borderBottom: '1px solid #334155', paddingBottom: '10px' }}>Admin Panel</h2>
        <nav style={{ marginTop: '20px' }}>
          <ul style={{ listStyleType: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <li>
              <Link to="/admin-dashboard" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '1.1rem' }}>
                📊 Dashboard Stats
              </Link>
            </li>
            <li>
              <Link to="/admin-appointments" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '1.1rem' }}>
                📅 Appointments
              </Link>
            </li>
            {/* You can add a logout button here later */}
          </ul>
        </nav>
      </aside>

      {/* Dynamic Content Area */}
      <main style={{ flex: 1, padding: '20px', backgroundColor: '#f8fafc' }}>
        {/* <Outlet /> is where AdminDashboard or AdminAppointment will render */}
        <Outlet /> 
      </main>
      
    </div>
  );
};

export default AdminLayout;