const tasksBaseApiUrl = '/tasks';

const tasksApiEndpoints = Object.freeze({
  list: tasksBaseApiUrl,
  detail: (id: string) => `${tasksBaseApiUrl}/${id}`,
  reset: `${tasksBaseApiUrl}/reset`,
});

export default tasksApiEndpoints;
