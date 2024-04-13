export const DEAD_LETTER_POSTFIX = 'dead-letter';

export const getOptions = ({
  user,
  password,
  host,
  queue,
  noAck = false,
  prefetchCount = 1,
}) => ({
  urls: [`amqp://${user}:${password}@${host}`],
  queue,
  noAck,
  prefetchCount,
  queueOptions: {
    durable: true,
    deadLetterExchange: '',
    deadLetterRoutingKey: `${queue}.${DEAD_LETTER_POSTFIX}`,
    maxPriority: 10,
  },
  persistent: true,
});
