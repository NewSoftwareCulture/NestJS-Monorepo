import { AxiosError } from 'axios';
import {
  catchError,
  delay,
  mergeMap,
  retryWhen,
  throwError,
  timer,
} from 'rxjs';

type Options = {
  logger: any;
  message?: string;
  timeout?: number;
  tries?: number;
};

export const httpServiceErrorPipe = ({
  logger,
  message = 'Error:',
  timeout = 5000,
  tries = 5,
}: Options): [any, any] => [
  catchError((error: AxiosError) => {
    throw `${message} (${error.message})`;
  }),
  retryWhen((errors) =>
    errors.pipe(
      delay(timeout),
      mergeMap((error, i) => {
        const retryAttempt = i + 1;

        if (retryAttempt > tries) {
          logger.error(`[HTTP ERROR] ${error}`);
          return throwError(error);
        }
        logger.warn(`${error} (tries ${i}/${tries})`);
        return timer(i);
      }),
    ),
  ),
];
