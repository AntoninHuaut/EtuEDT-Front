// Type declaration for CSS imports in TypeScript 6
declare module "*.css" {
	const content: string;
	export default content;
}

declare module "vuetify/styles";
