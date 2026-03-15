import { onUnmounted, type Ref, ref, watch } from "vue";

export function useDebounce<T>(source: Ref<T>, delay = 250) {
	const debounced = ref(source.value) as Ref<T>;
	const isDebouncing = ref(false);
	let timer: ReturnType<typeof setTimeout> | null = null;

	const start = (val: T) => {
		if (timer) {
			clearTimeout(timer);
		} else {
			isDebouncing.value = true;
		}
		timer = setTimeout(() => {
			debounced.value = val;
			isDebouncing.value = false;
			timer = null;
		}, delay);
	};

	watch(source, (val) => start(val));

	onUnmounted(() => {
		if (timer) {
			clearTimeout(timer);
			timer = null;
		}
		isDebouncing.value = false;
	});

	return {
		debounced,
		isDebouncing,
		cancel: () => {
			if (timer) {
				clearTimeout(timer);
				timer = null;
				isDebouncing.value = false;
			}
		},
	};
}

export default useDebounce;
