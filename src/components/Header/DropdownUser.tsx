import { useState } from 'react';
import { Link } from 'react-router-dom';
import ClickOutside from '../ClickOutside';
import UserOne from '../../images/user/user-01.png';
import { useFireStoreDetail } from '../../hooks/useFireStoreDetail';
import { collectionNames } from '../../services/collections';
import { FaAngleDown } from "react-icons/fa6";
import { RiUser3Line } from "react-icons/ri";
import { FiLogOut } from "react-icons/fi";

const DropdownUser = ({userId, handleLogout}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { data: user, loading: userLoading, error } = useFireStoreDetail(collectionNames.users, userId || "");
  
  if (userLoading) {
    return <p></p>
  }
  
  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <Link
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4"
        to="#"
      >
        <span className="hidden text-right lg:block">
          <span className="block text-sm font-medium text-black dark:text-white">
          {user?.name}
          </span>
          <div className='flex items-center justify-end'>
            <span className="block text-xs">{user?.role == 'admin' ? 'Admin' : user?.role == 'super.admin' ? 'Super Admin' : 'Undefined'} </span> |
            <span className="block text-xs">{user?.division || 'Undfined'}</span>
          </div>
        </span>

        <span className="h-12 w-12 rounded-full">
          <img src={UserOne} alt="User" />
        </span>

        <FaAngleDown size={15}/>
      </Link>

      {/* <!-- Dropdown Start --> */}
      {dropdownOpen && (
        <div
          className={`absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark`}
        >
          <ul className="flex flex-col gap-5 border-b border-stroke px-6 py-4 dark:border-strokedark">
            <li>
              <Link
                to="/profile"
                className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
              >
                <RiUser3Line size={20}/>
                My Profile
              </Link>
            </li>
          </ul>
          <button 
            className="flex items-center gap-3.5 px-6 py-4 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
            onClick={handleLogout}
          >
            <FiLogOut size={20}/>
            Log Out
          </button>
        </div>
      )}
      {/* <!-- Dropdown End --> */}
    </ClickOutside>
  );
};

export default DropdownUser;
