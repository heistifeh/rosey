const GOOGLE_MAPS_SCRIPT_ID = "google-places-script";
const GOOGLE_MAPS_LOAD_TIMEOUT_MS = 10000;

const hasGooglePlaces = () =>
  Boolean((window as typeof window & { google?: any }).google?.maps?.places);

export const loadGooglePlacesScript = (apiKey: string) => {
  return new Promise<void>((resolve, reject) => {
    if (typeof document === "undefined") {
      resolve();
      return;
    }

    const existingScript = document.getElementById(
      GOOGLE_MAPS_SCRIPT_ID
    ) as HTMLScriptElement | null;

    const timeoutId = window.setTimeout(() => {
      reject(new Error("Timed out loading Google Maps script"));
    }, GOOGLE_MAPS_LOAD_TIMEOUT_MS);
    const clear = () => {
      window.clearTimeout(timeoutId);
    };

    const onLoad = () => {
      if (hasGooglePlaces()) {
        clear();
        resolve();
        return;
      }
      clear();
      reject(new Error("Google Places library failed to initialize"));
    };
    const onError = () => {
      clear();
      reject(new Error("Failed to load Google Maps script"));
    };
    if (existingScript) {
      if (hasGooglePlaces()) {
        clear();
        resolve();
      } else {
        existingScript.addEventListener("load", onLoad, { once: true });
        existingScript.addEventListener("error", onError, { once: true });
      }
      return;
    }

    const script = document.createElement("script");
    script.id = GOOGLE_MAPS_SCRIPT_ID;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.addEventListener("load", onLoad, { once: true });
    script.addEventListener("error", onError, { once: true });
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
