import React from 'react';

const Calendar = ({ logbooks }) => {
  const currentDate = new Date();
  const [displayedDate, setDisplayedDate] = React.useState(currentDate);

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const renderCalendar = () => {
    const month = displayedDate.getMonth();
    const year = displayedDate.getFullYear();
    const daysInMonth = getDaysInMonth(month, year);
    const firstDay = getFirstDayOfMonth(month, year);

    const days = [];
    // Fill the first week with empty cells
    for (let i = 0; i < firstDay; i++) {
      days.push(<td key={`empty-${i}`} className="h-20"></td>);
    }

    // Fill the calendar with days
    for (let day = 1; day <= daysInMonth; day++) {
      const logbookForDay = logbooks.find((logbook: { date: { toDate: () => any; }; }) => {
        const logbookDate = logbook.date?.toDate();
        return logbookDate && logbookDate.getDate() === day && logbookDate.getMonth() === month && logbookDate.getFullYear() === year;
      });

      days.push(
        <td key={day} className="ease relative h-20 cursor-pointer border border-stroke p-2 transition duration-500 hover:bg-gray dark:border-strokedark dark:hover:bg-meta-4 md:h-25 md:p-6 xl:h-31">
          <span className="font-medium text-black dark:text-white">{day}</span>
          {logbookForDay && (
            <div className="absolute bottom-1 left-1 w-2 h-2 bg-primary rounded-full"></div> // Marker for logbook
          )}
        </td>
      );
    }

    // Split days into weeks
    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(
        <tr key={`week-${i}`} className="grid grid-cols-7">
          {days.slice(i, i + 7)}
        </tr>
      );
    }

    return weeks;
  };

  const handlePrevMonth = () => {
    setDisplayedDate(new Date(displayedDate.getFullYear(), displayedDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setDisplayedDate(new Date(displayedDate.getFullYear(), displayedDate.getMonth() + 1, 1));
  };

  return (
    <>
      <div className="flex justify-between items-center p-4">
        <button onClick={handlePrevMonth} className="text-primary">Previous</button>
        <h2 className="text-lg font-bold">
          {displayedDate.toLocaleString('default', { month: 'long' })} {displayedDate.getFullYear()}
        </h2>
        <button onClick={handleNextMonth} className="text-primary">Next</button>
      </div>
      <table className="w-full">
        <thead>
          <tr className="grid grid-cols-7 rounded-t-sm bg-primary text-white">
            <th className="flex h-15 items-center justify-center rounded-tl-sm p-1 text-xs font-semibold sm:text-base xl:p-5">Sun</th>
            <th className="flex h-15 items-center justify-center p-1 text-xs font-semibold sm:text-base xl:p-5">Mon</th>
            <th className="flex h-15 items-center justify-center p-1 text-xs font-semibold sm:text-base xl:p-5">Tue</th>
            <th className="flex h-15 items-center justify-center p-1 text-xs font-semibold sm:text-base xl:p-5">Wed</th>
            <th className="flex h-15 items-center justify-center p-1 text-xs font-semibold sm:text-base xl:p-5">Thu</th>
            <th className="flex h-15 items-center justify-center p-1 text-xs font-semibold sm:text-base xl:p-5">Fri</th>
            <th className="flex h-15 items-center justify-center rounded-tr-sm p-1 text-xs font-semibold sm:text-base xl:p-5">Sat</th>
          </tr>
        </thead>
        <tbody>
          {renderCalendar()}
        </tbody>
      </table>
    </>
  );
};

export default Calendar;
