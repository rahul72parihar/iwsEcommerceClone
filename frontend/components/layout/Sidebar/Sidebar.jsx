import React, { useState } from 'react';
import "../../../styles/Sidebar.css";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20}/>, path: '/admin' },
    { name: 'Products', icon: <ShoppingBag size={20}/>, path: '/products' },
    { name: 'Categories', icon: <List size={20}/>, path: '/categories' },
    { name: 'Profile', icon: <User size={20}/>, path: '/profile' },
    { name: 'Settings', icon: <Settings size={20}/>, path: '/settings' },
  ];

  return (
    <div className={`flex flex-col h-screen p-3 bg-white shadow-xl duration-300 ${isOpen ? 'w-64' : 'w-20'}`}>
      <div className="flex items-center justify-between">
        <h2 className={`font-bold text-xl text-blue-600 ${!isOpen && 'hidden'}`}>ShopAdmin</h2>
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 hover:bg-gray-100 rounded-md">
          {isOpen ? <X size={20}/> : <Menu size={20}/>}
        </button>
      </div>

      <ul className="pt-6 space-y-2">
        {menuItems.map((item, index) => (
          <li key={index} className="flex items-center p-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md cursor-pointer">
            <span className="mr-3">{item.icon}</span>
            <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>{item.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;