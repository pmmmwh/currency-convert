import ky from 'ky';
import type { Options } from 'ky';

async function fetcher<ResponseType>(
  url: string,
  { method = 'get', ...restOptions }: Options = {}
): Promise<ResponseType> | never {
  try {
    return await ky(url, {
      prefixUrl: process.env.API_DOMAIN,
      method,
      ...restOptions,
    }).json<ResponseType>();
  } catch (error) {
    let errorData = error;
    // When we hit an HTTPError (i.e. 4xx/5xx error codes),
    // we will want the inner response data instead of the full error object,
    // as it contains useful message and status code.
    if (error instanceof ky.HTTPError) {
      errorData = error.response;
    }

    // We re-throw the error to signal `react-query` to bail out
    throw errorData;
  }
}

export default fetcher;
