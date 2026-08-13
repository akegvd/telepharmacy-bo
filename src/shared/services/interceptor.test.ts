import { AxiosError } from "axios";
import axios from "axios";

import setupInterceptorsTo, { ApiError } from "@/shared/services/interceptor";

const createMockResponse = (status: number, data: unknown) => ({
  data,
  status,
  statusText: "OK",
  headers: {},
  config: {} as never,
});

describe("interceptor", () => {
  test("passes successful responses through unchanged", async () => {
    const adapter = () => Promise.resolve(createMockResponse(200, { ok: true }));

    const instance = setupInterceptorsTo(axios.create({ baseURL: "https://api.test", adapter }));

    const response = await instance.get("/test");

    expect(response.data).toEqual({ ok: true });
  });

  test("rejects with Error('Request canceled') when the request is canceled", async () => {
    const adapter = () => Promise.reject(new AxiosError("Canceled", "ERR_CANCELED"));

    const instance = setupInterceptorsTo(axios.create({ baseURL: "https://api.test", adapter }));

    await expect(instance.get("/test")).rejects.toEqual(new Error("Request canceled"));
  });

  test("rejects with ApiError (no status) when there is no response", async () => {
    const adapter = () => Promise.reject(new AxiosError("Network Error"));

    const instance = setupInterceptorsTo(axios.create({ baseURL: "https://api.test", adapter }));

    await expect(instance.get("/test")).rejects.toMatchObject({
      name: "ApiError",
      status: undefined,
    });
  });

  test("rejects with ApiError carrying the response status for HTTP failures", async () => {
    const adapter = () =>
      Promise.reject(
        new AxiosError(
          "Not Found",
          undefined,
          undefined,
          undefined,
          createMockResponse(404, { message: "not found" }) as never,
        ),
      );

    const instance = setupInterceptorsTo(axios.create({ baseURL: "https://api.test", adapter }));

    await expect(instance.get("/test")).rejects.toMatchObject({
      name: "ApiError",
      status: 404,
    });
  });

  test("rejected errors are instances of ApiError", async () => {
    const adapter = () =>
      Promise.reject(
        new AxiosError(
          "Server Error",
          undefined,
          undefined,
          undefined,
          createMockResponse(500, undefined) as never,
        ),
      );

    const instance = setupInterceptorsTo(axios.create({ baseURL: "https://api.test", adapter }));

    await expect(instance.get("/test")).rejects.toBeInstanceOf(ApiError);
  });
});
