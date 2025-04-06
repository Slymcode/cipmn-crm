import {
  DataProvider,
  BaseRecord,
  GetListResponse,
  GetOneResponse,
  CreateResponse,
  UpdateResponse,
  DeleteOneResponse,
  CustomResponse,
} from "@refinedev/core";
import queryString from "query-string";

interface APIResponseFormattedError {
  message: string;
  extensions: {
    code: number;
  };
}

type ResponseError = {
  message: string;
  statusCode: string | number;
};

const getAccessToken = (): string | null =>
  localStorage.getItem("access_token");

const getAPIResponseErrors = (
  body: Record<"errors", APIResponseFormattedError[] | undefined>
): ResponseError | null => {
  if (!body || !("errors" in body)) {
    return {
      message: "Unknown error",
      statusCode: "INTERNAL_SERVER_ERROR",
    };
  }
  const errors = body?.errors as APIResponseFormattedError[];
  if (!errors?.length) return null;

  return {
    message:
      errors.map((err) => err.message).join(" ") || JSON.stringify(errors),
    statusCode: errors[0]?.extensions?.code || 500,
  };
};

const fetchWrapper = async (
  url: string,
  options: RequestInit
): Promise<Response> => {
  const accessToken = getAccessToken();
  const headers = options.headers as Record<string, string>;
  const response = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      Authorization: headers?.Authorization || `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  const clonedResponse = response.clone();

  try {
    const body = await clonedResponse.json();
    if (body?.errors) {
      throw {
        message: body.errors
          .map((err: APIResponseFormattedError) => err.message)
          .join(" "),
        statusCode: body.errors[0]?.extensions?.code || 500,
      } as ResponseError;
    }
  } catch (error) {
    console.log(error);
    // Ignore JSON parse errors for non-JSON responses
  }

  return response;
};

const API_URL = import.meta.env.VITE_API_URL;

export const customDataProvider: DataProvider = {
  getList: async <TData extends BaseRecord>({
    resource,
    pagination,
    sorters,
    filters,
  }: any): Promise<GetListResponse<TData>> => {
    const url = `${API_URL}/${resource}`;
    const { current = 1, pageSize = 10 } = pagination || {};
    const { field, order } = sorters?.[0] || {};

    const query: Record<string, string | number | undefined> = {
      _page: current,
      _limit: pageSize,
      _sort: field,
      _order: order,
    };

    filters?.forEach((filter: any) => {
      query[`${filter.field}_${filter.operator}`] = filter.value as string;
    });

    const queryStr = queryString.stringify(query);
    const data = await fetchWrapper(`${url}?${queryStr}`, {
      method: "GET",
    }).then((res) => res.json());

    return { data, total: data.length };
  },

  getOne: async <TData extends BaseRecord>({
    resource,
    id,
  }: any): Promise<GetOneResponse<TData>> => {
    const url = `${API_URL}/${resource}/${id}`;
    const data = await fetchWrapper(url, { method: "GET" }).then((res) =>
      res.json()
    );
    return data;
  },

  create: async <TData extends BaseRecord>({
    resource,
    variables,
  }: any): Promise<CreateResponse<TData>> => {
    const url = `${API_URL}/${resource}`;
    const data = await fetchWrapper(url, {
      method: "POST",
      body: JSON.stringify(variables),
    }).then((res) => res.json());
    return data;
  },

  update: async <TData extends BaseRecord>({
    resource,
    id,
    variables,
  }: any): Promise<UpdateResponse<TData>> => {
    const url = `${API_URL}/${resource}/${id}`;
    const data = await fetchWrapper(url, {
      method: "PATCH",
      body: JSON.stringify(variables),
    }).then((res) => res.json());
    return data;
  },

  deleteOne: async <TData extends BaseRecord>({
    resource,
    id,
  }: any): Promise<DeleteOneResponse<TData>> => {
    const url = `${API_URL}/${resource}/${id}`;
    const { data } = await fetchWrapper(url, { method: "DELETE" }).then((res) =>
      res.json()
    );
    return { data };
  },

  getApiUrl: (): string => API_URL,

  getMany: async ({ resource, ids }) => {
    const data = await Promise.all(
      ids.map((id) =>
        fetchWrapper(`${API_URL}/${resource}/${id}`, { method: "GET" }).then(
          (res) => res.json()
        )
      )
    );
    return { data };
  },

  createMany: async ({ resource, variables }) => {
    const data = await Promise.all(
      variables.map((variable) =>
        fetchWrapper(`${API_URL}/${resource}`, {
          method: "POST",
          body: JSON.stringify(variable),
        }).then((res) => res.json())
      )
    );
    return { data };
  },

  deleteMany: async ({ resource, ids }) => {
    const data = await Promise.all(
      ids.map((id) =>
        fetchWrapper(`${API_URL}/${resource}/${id}`, { method: "DELETE" }).then(
          (res) => res.json()
        )
      )
    );
    return { data };
  },

  updateMany: async ({ resource, ids, variables }) => {
    const data = await Promise.all(
      ids.map((id) =>
        fetchWrapper(`${API_URL}/${resource}/${id}`, {
          method: "PUT",
          body: JSON.stringify(variables),
        }).then((res) => res.json())
      )
    );
    return { data };
  },

  custom: async <TData>({
    url,
    method,
    filters,
    sorters,
    payload,
    query,
    headers,
  }: any): Promise<CustomResponse<TData>> => {
    let requestUrl = `${API_URL}/${url}`;
    if (query) {
      requestUrl = `${requestUrl}?${queryString.stringify(query)}`;
    }
    const { data } = await fetchWrapper(requestUrl, {
      method,
      headers,
      body: JSON.stringify(payload),
    }).then((res) => res.json());
    return { data };
  },
};
