import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
// import Logo from '../../images/logo/logo.svg';
import Logo from '../../images/logo/timedoor-logo-2.png';
// import Logo from '../../images/logo/timedoor-logo.png';
import { RiHome3Line, RiAdminLine } from "react-icons/ri";
import { FiUsers } from "react-icons/fi";
import { IoIosArrowBack } from "react-icons/io";
import { CiGrid42 } from "react-icons/ci";
import { BsGrid } from "react-icons/bs";
import bg2 from '../../images/backGround/Bg-2.svg';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true'
  );

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen w-60 flex-col overflow-y-hidden bg-white shadow-lg duration-300 ease-linear  lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
    >
      <img
        src={bg2}
        alt=""
        className="absolute bottom-0 left-0 h-30 -z-1"
      />
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center justify-between gap-2 px-6 pt-5.5 lg:pt-6.5">
        <NavLink to="/">
          <div className="flex items-center ">
            <img src={Logo} alt="Logo" className="h-20 w-full mr-4 round " />
          </div>

        </NavLink>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >
          <IoIosArrowBack color='black' size={20} />
        </button>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* <!-- Sidebar Menu --> */}
        <nav className="mt-5 pb-4 px-4 lg:mt-9 lg:px-6">
          {/* <!-- Menu Group --> */}
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-ash-5">
              MENU
            </h3>

            <ul className="mb-6 flex flex-col gap-1.5">
              {/* <!-- Menu Item Dashboard --> */}
              <li>
                <NavLink
                  to="/"
                  className={`side-link ${pathname === '/' &&
                    'side-active'
                    }`}
                >
                  <RiHome3Line size={20} />
                  Dashboard
                </NavLink>
              </li>
              {/* <!-- Menu Item Dashboard --> */}

            </ul>
          </div>

          {/* <!-- Users Group --> */}
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-ash-5">
              USERS
            </h3>

            <ul className="mb-6 flex flex-col gap-1.5">
              {/* <!-- Users Item Trainee --> */}
              <li>
                <NavLink
                  to="/trainee"
                  className={`side-link ${pathname.includes('trainee') && 'side-active'
                    }`}
                >
                  <FiUsers size={20} />
                  Trainee
                </NavLink>
              </li>
              {/* <!-- Users Item Trainee --> */}

              {/* <!-- Users Item Admin --> */}
              <li>
                <NavLink
                  to="/admin"
                  className={`side-link ${pathname.includes('admin') && 'side-active'
                    }`}
                >
                  <RiAdminLine size={20} />
                  Admin
                </NavLink>
              </li>
              {/* <!-- Users Item Admin --> */}


            </ul>
          </div>

          {/* <!-- Others Group --> */}
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-ash-5">
              OTHERS
            </h3>

            <ul className="mb-6 flex flex-col gap-1.5">
              {/* <!-- Others Item Trainee --> */}
              <li>
  <NavLink
    to="/division"
    className={`side-link group ${pathname.includes('division') ? 'side-active' : ''}`}
  >
    <span className={`flex items-center gap-2.5 ${pathname.includes('division') ? 'text-white' : 'text-ash-6'}`}>
      <BsGrid size={20} />
      Division
    </span>
  </NavLink>
</li>

              {/* <!-- Others Item Trainee --> */}


            </ul>
          </div>
        </nav>
        {/* <!-- Sidebar Menu --> */}
      </div>
    </aside>
  );
};

export default Sidebar;
