import { toast, type ToastPosition, type ToastType } from "vue3-toastify";

interface NotifParams {
    autoClose?: number;
    message: string;
    position?: ToastPosition;
    width?: number;
}

export function errorNoDataFetchNotif(): number {
    return errorNotif({
        message: "Aucune donnée reçue dans la réponse du serveur",
    });
}

export function genericError(errorMsg: string): number {
    return errorNotif({ message: `Une erreur est survenue : ${errorMsg}` });
}

export function errorNotif(params: NotifParams): number {
    const autoCloseDefault = 5000;
    return genericNotif({
        ...params,
        autoClose: params.autoClose ?? autoCloseDefault,
        type: "error",
    });
}

export function infoNotif(params: NotifParams): number {
    return genericNotif({
        ...params,
        type: "info",
    });
}

export function successNotif(params: NotifParams): number {
    return genericNotif({
        ...params,
        type: "success",
    });
}

export function genericNotif({
    autoClose = 3000,
    message,
    position = "top-center",
    type,
    width = 450,
}: NotifParams & {
    autoClose?: number;
    position?: ToastPosition;
    type: ToastType;
    width?: string | number;
}): number {
    width = Math.min(width, document.documentElement.clientWidth);
    toast(message, {
        type,
        autoClose,
        position,
        toastStyle: {
            width: `${width}px`,
        },
    });
    return autoClose;
}
