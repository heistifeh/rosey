const GOOGLE_MAPS_SCRIPT_ID = "google-places-script";

export const loadGooglePlacesScript = (apiKey: string) => {
  return new Promise<void>((resolve) => {
    if (typeof document === "undefined") {
      resolve();
      return;
    }

    const existingScript = document.getElementById(
      GOOGLE_MAPS_SCRIPT_ID
    ) as HTMLScriptElement | null;

    const onLoad = () => resolve();

    if (existingScript) {
      if (
        (window as typeof window & { google?: any }).google?.maps?.places
      ) {
        resolve();
      } else {
        existingScript.addEventListener("load", onLoad, { once: true });
      }
      return;
    }

    const script = document.createElement("script");
    script.id = GOOGLE_MAPS_SCRIPT_ID;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.addEventListener("load", onLoad, { once: true });
    document.head.appendChild(script);
  });
};

export interface AddressComponent {
  types: string[];
  long_name?: string;
}

export const getAddressComponentValue = (
  components: AddressComponent[] | undefined,
  candidateTypes: string[]
) => {
  if (!components) {
    return null;
  }

  for (const type of candidateTypes) {
    const component = components.find((comp) => comp.types.includes(type));
    if (component?.long_name) {
      return component.long_name;
    }
  }

  return null;
};

export const slugifyLocation = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^[-]+|[-]+$/g, "")
    .toLowerCase();
