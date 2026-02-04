export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-primary-bg flex items-center justify-center px-6">
      <div className="max-w-xl w-full text-center bg-input-bg border border-dark-border rounded-3xl p-10">
        <p className="text-primary-text text-3xl md:text-4xl font-semibold mb-4">
          We are under maintenance
        </p>
        <p className="text-text-gray-opacity text-base md:text-lg">
          Rosey is temporarily unavailable while we perform updates. Please
          check back soon.
        </p>
      </div>
    </div>
  );
}
