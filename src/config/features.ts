import { getFeatureAvailability, parseFeaturePolicy } from "./featurePolicy";

const policy = parseFeaturePolicy(import.meta.env);
export const unavailableFeatureMessage =
	"Cette fonctionnalité est temporairement indisponible.";

export function featuresForUniversity(universityId: number | undefined) {
	return getFeatureAvailability(policy, universityId);
}
