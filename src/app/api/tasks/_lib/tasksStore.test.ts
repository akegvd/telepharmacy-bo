import type * as TasksStore from './tasksStore';

describe('tasksStore', () => {
  const loadStore = (): typeof TasksStore => {
    let store: typeof TasksStore | undefined;
    jest.isolateModules(() => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      store = require('./tasksStore');
    });
    return store as typeof TasksStore;
  };

  it('lists tasks straight from db.json, duplicates included', () => {
    const { listTasks } = loadStore();

    const ids = listTasks().map((task) => task.id);
    expect(ids.filter((id) => id === '1')).toHaveLength(2);
  });

  it('finds the first occurrence of a duplicated id', () => {
    const { findTask } = loadStore();

    expect(findTask('1')?.symptom).toBe('Persistent dry cough for 5 days');
  });

  it('returns undefined for an unknown id', () => {
    const { findTask } = loadStore();

    expect(findTask('does-not-exist')).toBeUndefined();
  });

  it('patches the matching task and returns the updated record', () => {
    const { patchTask, findTask } = loadStore();

    const updated = patchTask('4', { status: 'in_progress' });

    expect(updated?.status).toBe('in_progress');
    expect(findTask('4')?.status).toBe('in_progress');
  });

  it('does not let a patch body override the id', () => {
    const { patchTask } = loadStore();

    const updated = patchTask('4', { id: 'hijacked', status: 'completed' });

    expect(updated?.id).toBe('4');
  });

  it('returns undefined when patching an unknown id', () => {
    const { patchTask } = loadStore();

    expect(patchTask('does-not-exist', { status: 'completed' })).toBeUndefined();
  });
});
