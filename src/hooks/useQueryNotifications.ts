import { watch } from "vue";
import { isApiError } from "@/utils/apiError";
import { errorNoDataFetchNotif, genericError } from "@/utils/notification";

interface IQueryNotificationsParams<TData> {
	contextName: string;
	getError: () => Error | null | undefined;
	getIsSuccess: () => boolean;
	getData: () => TData | undefined;
}

export function useQueryNotifications<TData>(
	params: IQueryNotificationsParams<TData>,
) {
	watch(
		() => params.getError(),
		(error) => {
			if (!error) return;
			console.error(`Failed to get ${params.contextName}, got`, error);

			if (isApiError(error)) {
				genericError(error.message);
				return;
			}

			genericError(error.message);
		},
	);

	watch(
		() => params.getIsSuccess(),
		(isSuccess) => {
			if (!isSuccess) return;
			const data = params.getData();
			if (!data) {
				errorNoDataFetchNotif();
			}
		},
	);
}
