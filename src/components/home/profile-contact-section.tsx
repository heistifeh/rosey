import { Mail, Phone, MapPin, ArrowRight as ArrowRightIcon } from "lucide-react";
import { Instagram } from "lucide-react";

interface ProfileContactSectionProps {
  contact: {
    email: string;
    phone: string;
    instagram?: string;
    location: string;
  };
}

export function ProfileContactSection({
  contact,
}: ProfileContactSectionProps) {
  return (
    <section>
      <h2 className="text-xl font-semibold text-primary-text mb-4">Contact</h2>
      <div className="space-y-3">
        <div className="flex items-center justify-between bg-primary-bg rounded-xl p-3 border border-dark-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-input-bg">
              <Mail className="h-4 w-4 text-primary-text" />
            </div>
            <div>
              <p className="text-xs text-text-gray-opacity mb-1">Email</p>
              <p className="text-sm text-primary-text">{contact.email}</p>
            </div>
          </div>
          <button className="p-2 rounded-full bg-primary text-primary-text hover:bg-primary/90 transition-colors">
            <ArrowRightIcon className="h-4 w-4" />
          </button>
        </div>
        <div className="flex items-center justify-between bg-primary-bg rounded-xl p-3 border border-dark-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-input-bg">
              <Phone className="h-4 w-4 text-primary-text" />
            </div>
            <div>
              <p className="text-xs text-text-gray-opacity mb-1">Phone</p>
              <p className="text-sm text-primary-text">{contact.phone}</p>
            </div>
          </div>
          <button className="p-2 rounded-full bg-primary text-primary-text hover:bg-primary/90 transition-colors">
            <ArrowRightIcon className="h-4 w-4" />
          </button>
        </div>
        {contact.instagram && (
          <div className="flex items-center justify-between bg-primary-bg rounded-xl p-3 border border-dark-border">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-input-bg">
                <Instagram className="h-4 w-4 text-primary-text" />
              </div>
              <div>
                <p className="text-xs text-text-gray-opacity mb-1">Instagram</p>
                <p className="text-sm text-primary-text">{contact.instagram}</p>
              </div>
            </div>
            <button className="p-2 rounded-full bg-primary text-primary-text hover:bg-primary/90 transition-colors">
              <ArrowRightIcon className="h-4 w-4" />
            </button>
          </div>
        )}
        <div className="flex items-center justify-between bg-primary-bg rounded-xl p-3 border border-dark-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-input-bg">
              <MapPin className="h-4 w-4 text-primary-text" />
            </div>
            <div>
              <p className="text-xs text-text-gray-opacity mb-1">Location</p>
              <p className="text-sm text-primary-text">{contact.location}</p>
            </div>
          </div>
          <button className="p-2 rounded-full bg-primary text-primary-text hover:bg-primary/90 transition-colors">
            <ArrowRightIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

