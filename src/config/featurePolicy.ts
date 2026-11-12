export interface FeaturePolicy {
	enabled: boolean;
	universityIds: ReadonlySet<number>;
}

export function parseFeaturePolicy(
	env: Record<string, string | undefined>,
): FeaturePolicy {
	const enabled = env.VITE_OPTIONAL_FEATURES_ENABLED ?? "true";
	if (enabled !== "true" && enabled !== "false") {
		throw new Error("VITE_OPTIONAL_FEATURES_ENABLED must be true or false");
	}
	const ids = (env.VITE_FEATURE_UNIVERSITY_IDS ?? "").trim();
	const universityIds = new Set<number>();
	for (const part of ids ? ids.split(",") : []) {
		const value = part.trim();
		const id = Number(value);
		if (!/^\d+$/.test(value) || !Number.isSafeInteger(id) || id <= 0) {
			throw new Error(
				"VITE_FEATURE_UNIVERSITY_IDS must contain positive integer IDs",
			);
		}
		universityIds.add(id);
	}
	return { enabled: enabled === "true", universityIds };
}

export function getFeatureAvailability(
	policy: FeaturePolicy,
	universityId: number | undefined,
) {
	// Persisted selections may be restored as strings by local storage.
	const id = Number(universityId);
	const available =
		Number.isSafeInteger(id) &&
		id > 0 &&
		(policy.enabled || !policy.universityIds.has(id));
	return {
		canCopyLink: available,
		canSyncCalendar: available,
		canFindFreeRooms: available,
	};
}
