import { DEFAULT_TASK_LIST_VIEW_MODE, getTaskListViewMode, setTaskListViewMode } from './taskListViewMode';

describe('taskListViewMode utils', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('returns the default view mode when nothing is stored', () => {
    expect(getTaskListViewMode()).toBe(DEFAULT_TASK_LIST_VIEW_MODE);
  });

  it('returns the stored view mode', () => {
    setTaskListViewMode('grid');

    expect(getTaskListViewMode()).toBe('grid');
  });

  it('falls back to the default when the stored value is not a valid view mode', () => {
    window.localStorage.setItem('dashboard:taskListViewMode', JSON.stringify('cards'));

    expect(getTaskListViewMode()).toBe(DEFAULT_TASK_LIST_VIEW_MODE);
  });
});
