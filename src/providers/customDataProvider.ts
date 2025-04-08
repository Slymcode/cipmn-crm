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
): Promise<{ success: boolean; data?: any; error?: ResponseError }> => {
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

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    return {
      success: false,
      error: data || {
        message: "Something went wrong",
        statusCode: response.status,
      },
    };
  }

  return { success: true, data };
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
    const res = await fetchWrapper(`${url}?${queryStr}`, { method: "GET" });
    if (!res.success) throw res.error;

    return { data: res.data, total: res.data.length };
  },

  getOne: async <TData extends BaseRecord>({
    resource,
    id,
  }: any): Promise<GetOneResponse<TData>> => {
    const res = await fetchWrapper(`${API_URL}/${resource}/${id}`, {
      method: "GET",
    });
    if (!res.success) throw res.error;

    return { data: res.data };
  },

  create: async <TData extends BaseRecord>({
    resource,
    variables,
  }: any): Promise<CreateResponse<TData>> => {
    const res = await fetchWrapper(`${API_URL}/${resource}`, {
      method: "POST",
      body: JSON.stringify(variables),
    });
    if (!res.success) throw res.error;

    return { data: res.data };
  },

  update: async <TData extends BaseRecord>({
    resource,
    id,
    variables,
  }: any): Promise<UpdateResponse<TData>> => {
    const res = await fetchWrapper(`${API_URL}/${resource}/${id}`, {
      method: "PATCH",
      body: JSON.stringify(variables),
    });
    if (!res.success) throw res.error;

    return { data: res.data };
  },

  deleteOne: async <TData extends BaseRecord>({
    resource,
    id,
  }: any): Promise<DeleteOneResponse<TData>> => {
    const res = await fetchWrapper(`${API_URL}/${resource}/${id}`, {
      method: "DELETE",
    });
    if (!res.success) throw res.error;

    return { data: res.data };
  },

  getApiUrl: (): string => API_URL,

  getMany: async ({ resource, ids }) => {
    const results = await Promise.all(
      ids.map((id) =>
        fetchWrapper(`${API_URL}/${resource}/${id}`, { method: "GET" })
      )
    );

    const data = results.map((res) => {
      if (!res.success) throw res.error;
      return res.data;
    });

    return { data };
  },

  createMany: async ({ resource, variables }) => {
    const results = await Promise.all(
      variables.map((variable) =>
        fetchWrapper(`${API_URL}/${resource}`, {
          method: "POST",
          body: JSON.stringify(variable),
        })
      )
    );

    const data = results.map((res) => {
      if (!res.success) throw res.error;
      return res.data;
    });

    return { data };
  },

  deleteMany: async ({ resource, ids }) => {
    const results = await Promise.all(
      ids.map((id) =>
        fetchWrapper(`${API_URL}/${resource}/${id}`, { method: "DELETE" })
      )
    );

    const data = results.map((res) => {
      if (!res.success) throw res.error;
      return res.data;
    });

    return { data };
  },

  updateMany: async ({ resource, ids, variables }) => {
    const results = await Promise.all(
      ids.map((id) =>
        fetchWrapper(`${API_URL}/${resource}/${id}`, {
          method: "PUT",
          body: JSON.stringify(variables),
        })
      )
    );

    const data = results.map((res) => {
      if (!res.success) throw res.error;
      return res.data;
    });

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

    const res = await fetchWrapper(requestUrl, {
      method,
      headers,
      body: JSON.stringify(payload),
    });
    if (!res.success) throw res.error;

    return { data: res.data };
  },
};
