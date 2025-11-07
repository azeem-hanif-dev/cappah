import React, { useState, useEffect } from "react";
import { getEventDetails } from "../../../Api/Common/Exhibition/GetExhibition.Api";
import { Clock4 } from "lucide-react";
import { baseUrl } from "../../../urls";
import noevents from "/common/NoEvents.png";
// import Loader from "../loader/Loader";
import UserEventModal from "../../../Modals/User/Exhibition/UserEventModal";
import Loader from "../../Admin/Common/Loader.common";

export const Events = () => {
  const [selectedTab, setSelectedTab] = useState("Current");
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const itemsPerPage = 3;

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getEventDetails();

        // Ensure events is always an array, avoiding errors if it's undefined/null
        const filteredEvents = (data?.events || []).filter(
          (event) => event.isActive
        );

        if (filteredEvents.length > 0) {
          setEvents(filteredEvents);
        } else {
          setError("No active events found.");
          setEvents([]); // Clear the events state when no active events are found
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        setError(
          error.message || "Something went wrong while fetching events."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const filtered = events.filter(
      (event) => event.status === selectedTab.toLowerCase()
    );
    setFilteredEvents(filtered);
    setCurrentPage(1);
  }, [selectedTab, events]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEvents = filteredEvents.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);

  // Function to format the date number with consistent width
  const formatDateNumber = (date) => {
    const day = new Date(date).getDate();
    return day.toString().padStart(2, "0");
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center bg-bggray p-16 space-y-16">
        {/* Left Section */}
        <div className="flex flex-col w-full justify-center items-center space-y-16">
          <h1 className="subheading2 text-primary uppercase font-semibold">
            Events Schedule
          </h1>

          <div className="flex flex-col w-full justify-evenly content md:flex-row  gap-6">
            {["Past", "Current", "Upcoming"].map((tab, index) => (
              <button
                key={index}
                className={`flex  w-full button md:w-1/4  rounded justify-evenly items-center transition
                ${
                  selectedTab === tab
                    ? "bg-seagreen text-white"
                    : "bg-white text-primary"
                }
                hover:bg-seagreen hover:text-white`}
                onClick={() => setSelectedTab(tab)}
              >
                <span className="flex-grow text-center">{`${tab}`}</span>
                <div className="w-24 flex justify-start items-center">
                  <span className="flex items-center">
                    <span
                      className={`h-[1px] mt-[0.5px] transition-all duration-500
            ${
              selectedTab === tab
                ? "w-16 bg-white group-hover:w-16"
                : "w-8 bg-seagreen group-hover:w-16"
            }`}
                    ></span>
                    <span className="content">&#11166;</span>
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="w-full flex flex-col justify-center items-center">
          {/* Right Section */}

          {isLoading && (
            <div className="flex items-center justify-center h-[400px] ">
              <Loader />
            </div>
          )}

          {/* {error && (
            <div className="flex items-center justify-center">
              <p className="text-black">{error}</p>
            </div>
          )} */}

          {!isLoading && !error && (
            <>
              <div className="w-full flex flex-col md:flex-row items-center justify-evenly text-wrap">
                {paginatedEvents.length > 0 ? (
                  paginatedEvents.map((event) => (
                    <div
                      key={event._id}
                      className="flex  flex-col rounded-md  py-2   justify-between gap-6 w-full items-center "
                    >
                      {/* Event Image */}
                      <div className="w-full sm:w-[250px] h-[250px] md:h-[200px] md:w-[200px]   rounded-lg relative  sm:mb-0">
                        <img
                          loading="lazy"
                          src={event.bannerImage || "/common/noimage.png"}
                          alt={event.title}
                          className="w-full h-full object-cover rounded-md"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/common/noimage.png";
                          }}
                        />
                        <div className="absolute bottom-[-14px] left-1/2 transform -translate-x-1/2 bg-white text-center py-1 rounded text-xs h-[25px] w-[120px]">
                          <p className="mt-1 text-darkGreen">{event.time}</p>
                          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                            <Clock4
                              color="#ffffff"
                              fill="#17958c"
                              strokeWidth={1}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Event Details */}
                      <div className="flex flex-col w-full pt-4 justify-center items-center space-y-2">
                        {/* Date Section */}

                        <div className="text-center flex w-full justify-center items-center  ">
                          {" "}
                          {/* Fixed width container for date */}
                          <p className="text-6xl flex items-center justify-center text-primary font-semibold">
                            {formatDateNumber(event.schedule?.fromDate)}
                          </p>
                          <div className="text-left">
                            <p className="contentinfo font-semibold">
                              {new Date(
                                event.schedule?.fromDate
                              ).toLocaleString("default", { month: "short" })}
                            </p>
                            <p className="contentinfo font-semibold">
                              {new Date(
                                event.schedule?.fromDate
                              ).toLocaleString("default", { weekday: "long" })}
                            </p>
                          </div>
                        </div>

                        {/* Event Info Section */}

                        <div className="flex flex-col w-full justify-center items-center space-y-2">
                          <h3 className="content font-semibold text-gray-800 leading-tight text-center sm:text-left trucate text-wrap break-words ">
                            {event.title}
                          </h3>
                          <p className="hidden md:block text-sm text-gray-600  text-center sm:text-left ">
                            {event.location.length > 40
                              ? `${event.location.substring(0, 40)}...`
                              : event.location}
                          </p>

                          <button
                            onClick={() => {
                              console.log("Event clicked:", event); // Debug log
                              setSelectedEvent(event); // Set the selected event
                              setIsModalOpen(true); // Open the modal
                            }}
                            className="text-primary text-sm font-medium flex items-center  justify-center sm:justify-start hover:text-lightGreen transition-colors"
                          >
                            <p className="underline">Show More</p>
                            <span className="ml-1 no-underline">→</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p></p>
                )}
              </div>

              {/* Pagination - Only show if there are events */}
            </>
          )}
        </div>

        <div
          className={` flex justify-center ${
            filteredEvents.length === 0 ? "invisible" : ""
          }`}
        >
          <div className="flex items-center">
            {/* Previous Button */}
            <button
              className={`py-2 px-3 rounded mr-2 text-sm border-[1px] border-black ${
                currentPage === 1
                  ? "bg-white text-primary cursor-not-allowed opacity-50"
                  : "bg-seagreen text-white"
              }`}
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              ←
            </button>

            {/* Pagination Logic */}
            {[...Array(totalPages)].map((_, index) => {
              if (
                index === 0 ||
                index === totalPages - 1 ||
                index === currentPage - 1
              ) {
                return (
                  <button
                    key={index}
                    className={`py-2 px-3 rounded mr-2 text-sm border-[1px] border-black ${
                      currentPage === index + 1
                        ? "bg-seagreen text-white"
                        : "bg-white text-primary"
                    }`}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </button>
                );
              }

              if (
                (index === 1 && currentPage > 3) ||
                (index === totalPages - 2 && currentPage < totalPages - 2)
              ) {
                return (
                  <span
                    key={index}
                    className="py-2 px-3 mr-2 text-sm border-[1px] border-black rounded"
                  >
                    ...
                  </span>
                );
              }

              return null;
            })}

            {/* Next Button */}
            <button
              className={`py-2 px-3 rounded text-sm border-[1px] border-black ${
                currentPage === totalPages
                  ? "bg-white text-primary cursor-not-allowed opacity-50"
                  : "bg-seagreen text-white"
              }`}
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              →
            </button>
          </div>
        </div>
      </div>
      <UserEventModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={() => {
          console.log(selectedEvent);
          setIsModalOpen(false);
          setSelectedEvent(null);
        }}
      />
    </>
  );
};

export default Events;
