import React from "react";
import { X, MapPin, Calendar, Clock, Link } from "lucide-react";

const UserEventModal = ({ event, isOpen, onClose }) => {
  if (!isOpen) return null;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("default", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="animate-modal-appear relative w-full max-w-4xl bg-white rounded-lg shadow-xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 p-2 rounded-full bg-white shadow-lg hover:bg-gray-100 transition-colors"
        >
          <X className="w-6 h-6 text-darkGreen" />
        </button>

        {/* Image Section - Fixed height */}
        <div className="relative h-64 w-full">
          <img
            src={`${event.bannerImage || "/defaultimage/noimage.png"}`}
            alt={event.title}
            className="w-full h-full object-contain"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/defaultimage/noimage.png";
            }}
          />
          <div className="absolute bottom-4 left-4 flex items-center bg-darkGreen text-white px-4 py-2 rounded-lg shadow-lg">
            <div className="flex items-center space-x-2">
              <Clock size={20} />
              <span>{event.time}</span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 bg-gradient-to-br from-bgLightGreen to-white">
          <div className="space-y-6">
            {/* Title and Status Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-2xl md:text-3xl font-bold text-extraDarkGreen">
                {event.title}
              </h2>
            </div>

            {/* Date and Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 text-darkGreen">
                <Calendar className="w-5 h-5 flex-shrink-0" />
                <span className="text-admintext">
                  {formatDate(event.schedule?.fromDate)} -{" "}
                  {formatDate(event.schedule?.toDate)}
                </span>
              </div>
              <div className="flex items-center space-x-3 text-darkGreen">
                <MapPin className="w-5 h-5 flex-shrink-0" />
                <span className="text-admintext">{event.location}</span>
              </div>
            </div>

            {/* Link */}
            <div className="flex items-center space-x-3 text-darkGreen">
              <Link className="w-5 h-5 flex-shrink-0" />
              <a
                href={event.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-admintext hover:text-darkGreen break-all"
              >
                {event.link}
              </a>
            </div>

            {/* Description */}
            <div className="bg-bgTable rounded-lg p-4">
              <h3 className="text-lg font-semibold text-darkGreen mb-2">
                About Event
              </h3>
              <div className="space-y-4">
                <p className="text-grayText leading-relaxed">
                  {event.description || "No description available"}
                </p>
              </div>
            </div>

            {/* Additional Details */}
            {event.additionalDetails && (
              <div className="bg-limeGreen rounded-lg p-4">
                <h3 className="text-lg font-semibold text-darkGreen mb-2">
                  Additional Information
                </h3>
                <p className="text-grayText">{event.additionalDetails}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserEventModal;
