import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSocket } from './useSocket';
import { 
  fetchAssignedWorks,
  fetchUnassignedWorks,
  selectSelectedDate 
} from '@/store/slices/workSlice';

export const useWorkSocket = () => {
  const dispatch = useDispatch();
  const selectedDate = useSelector(selectSelectedDate);

  // Listen for table updates
  const { emit: emitTableUpdate } = useSocket('UpdateTable_To_Client', (data) => {
    if (data.date === selectedDate) {
      // Always fetch fresh data when receiving updates
      dispatch(fetchAssignedWorks(selectedDate));
      dispatch(fetchUnassignedWorks(selectedDate));
    }
  });

  // Listen for work assignment updates
  const { emit: emitWorkAssignment } = useSocket('Update_Status_To_Client', (data) => {
    if (data.date === selectedDate) {
      dispatch(fetchAssignedWorks(selectedDate));
    }
  });

  // Listen for work deletion
  const { emit: emitWorkDelete } = useSocket('deleteWorkTo_Client', (data) => {
    if (data.date === selectedDate) {
      dispatch(fetchUnassignedWorks(selectedDate));
    }
  });

  // Listen for assigned work deletion
  const { emit: emitAssignedWorkDelete } = useSocket('deleteWorkAssignTo_Client', (data) => {
    if (data.date === selectedDate) {
      dispatch(fetchAssignedWorks(selectedDate));
    }
  });

  return {
    emitTableUpdate,
    emitWorkAssignment,
    emitWorkDelete,
    emitAssignedWorkDelete
  };
}; 