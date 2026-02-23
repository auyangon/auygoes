import { Outlet } from 'react-router-dom'; 
 
export default function MainLayout() { 
  return ( 
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 to-emerald-950"> 
      <div className="p-6"> 
        <Outlet /> 
      </div> 
    </div> 
  ); 
} 
