export interface ASSETS_PATH {
  src: string;
  alt: string;
}

export function ASSETS(): ASSETS_PATH[] {
  return [
    {
      src: "/primary-logo.png",
      alt: "Logo",
    },
    {
      src: "/admin.jpeg",
      alt: "Holder",
    },
  ];
}