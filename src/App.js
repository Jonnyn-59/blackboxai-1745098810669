import React, { useState } from 'react';
import Calendar from './components/Calendar';
import ShiftForm from './components/ShiftForm';

function App() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [shifts, setShifts] = useState({});
  const [editingShift, setEditingShift] = useState(null);

  const openShiftForm = (date, shift = null) => {
    setSelectedDate(date);
    setEditingShift(shift);
  };

  const closeShiftForm = () => {
    setSelectedDate(null);
    setEditingShift(null);
  };

  const saveShift = (date, shift) => {
    setShifts(prev => {
      const dateKey = date.toISOString().split('T')[0];
      const dayShifts = prev[dateKey] ? [...prev[dateKey]] : [];
      if (shift.id) {
        // Edit existing shift
        const index = dayShifts.findIndex(s => s.id === shift.id);
        if (index !== -1) {
          dayShifts[index] = shift;
        } else {
          dayShifts.push(shift);
        }
      } else {
        // Add new shift with id
        shift.id = Date.now();
        dayShifts.push(shift);
      }
      return { ...prev, [dateKey]: dayShifts };
    });
    closeShiftForm();
  };

  const deleteShift = (date, shiftId) => {
    setShifts(prev => {
      const dateKey = date.toISOString().split('T')[0];
      const dayShifts = prev[dateKey] ? prev[dateKey].filter(s => s.id !== shiftId) : [];
      return { ...prev, [dateKey]: dayShifts };
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 font-poppins">
      <header className="max-w-4xl mx-auto mb-8">
        <h1 className="text-4xl font-extrabold text-center text-indigo-700 drop-shadow-md">Work Shift Calendar</h1>
      </header>
      <main className="max-w-4xl mx-auto">
        <Calendar shifts={shifts} onDayClick={openShiftForm} onEditShift={openShiftForm} onDeleteShift={deleteShift} />
        {selectedDate && (
          <ShiftForm
            date={selectedDate}
            shift={editingShift}
            onSave={saveShift}
            onCancel={closeShiftForm}
          />
        )}
      </main>
    </div>
  );
}

export default App;
