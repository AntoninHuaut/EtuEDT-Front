import "vue3-toastify/dist/index.css";

import type { ToastContainerOptions } from "vue3-toastify";

export default function toastifyOptions(): ToastContainerOptions {
    return {
        autoClose: 3000,
    };
}
