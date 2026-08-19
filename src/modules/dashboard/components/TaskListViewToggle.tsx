'use client';

import TableRowsOutlinedIcon from '@mui/icons-material/TableRowsOutlined';
import ViewAgendaOutlinedIcon from '@mui/icons-material/ViewAgendaOutlined';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useCallback } from 'react';

import { TTaskListViewMode } from '../types/taskListViewMode';

interface ITaskListViewToggleProps {
  value: TTaskListViewMode;
  onChange: (viewMode: TTaskListViewMode) => void;
}

const TaskListViewToggle = ({ value, onChange }: ITaskListViewToggleProps) => {
  const handleChange = useCallback(
    (_event: React.MouseEvent<HTMLElement>, next: TTaskListViewMode | null) => {
      if (next) {
        onChange(next);
      }
    },
    [onChange]
  );

  return (
    <ToggleButtonGroup size="small" exclusive value={value} aria-label="Task list view" onChange={handleChange}>
      <ToggleButton value="table" aria-label="Table view">
        <TableRowsOutlinedIcon fontSize="small" />
      </ToggleButton>
      <ToggleButton value="grid" aria-label="Card view">
        <ViewAgendaOutlinedIcon fontSize="small" />
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default TaskListViewToggle;
