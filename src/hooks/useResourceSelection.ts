import { useAppStore } from "@/store";
import { buildTimetableRouteParams, createTimetableContext } from "@/utils/timetableContext";
import { useRouter } from "vue-router";

type ResourceType = "timetable" | "room";

export const useResourceSelection = () => {
    const appStore = useAppStore();
    const router = useRouter();

    async function navigateToResource(resourceType: ResourceType, adeResources: number) {
        const context = createTimetableContext({
            numUniv: appStore.numUniv,
            groupId: appStore.groupId,
            adeResources,
            resourceType,
        });

        if (!context) {
            await router.push({ name: "Home" });
            return;
        }

        await router.push({
            name: "Timetable",
            params: buildTimetableRouteParams(context),
        });
    }

    async function selectTimetable(adeResources: number) {
        appStore.$patch({ adeResources, resourceType: "timetable" });
        await navigateToResource("timetable", adeResources);
    }

    async function selectRoom(adeResources: number) {
        appStore.$patch({ adeResources, resourceType: "room" });
        await navigateToResource("room", adeResources);
    }

    function selectGroup(groupId: number) {
        appStore.$patch({ groupId, adeResources: undefined, resourceType: "timetable" });
    }

    async function goToRooms() {
        appStore.$patch({ adeResources: undefined, resourceType: "room" });
        await router.push({ name: "Rooms" });
    }

    async function goToGroups() {
        appStore.$patch({ groupId: undefined, adeResources: undefined, resourceType: "timetable" });
        await router.push({ name: "Home" });
    }

    async function goToTimetables() {
        appStore.$patch({ adeResources: undefined, resourceType: "timetable" });
        await router.push({ name: "Home" });
    }

    return {
        selectGroup,
        selectRoom,
        selectTimetable,
        goToGroups,
        goToRooms,
        goToTimetables,
    };
};