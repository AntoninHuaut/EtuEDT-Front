import { errorNoDataFetchNotif, genericError } from "@/utils/notification";
import { watch } from "vue";

interface IQueryNotificationsParams<TData> {
    contextName: string;
    getError: () => Error | null | undefined;
    getIsSuccess: () => boolean;
    getData: () => TData | undefined;
}

export function useQueryNotifications<TData>(params: IQueryNotificationsParams<TData>) {
    watch(
        () => params.getError(),
        (error) => {
            if (!error) return;
            console.error(`Failed to get ${params.contextName}, got`, error);
            genericError(error.message);
        },
    );

    watch(
        () => params.getIsSuccess(),
        (isSuccess) => {
            if (isSuccess && !params.getData()) {
                errorNoDataFetchNotif();
            }
        },
    );
}