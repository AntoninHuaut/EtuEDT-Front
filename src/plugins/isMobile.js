export default function () {
    return (
        this.$vuetify.breakpoint.xs ||
        this.$vuetify.breakpoint.sm ||
        this.$vuetify.breakpoint.md
    );
}