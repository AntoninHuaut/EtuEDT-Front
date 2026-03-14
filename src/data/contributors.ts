export interface IContributor {
  name: string;
  avatar: string;
  github?: string;
  linkedin?: string;
  website?: string;
}

export const contributors: IContributor[] = [
  {
    name: "Antonin Huaut",
    avatar: "https://github.com/AntoninHuaut.png",
    github: "https://github.com/AntoninHuaut/",
    linkedin: "https://www.linkedin.com/in/antonin-huaut/",
  },
  {
    name: "Gabidut76",
    avatar: "https://github.com/gabidut.png",
    github: "https://github.com/gabidut",
    website: "https://gabidut76.fr/",
  },
  {
    name: "Arthur Serret",
    avatar: "https://github.com/Infuseting.png",
    github: "https://github.com/Infuseting",
    linkedin: "https://www.linkedin.com/in/arthur-serret/",
    website: "https://infuseting.fr/",
  },
];
