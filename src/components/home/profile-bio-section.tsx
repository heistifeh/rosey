interface ProfileBioSectionProps {
  bio: string;
}

export function ProfileBioSection({ bio }: ProfileBioSectionProps) {
  return (
    <section>
      <h2 className="text-xl font-semibold text-primary-text mb-3">Bio</h2>
      <p className="text-sm text-text-gray-opacity leading-relaxed">{bio}</p>
    </section>
  );
}

