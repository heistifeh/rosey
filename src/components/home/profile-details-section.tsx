interface ProfileDetailsSectionProps {
  details: {
    basedIn: string;
    colorsTo?: string;
    catersTo?: string;
    pronouns: string;
    age: number;
    height: string;
    hairColor: string;
    eyeColor: string;
    languages: string;
  };
}

export function ProfileDetailsSection({
  details,
}: ProfileDetailsSectionProps) {
  return (
    <section>
      <h2 className="text-xl font-semibold text-primary-text mb-4">Details</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p className="text-xs text-text-gray-opacity mb-1">Based In</p>
          <p className="text-sm text-primary-text">{details.basedIn}</p>
        </div>
        <div>
          <p className="text-xs text-text-gray-opacity mb-1">
            {details.catersTo ? "Caters to" : "Colors To"}
          </p>
          <p className="text-sm text-primary-text">
            {details.catersTo || details.colorsTo}
          </p>
        </div>
        <div>
          <p className="text-xs text-text-gray-opacity mb-1">Pronouns</p>
          <p className="text-sm text-primary-text">{details.pronouns}</p>
        </div>
        <div>
          <p className="text-xs text-text-gray-opacity mb-1">Age</p>
          <p className="text-sm text-primary-text">{details.age}</p>
        </div>
        <div>
          <p className="text-xs text-text-gray-opacity mb-1">Height</p>
          <p className="text-sm text-primary-text">{details.height}</p>
        </div>
        <div>
          <p className="text-xs text-text-gray-opacity mb-1">Hair Color</p>
          <p className="text-sm text-primary-text">{details.hairColor}</p>
        </div>
        <div>
          <p className="text-xs text-text-gray-opacity mb-1">Eye Color</p>
          <p className="text-sm text-primary-text">{details.eyeColor}</p>
        </div>
        <div>
          <p className="text-xs text-text-gray-opacity mb-1">Languages</p>
          <p className="text-sm text-primary-text">{details.languages}</p>
        </div>
      </div>
    </section>
  );
}

