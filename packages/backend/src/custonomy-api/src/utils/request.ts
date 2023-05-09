import { generate } from "hmac-auth-express";
import fetch from "node-fetch";
import { v4 as uuid } from "uuid";
import { joinPath } from "./util";
import { Object, Request } from "./typedef";
import { ACTION } from "./const";

// Full Custody Model
export const hmacCallApi = async (
  apiKey: string,
  apiSecret: string,
  request: Request
): Promise<any> => {
  const requestId: string = uuid();
  const endpoint: string = request.endpoint;
  const path: string = joinPath(request.path, { ...request.query, requestId });
  const time: string = Date.now().toString();
  const body: Object | undefined =
    request.method == ACTION.GET || request.body ? request.body : {};

  const digest: string = generate(
    apiSecret,
    "sha512",
    time,
    request.method,
    path,
    body as any
  ).digest("hex");
  const hmac: string = `HMAC ${time}:${digest}`;

  //   console.log({ apiSecret, time, method: request.method, path, body });

  const option: Object = {};
  Object.assign(option, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "api-key": apiKey,
      Authorization: hmac,
    },
  });

  if (body) Object.assign(option, { body: JSON.stringify(body) });

  Object.assign(option, { method: request.method });

  return fetch(`${endpoint}${path}`, option)
    .then((response: any) => {
      return response
        .json()
        .then((res: any) => {
          if (response.status == 200) return res;
          throw res;
        })
        .catch((ex: Error) => {
          throw ex;
        });
    })
    .catch((ex: Error) => {
      throw ex;
    });
};
