import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJobs } from '../../contexts/JobContext';
import Card from '../ui/Card';
import Button from '../ui/Button';

const JobCalendar = () => {
  const navigate = useNavigate();
  const { jobs, getJobsByDateRange } = useJobs();
  
  // State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);
  const [viewMode, setViewMode] = useState('month'); // 'month' or 'week'
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedDayJobs, setSelectedDayJobs] = useState([]);
  
  // Get current year and month
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  
  // Format date as YYYY-MM-DD
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  // Parse ISO date string
  const parseDate = (dateString) => {
    const [year, month, day] = dateString.split('-').map(num => parseInt(num, 10));
    return new Date(year, month - 1, day);
  };
  
  // Generate days for calendar
  useEffect(() => {
    if (viewMode === 'month') {
      // First day of the month
      const firstDay = new Date(currentYear, currentMonth, 1);
      // Last day of the month
      const lastDay = new Date(currentYear, currentMonth + 1, 0);
      
      // Day of the week for the first day (0 = Sunday, 6 = Saturday)
      const firstDayOfWeek = firstDay.getDay();
      
      // Total days to show (previous month days + current month days)
      const totalDays = firstDayOfWeek + lastDay.getDate();
      // Ensure we have complete weeks (7 days each)
      const totalCalendarDays = Math.ceil(totalDays / 7) * 7;
      
      const days = [];
      
      // Add days from previous month
      const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
      for (let i = 0; i < firstDayOfWeek; i++) {
        const day = prevMonthLastDay - (firstDayOfWeek - i - 1);
        const date = new Date(currentYear, currentMonth - 1, day);
        days.push({
          date,
          day,
          isCurrentMonth: false,
          formattedDate: formatDate(date)
        });
      }
      
      // Add days from current month
      for (let i = 1; i <= lastDay.getDate(); i++) {
        const date = new Date(currentYear, currentMonth, i);
        days.push({
          date,
          day: i,
          isCurrentMonth: true,
          formattedDate: formatDate(date)
        });
      }
      
      // Add days from next month
      const remainingDays = totalCalendarDays - days.length;
      for (let i = 1; i <= remainingDays; i++) {
        const date = new Date(currentYear, currentMonth + 1, i);
        days.push({
          date,
          day: i,
          isCurrentMonth: false,
          formattedDate: formatDate(date)
        });
      }
      
      setCalendarDays(days);
    } else if (viewMode === 'week') {
      // For week view, we get the current week days
      const day = currentDate.getDay();
      const diff = currentDate.getDate() - day + (day === 0 ? -6 : 1); // Adjust for starting week on Monday
      
      const weekStart = new Date(currentDate);
      weekStart.setDate(diff);
      
      const days = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(weekStart);
        date.setDate(weekStart.getDate() + i);
        days.push({
          date,
          day: date.getDate(),
          isCurrentMonth: date.getMonth() === currentMonth,
          formattedDate: formatDate(date)
        });
      }
      
      setCalendarDays(days);
    }
  }, [currentYear, currentMonth, currentDate, viewMode]);
  
  // Get jobs for each day and color code by status
  const getJobsForDay = (formattedDate) => {
    return jobs.filter(job => job.scheduledDate === formattedDate);
  };
  
  // Get color class based on job status
  const getStatusColorClass = (status) => {
    switch(status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Handle click on a day
  const handleDayClick = (day) => {
    setSelectedDay(day);
    const dayJobs = getJobsForDay(day.formattedDate);
    setSelectedDayJobs(dayJobs);
  };
  
  // Navigate to previous month/week
  const navigatePrevious = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(currentDate.getMonth() - 1);
    } else {
      newDate.setDate(currentDate.getDate() - 7);
    }
    setCurrentDate(newDate);
  };
  
  // Navigate to next month/week
  const navigateNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(currentDate.getMonth() + 1);
    } else {
      newDate.setDate(currentDate.getDate() + 7);
    }
    setCurrentDate(newDate);
  };
  
  // Navigate to today
  const navigateToday = () => {
    setCurrentDate(new Date());
  };
  
  // Toggle view mode
  const toggleViewMode = () => {
    setViewMode(viewMode === 'month' ? 'week' : 'month');
    setSelectedDay(null);
    setSelectedDayJobs([]);
  };
  
  // Get month name
  const getMonthName = (month) => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[month];
  };
  
  // Get day name
  const getDayName = (day) => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return dayNames[day];
  };
  
  // Format date range for week view
  const getWeekRangeText = () => {
    if (calendarDays.length === 0) return '';
    
    const firstDay = calendarDays[0];
    const lastDay = calendarDays[calendarDays.length - 1];
    
    return `${firstDay.day} ${getMonthName(firstDay.date.getMonth())} - ${lastDay.day} ${getMonthName(lastDay.date.getMonth())} ${lastDay.date.getFullYear()}`;
  };
  
  return (
    <div>
      {/* Calendar Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          {viewMode === 'month' 
            ? `${getMonthName(currentMonth)} ${currentYear}` 
            : getWeekRangeText()
          }
        </h2>
        <div className="flex space-x-2">
          <Button variant="secondary" onClick={navigatePrevious}>
            Previous {viewMode === 'month' ? 'Month' : 'Week'}
          </Button>
          <Button variant="secondary" onClick={navigateToday}>
            Today
          </Button>
          <Button variant="secondary" onClick={navigateNext}>
            Next {viewMode === 'month' ? 'Month' : 'Week'}
          </Button>
          <Button onClick={toggleViewMode}>
            {viewMode === 'month' ? 'Week View' : 'Month View'}
          </Button>
        </div>
      </div>
      
      {/* Calendar Grid */}
      <div className="bg-white rounded-lg border">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
            <div key={day} className="py-2 text-center font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar days */}
        <div className={`grid grid-cols-7 ${viewMode === 'week' ? 'grid-rows-1 auto-rows-fr' : ''}`}>
          {calendarDays.map((day, index) => {
            const dayJobs = getJobsForDay(day.formattedDate);
            const isToday = day.formattedDate === formatDate(new Date());
            const isSelected = selectedDay && day.formattedDate === selectedDay.formattedDate;
            
            return (
              <div 
                key={index}
                className={`${viewMode === 'week' ? 'min-h-[150px]' : 'min-h-[100px]'} p-2 border-b border-r relative ${
                  !day.isCurrentMonth ? 'bg-gray-50 text-gray-400' : 
                  isToday ? 'bg-blue-50' : 
                  isSelected ? 'bg-yellow-50' : ''
                }`}
                onClick={() => handleDayClick(day)}
              >
                <div className="flex justify-between">
                  <span className={`text-sm ${isToday ? 'bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center' : ''}`}>
                    {day.day}
                  </span>
                  {dayJobs.length > 0 && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-1 rounded">
                      {dayJobs.length}
                    </span>
                  )}
                </div>
                
                {/* Show max 2 jobs per day in month view, max 4 in week view */}
                <div className="mt-1 space-y-1">
                  {dayJobs.slice(0, viewMode === 'month' ? 2 : 4).map(job => (
                    <div 
                      key={job.id}
                      className={`text-xs p-1 rounded truncate cursor-pointer ${
                        getStatusColorClass(job.status)
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/jobs/${job.id}`);
                      }}
                    >
                      {job.type}
                    </div>
                  ))}
                  {viewMode === 'month' && dayJobs.length > 2 && (
                    <div className="text-xs text-gray-500 italic">
                      + {dayJobs.length - 2} more
                    </div>
                  )}
                  {viewMode === 'week' && dayJobs.length > 4 && (
                    <div className="text-xs text-gray-500 italic">
                      + {dayJobs.length - 4} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Selected Day Jobs */}
      {selectedDay && (
        <Card className="mt-6">
          <div className="p-4">
            <h3 className="text-lg font-medium mb-4">
              Jobs for {selectedDay.formattedDate}
            </h3>
            
            {selectedDayJobs.length === 0 ? (
              <p className="text-gray-500">No jobs scheduled for this day.</p>
            ) : (
              <div className="space-y-3">
                {selectedDayJobs.map(job => (
                  <div 
                    key={job.id}
                    className="p-3 border rounded hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/jobs/${job.id}`)}
                  >
                    <div className="flex justify-between">
                      <span className="font-medium">{job.type}</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        job.priority === 'High' ? 'bg-red-100 text-red-800' :
                        job.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {job.priority}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Status: <span className={`px-1 py-0.5 rounded ${getStatusColorClass(job.status)}`}>{job.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default JobCalendar; 