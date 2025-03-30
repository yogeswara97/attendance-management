import React, { useState, ReactNode } from 'react';
import Header from '../components/Header/index';
import Sidebar from '../components/Sidebar/index';
import bg from '../images/backGround/Bg.svg';

const DefaultLayout: React.FC<{ children: ReactNode, user: any, handleLogout:() => void}> = ({ children, user, handleLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="">
      {/* <!-- ===== Page Wrapper Start ===== --> */}
      <div className="flex h-screen overflow-hidden">
        {/* <!-- ===== Sidebar Start ===== --> */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        {/* <!-- ===== Sidebar End ===== --> */}

        {/* <!-- ===== Content Area Start ===== --> */}
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          {/* <!-- ===== Header Start ===== --> */}
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} userId={user} handleLogout={handleLogout}/>
          {/* <!-- ===== Header End ===== --> */}

          {/* <!-- ===== Main Content Start ===== --> */}
          <main className="relative">
            <img 
              src={bg} 
              alt="" 
              className="absolute top-0 right-0 h-100 -z-1"
            />
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              {children}
            </div>
            {/* <img 
              src={bg2} 
              alt="" 
              className="absolute bottom-0 left-0 h-100 " 
              style={{ zIndex: -1 }} // Ensure the image is behind the content
            /> */}
          </main>
          {/* <!-- ===== Main Content End ===== --> */}
        </div>
        {/* <!-- ===== Content Area End ===== --> */}
      </div>
      {/* <!-- ===== Page Wrapper End ===== --> */}
    </div>
  );
};

export default DefaultLayout;
