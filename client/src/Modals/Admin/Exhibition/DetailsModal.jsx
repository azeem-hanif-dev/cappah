import React from "react";
import { X } from "lucide-react";
import noimage from "/common/noimage.png";

const DetailsModal = ({ isOpen, onClose, data }) => {
  if (!isOpen) return null;

  const Field = ({ label, value }) => (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-primary mb-1">
        {label}
      </label>
      <div className="p-3 bg-green-50 rounded-lg text-primary border border-green-200">
        {value || "Not specified"}
      </div>
    </div>
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="relative max-w-2xl w-full bg-white rounded-xl shadow-lg overflow-y-auto max-h-screen">
        {/* Header */}
        <div className="border-b border-green-100 p-4 sticky top-0 bg-white z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-primary">
              Exhibition Details
            </h2>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-green-100 transition-colors"
            >
              <X className="w-6 h-6 text-primary" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2 flex justify-center">
              <img
                src={data?.image || noimage}
                alt={data?.title || "Exhibition"}
                className="w-48 h-48 object-cover rounded-lg"
                onError={(e) => {
                  e.target.src = noimage;
                }}
              />
            </div>
            <Field label="Title" value={data?.title} />
            <Field label="Location" value={data?.location} />
            <Field
              label="Schedule"
              value={
                data?.schedule
                  ? `${formatDate(data.schedule.fromDate)} - ${formatDate(
                      data.schedule.toDate
                    )}`
                  : "Not specified"
              }
            />
            <Field label="Time" value={data?.time} />
            <div className="sm:col-span-2">
              <Field label="Link" value={data?.link} />
            </div>
            <div className="sm:col-span-2">
              <Field label="Description" value={data?.description} />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-green-800 text-white rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsModal;
