import { watch } from "vue";
import { isApiError } from "@/utils/apiError";
import { errorNoDataFetchNotif, genericError } from "@/utils/notification";

function getApiErrorMessage(error: Error): string {
	if (!isApiError(error)) {
		return error.message;
	}

	switch (error.status) {
		case 404:
			return "Ressource introuvable";
		case 429:
			return "Trop de requetes, veuillez patienter";
		default:
			if (error.status >= 500) {
				return "Le serveur rencontre actuellement un probleme";
			}

			return error.message;
	}
}

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
			if (isApiError(error)) {
				console.error(
					`Failed to get ${params.contextName}, status=${error.status}, url=${error.url}`,
					error.payload,
				);
			} else {
				console.error(`Failed to get ${params.contextName}, got`, error);
			}

			genericError(getApiErrorMessage(error));
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
