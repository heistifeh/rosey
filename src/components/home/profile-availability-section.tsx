interface ProfileAvailabilitySectionProps {
  availability: {
    Monday: string;
    Tuesday: string;
    Wednesday: string;
    Thursday: string;
    Friday: string;
    Saturday: string;
    Sunday: string;
  };
}

export function ProfileAvailabilitySection({
  availability,
}: ProfileAvailabilitySectionProps) {
  return (
    <section>
      <h2 className="text-xl font-semibold text-primary-text mb-4">
        Availability
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Object.entries(availability).map(([day, time]) => (
          <div
            key={day}
            className="bg-primary-bg rounded-xl p-3 border border-dark-border"
          >
            <p className="text-xs text-text-gray-opacity mb-1">{day}</p>
            <p className="text-sm text-primary-text font-medium">{time}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

