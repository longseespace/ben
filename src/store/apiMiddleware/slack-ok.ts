const SLACK_API_ROOT = 'https://slack.com/api/';

const slackOK = (next: any) => async (req: any) => {
  // check if response is from slack api
  if (req.endpoint && req.endpoint.indexOf(SLACK_API_ROOT) === 0) {
    try {
      const { payload, ...others } = await next(req);

      // payload should be a json
      if (!payload.ok) {
        throw { payload, ...others };
      }
      return { payload, ...others };
    } catch (resp) {
      throw resp;
    }
  }

  return next(req);
};

export default slackOK;
