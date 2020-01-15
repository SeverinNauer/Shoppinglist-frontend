import LocalStorageUtiltites from "../utils/LocalStorageUtilities";
import download from "downloadjs";

const baseUrl = "https://localhost:44370/";

export interface IErrorResult {
  code: number;
  message: string;
}

export type SuccessResult<TR> = TR | string;

type Result<TR> = SuccessResult<TR> | IErrorResult;

const getDataFromResponse = async (response: Response) => {
  let resString = await response.text();
  try {
    return JSON.parse(resString);
  } catch {
    return resString;
  }
};

const fetchMeth = async <TR>(request: Request): Promise<Result<TR>> => {
  try {
    const response = await fetch(request);
    if (response.ok && response.status >= 200 && response.status < 300) {
      return await getDataFromResponse(response);
    } else {
      const data = await getDataFromResponse(response);
      if (typeof data === "string") {
        return { code: response.status, message: data };
      }
      return { code: response.status, message: data.title };
    }
  } catch (ex) {
    return { code: 0, message: ex.message };
  }
};

const getHeaders: any = (authenticated: boolean) => {
  return authenticated
    ? {
        "Content-Type": "application/json",
        Authorization: LocalStorageUtiltites.jwtToken
      }
    : {
        "Content-Type": "application/json"
      };
};

export const post = async <T, TR>(
  endpoint: string,
  data: T,
  authenticated: boolean = false
) => {
  let request = new Request(`${baseUrl}${endpoint}`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: getHeaders(authenticated)
  });
  return await fetchMeth<TR>(request);
};
export const get = async <TR>(
  endpoint: string,
  authenticated: boolean = false
) => {
  let request = new Request(`${baseUrl}${endpoint}`, {
    method: "Get",
    headers: getHeaders(authenticated)
  });
  return await fetchMeth<TR>(request);
};

export const getFile = async (endpoint: string, fileName: string) => {
  let request = new Request(`${baseUrl}${endpoint}`, {
    method: "Get",
    headers: getHeaders(true)
  });
  let result = await fetch(request);
  if (result.ok && result.status >= 200 && result.status < 300) {
    let blob = await result.blob();
    download(blob, fileName, "application/octet-stream");
  }
};

export const put = async <T, TR>(
  endpoint: string,
  data: T,
  authenticated: boolean = false
) => {
  let request = new Request(`${baseUrl}${endpoint}`, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: getHeaders(authenticated)
  });
  return await fetchMeth<TR>(request);
};

export const isSuccess = <T extends unknown>(
  response: Result<T>
): response is SuccessResult<T> => {
  if ((response as IErrorResult).code) {
    return false;
  }
  return true;
};
