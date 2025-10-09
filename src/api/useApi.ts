import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from "@tanstack/react-query";
import { getMessageError } from "@/lib/helpers";
import { api } from "./apiMethods";

type ApiRequest = {
    link: string;
    data?: any;
    config?: any;
    select?: (data: any) => any;
}

type ApiRequestQuery = ApiRequest & {
    method?: "get" | "post";
    enabled?: boolean;
}
type ApiRequestMutation = ApiRequest & {
    method?: "post" | "put" | "delete";
}

export const useApiQuery = <IData = any>(
    key: any[],
    request: ApiRequestQuery,
    options?: Omit<UseQueryOptions<IData, Error>, "queryKey" | "queryFn">
) => {
    return useQuery<IData, Error>({
        queryKey: key,
        queryFn: async () => {
            const { link, data, method = "get", config, select } = request;

            const res =
                method === "get"
                    ? await api.get({ link, config })
                    : await api.post({ link, data, config });
            const result = res?.data ?? res;
            return select ? select(result) : result;
        },
        enabled: request.enabled ?? true,
        retry: false,
        ...options,
    });
};

export const useApiMutation = <IData = any, TVariables = any>(
    request: ApiRequestMutation,
    options?: UseMutationOptions<IData, Error, TVariables>
) => {
    const queryClient = useQueryClient();

    return useMutation<IData, Error, TVariables>({
        mutationFn: async (variables: TVariables) => {
            const { link, method = "post", config, select } = request;
            const payload = variables;

            const res =
                method === "post"
                    ? await api.post({ link, data: payload, config })
                    : method === "put"
                        ? await api.put({ link, data: payload, config })
                        : await api.delete({ link, config });
            const result = res?.data ?? res;
            return select ? select(result) : result;
        },
        onError: (error: any) => {
            console.error("Mutation error:", getMessageError(error));
        },
        ...options,
    });
};
