import React from 'react';
import CardDataStats from '../../components/CardDataStats';
import { LiaUserClockSolid } from "react-icons/lia";
import { LuUserCheck } from "react-icons/lu";
import { FiClock, FiUsers } from "react-icons/fi";
import { useFireStoreCount } from '../../hooks/useFireStoreCount';
import { Timestamp } from 'firebase/firestore';
import { collectionNames } from '../../services/collections';
import ChartOneDummy from '../../components/Charts/ChartOneDummy';
import ChartTwoDummy from '../../components/Charts/ChartTwoDummy';
import { useFireStoreCountByUniqueDates } from '../../hooks/useFireStoreCountByUniqueDates';
import ChartOne from '../../components/Charts/ChartOne';
import { Navigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  // Today Trainee
  const today = new Date();
  const todayStart = Timestamp.fromDate(new Date(today.setHours(0, 0, 0, 0))); // Awal hari ini
  const todayEnd = Timestamp.fromDate(new Date(today.setHours(23, 59, 59, 999))); // Akhir hari ini

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const yesterdayStart = Timestamp.fromDate(new Date(yesterday.setHours(0, 0, 0, 0))); // Awal hari ini
  const yesterdayEnd = Timestamp.fromDate(new Date(yesterday.setHours(23, 59, 59, 999)));

  const traineeTodayFilters = [
    { field: 'date', operator: '>=', value: todayStart },
    { field: 'date', operator: '<=', value: todayEnd },
  ];
  const { count: traineeTodayCount, loading: traineeTodayLoading } = useFireStoreCount(collectionNames.logbooks, traineeTodayFilters);
  

  const traineeYesterdayFilters = [
    { field: 'date', operator: '>=', value: yesterdayStart },
    { field: 'date', operator: '<=', value: yesterdayEnd },
  ];
  const { count: traineeYesterdayCount, loading: traineeYesterdayLoading } = useFireStoreCount(collectionNames.logbooks, traineeYesterdayFilters);
  
  // Active Trainee
  const traineeActiveFilters = [
    { field: 'isActive', operator: '==', value: true },
    { field: 'role', operator: '==', value: 'trainee' },
  ];
  const { count: traineeActiveCount, loading: traineeActiveLoading } = useFireStoreCount(collectionNames.users, traineeActiveFilters);

  // Total Intern
  const internTotalFilters = [
    { field: 'isActive', operator: '==', value: true },
    { field: 'trainee_type', operator: '==', value: 'intern' },
  ];
  const { count: internTotalCount, loading: internTotalLoading } = useFireStoreCount(collectionNames.users, internTotalFilters);

  // Total Part Time
  const partTimeTotalFilters = [
    { field: 'isActive', operator: '==', value: true },
    { field: 'trainee_type', operator: '==', value: 'part-time' },
  ];
  const { count: partTimeTotalCount, loading: partTimeTotalLoading } = useFireStoreCount(collectionNames.users, partTimeTotalFilters);

  // // Last 7 Days (blom valid)
  // const { counts: last7DaysCounts, loading: last7DaysLoading } = useFireStoreCountLastNDays(collectionNames.logbooks, 7, []);

  const calculatePercentageChange = (current , previous) => {
    const result = ( (current - previous) / previous ) * 100
    const percentage = `${result.toFixed(2)}%`;
    const levelUp = result > 0; // True if current is greater than previous
    const levelDown = result < 0; // True if current is less than previous
    return { percentage, levelUp, levelDown };
  };

  // Trainee Today
  const { percentage: todayTraineeRate, levelUp: traineeTodayLevelUp, levelDown: traineeTodayLevelDown } = calculatePercentageChange(traineeTodayCount, traineeYesterdayCount);

  
  

  if (traineeActiveLoading || traineeTodayLoading || internTotalLoading || partTimeTotalLoading || traineeYesterdayLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardDataStats 
          title="Trainee Today" 
          total={traineeTodayCount.toString()} 
          rate={todayTraineeRate} 
          levelUp={traineeTodayLevelUp} 
          levelDown={traineeTodayLevelDown}>
          <FiClock  size={25} color='green' />
        </CardDataStats>
        
        <CardDataStats title="Active Trainee" total={traineeActiveCount.toString()} rate={''}>
          <LuUserCheck size={25} color='green' />
        </CardDataStats>

        <CardDataStats title="Total Active Intern" total={internTotalCount.toString()} rate={''}>
          <FiUsers size={25} color='green' />
        </CardDataStats>

        <CardDataStats title="Total Active Part Time" total={partTimeTotalCount.toString()} rate={''}>
          <FiUsers size={25} color='green' />
        </CardDataStats>
      </div>
    
      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <ChartOneDummy />
        {/* <ChartOne /> */}
        <ChartTwoDummy />
      </div>
    </>
  );
};

export default Dashboard;
