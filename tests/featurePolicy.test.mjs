import assert from "node:assert/strict";
import test from "node:test";
import {
	getFeatureAvailability,
	parseFeaturePolicy,
} from "../src/config/featurePolicy.ts";

const all = (enabled) => ({
	canCopyLink: enabled,
	canSyncCalendar: enabled,
	canFindFreeRooms: enabled,
});
test("defaults preserve actions for selected universities", () => {
	const policy = parseFeaturePolicy({});
	assert.deepEqual(getFeatureAvailability(policy, 1), all(true));
	assert.deepEqual(getFeatureAvailability(policy, undefined), all(false));
});
test("restrictions are scoped and reversible", () => {
	const env = {
		VITE_OPTIONAL_FEATURES_ENABLED: "false",
		VITE_FEATURE_UNIVERSITY_IDS: "1, 3",
	};
	const policy = parseFeaturePolicy(env);
	assert.deepEqual(getFeatureAvailability(policy, 1), all(false));
	assert.deepEqual(getFeatureAvailability(policy, "1"), all(false));
	assert.deepEqual(getFeatureAvailability(policy, 3), all(false));
	assert.deepEqual(getFeatureAvailability(policy, 2), all(true));
	assert.deepEqual(
		getFeatureAvailability(
			parseFeaturePolicy({ ...env, VITE_OPTIONAL_FEATURES_ENABLED: "true" }),
			1,
		),
		all(true),
	);
	assert.deepEqual(
		getFeatureAvailability(
			parseFeaturePolicy({ VITE_OPTIONAL_FEATURES_ENABLED: "false" }),
			1,
		),
		all(true),
	);
});
test("invalid deployment settings fail explicitly", () => {
	assert.throws(() =>
		parseFeaturePolicy({ VITE_OPTIONAL_FEATURES_ENABLED: "yes" }),
	);
	for (const ids of ["0", "-1", "1,", "x", "1.5", "9007199254740992"]) {
		assert.throws(() =>
			parseFeaturePolicy({ VITE_FEATURE_UNIVERSITY_IDS: ids }),
		);
	}
});
