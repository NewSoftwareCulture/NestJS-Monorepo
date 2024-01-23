type Req = {
  url: string;
  method: string;
};

type Options = {
  name: string;
  host: string;
  req: Req;
};

export const healthcheck = (options: Options) => {
  const { name, host, req } = options;
  return {
    name,
    host,
    res: {
      status: 'ok',
      code: 200,
    },
    req,
    time: Date.now(),
    date: new Date().toISOString(),
  };
};
