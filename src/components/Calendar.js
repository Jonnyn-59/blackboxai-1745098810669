import React from 'react';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, format, isSameMonth, isSameDay } from 'date-fns';

function Calendar({ shifts, onDayClick, onEditShift, onDeleteShift }) {
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const dateFormat = "d";
  const rows = [];
  let days = [];
  let day = startDate;
  let formattedDate = '';

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const dayKey = day.toISOString().split('T')[0];
      const dayShifts = shifts[dayKey] || [];
      formattedDate = format(day, dateFormat);
      days.push(
        <div
          key={day}
          className={`border border-gray-300 p-3 h-32 flex flex-col cursor-pointer rounded-lg shadow-sm transition duration-300 ease-in-out hover:shadow-lg ${!isSameMonth(day, monthStart) ? 'bg-gray-100 text-gray-400' : 'bg-white'} ${isSameDay(day, today) ? 'ring-2 ring-indigo-400' : ''}`}
          onClick={() => onDayClick(day)}
        >
          <div className="text-sm font-semibold mb-2 text-indigo-700">{formattedDate}</div>
          <div className="flex-1 overflow-auto space-y-1">
            {dayShifts.map(shift => (
              <div
                key={shift.id}
                className="mb-1 rounded px-2 py-1 text-xs text-white flex justify-between items-center shadow-md transition-colors duration-300"
                style={{ backgroundColor: shift.color || '#6366f1' }}
                onClick={e => {
                  e.stopPropagation();
                  onEditShift(day, shift);
                }}
              >
                <span className="truncate max-w-[70%]" title={shift.title}>{shift.title}</span>
                <button
                  className="ml-2 text-white hover:text-gray-200"
                  onClick={e => {
                    e.stopPropagation();
                    onDeleteShift(day, shift.id);
                  }}
                  aria-label="Delete shift"
                >
                  <i className="fas fa-trash-alt"></i>
                </button>
              </div>
            ))}
          </div>
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div className="grid grid-cols-7 gap-2 mb-2" key={day}>
        {days}
      </div>
    );
    days = [];
  }

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div>
      <div className="grid grid-cols-7 gap-2 mb-4 max-w-4xl mx-auto">
        {daysOfWeek.map(day => (
          <div key={day} className="text-center font-semibold text-indigo-700">{day}</div>
        ))}
      </div>
      {rows}
    </div>
  );
}

export default Calendar;
