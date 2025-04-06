"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import DeleteEventModal from "@/ui/modals/DeleteEventModal";

// Add custom CSS to hide number input spinners
const hideNumberInputSpinners = {
    WebkitAppearance: "none",
    MozAppearance: "textfield",
    appearance: "textfield",
    margin: 0
};

// Date utility functions for formatting between ISO format (required by input type="date") and dd/mm/yy display
const formatDateForDisplay = (isoDateString) => {
    if (!isoDateString) return "";
    
    const date = new Date(isoDateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().substring(2, 4); // Get only last 2 digits of year
    
    return `${day}/${month}/${year}`;
};

// Date utility functions for formatting to Thai format
const formatDateToThaiDisplay = (isoDateString) => {
    if (!isoDateString) return "";
    
    const date = new Date(isoDateString);
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear() + 543; // Convert to Buddhist Era (BE)
    
    const thaiMonths = [
        "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
        "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];
    
    return `${day} ${thaiMonths[month]} ${year}`;
};

// Function to format dates for display in the UI but keeping proper date inputs
const getDisplayDate = (dateString) => {
    if (!dateString) return { iso: "", display: "" };
    
    return {
        iso: dateString, // The ISO format for the input value
        display: formatDateToThaiDisplay(dateString) // The display format for showing to users
    };
};

const parseDateFromDisplay = (displayDate) => {
    if (!displayDate) return "";
    
    // Parse dd/mm/yy format to ISO format (YYYY-MM-DD)
    const [day, month, year] = displayDate.split('/');
    
    // Assume 21st century for two-digit year
    const fullYear = year.length === 2 ? `20${year}` : year;
    
    const dateObj = new Date(`${fullYear}-${month}-${day}`);
    if (isNaN(dateObj.getTime())) {
        return ""; // Invalid date
    }
    
    return dateObj.toISOString().split('T')[0]; // Return as YYYY-MM-DD
};

export default function OrganizerEventManagePage() {
    const { organizerId, eventIdName } = useParams(); // Access route params
    const router = useRouter();

    // State for form fields
    const [eventName, setEventName] = useState("");
    const [idName, setIdName] = useState("");
    const [eventDescription, setEventDescription] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [eventPrice, setEventPrice] = useState("");
    const [eventCapacity, setEventCapacity] = useState("");
    const [eventLocation, setEventLocation] = useState("");
    const [contactInfo, setContactInfo] = useState("");
    const [eventId, setEventId] = useState(""); // Store the actual event_id

    // State for validations
    const [dateTimeError, setDateTimeError] = useState(null);

    // Create a function to validate dates and times
    const validateDatesAndTimes = useCallback((startDate, endDate, startTime, endTime) => {
        // Format today's date as YYYY-MM-DD for comparison
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayFormatted = today.toISOString().split('T')[0];
        
        // Validate start date is not before today
        if (startDate && startDate < todayFormatted) {
            return "วันที่เริ่มต้นไม่สามารถเป็นวันที่ผ่านมาแล้วได้";
        }
        
        // Validate end date is not before start date
        if (startDate && endDate && endDate < startDate) {
            return "วันที่สิ้นสุดต้องเป็นวันเดียวกันหรือหลังวันที่เริ่มต้น";
        }
        
        // If start date and end date are the same day, validate end time is not before start time
        if (startDate && endDate && startDate === endDate && startTime && endTime && endTime < startTime) {
            return "เวลาสิ้นสุดต้องเป็นเวลาหลังเวลาเริ่มต้น";
        }
        
        return null; // Return null for no errors
    }, []);

    // Handle changes to start date
    const handleStartDateChange = (e) => {
        const newStartDate = parseDateFromDisplay(e.target.value);
        setStartDate(newStartDate);
        
        // If end date exists and is now before the new start date, reset it to the start date
        if (endDate && endDate < newStartDate) {
            setEndDate(newStartDate); // Reset end date to match the new start date
        }
        
        const error = validateDatesAndTimes(newStartDate, endDate, startTime, endTime);
        setDateTimeError(error);
    };

    // Handle changes to end date
    const handleEndDateChange = (e) => {
        const newEndDate = parseDateFromDisplay(e.target.value);
        
        // Don't allow end date before start date
        if (startDate && newEndDate < startDate) {
            setDateTimeError("วันที่สิ้นสุดต้องเป็นวันเดียวกันหรือหลังวันที่เริ่มต้น");
            return; // Don't update the end date if it's invalid
        }
        
        setEndDate(newEndDate);
        const error = validateDatesAndTimes(startDate, newEndDate, startTime, endTime);
        setDateTimeError(error);
    };

    // Handle changes to start time
    const handleStartTimeChange = (e) => {
        const newStartTime = e.target.value;
        setStartTime(newStartTime);
        
        // If on the same day and end time is now before start time, reset it to match start time
        if (startDate && endDate && startDate === endDate && endTime && endTime < newStartTime) {
            setEndTime(newStartTime); // Reset end time to match the new start time
        }
        
        const error = validateDatesAndTimes(startDate, endDate, newStartTime, endTime);
        setDateTimeError(error);
    };

    // Handle changes to end time
    const handleEndTimeChange = (e) => {
        const newEndTime = e.target.value;
        
        // Don't allow end time before start time on the same day
        if (startDate && endDate && startDate === endDate && startTime && newEndTime < startTime) {
            setDateTimeError("เวลาสิ้นสุดต้องเป็นเวลาหลังเวลาเริ่มต้น");
            return; // Don't update the end time if it's invalid
        }
        
        setEndTime(newEndTime);
        const error = validateDatesAndTimes(startDate, endDate, startTime, newEndTime);
        setDateTimeError(error);
    };

    // Create a reference to store previous values
    const previousValues = useRef({
        eventName,
        idName,
        eventDescription,
        eventLocation,
        startDate,
        endDate,
        startTime,
        endTime,
        eventCapacity,
        eventPrice,
        contactInfo,
    });

    const timeoutIdRef = useRef(null);
    const isFirstRender = useRef(true);

    // State for autosave and error handling
    const saveStatusStatusStyleEnum = {
        SUCCESS: "text-green-500 dark:text-green-400",
        WARNING: "text-yellow-500 dark:text-yellow-400",
        ERROR: "text-red-500 dark:text-red-400",
        LOADING: "text-blue-500 dark:text-blue-400",
    };
    const [saveStatus, setSaveStatus] = useState({
        message: "กรุณาตั้งชื่ออีเวนต์",
        status: saveStatusStatusStyleEnum.ERROR,
    });
    const [error, setError] = useState("");
    const [notFound, setNotFound] = useState(false); // For 404 handling

    // State for booths
    const [booths, setBooths] = useState([]); // Initialize empty booth data
    
    // State for delete event modal
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // Modified handler for price to prevent negative values
    const handlePriceChange = (e) => {
        const value = parseFloat(e.target.value);
        if (isNaN(value) || value < 0) {
            setEventPrice("0");
        } else {
            setEventPrice(e.target.value);
        }
    };

    // Add validation for id_name to ensure URL-safe characters only
    const handleIdNameChange = (e) => {
        // Allow only letters, numbers, underscores, and hyphens (URL-safe characters)
        const value = e.target.value;
        
        // Don't allow "create" as id_name
        if (value.toLowerCase() === "create") {
            const errorMsg = document.getElementById('id-name-error');
            if (errorMsg) {
                errorMsg.textContent = 'คำว่า "create" ไม่สามารถใช้เป็น ID Name ได้';
                errorMsg.classList.remove('text-gray-500');
                errorMsg.classList.remove('dark:text-gray-400');
                errorMsg.classList.add('text-red-500');
                
                // Hide the error after 3 seconds
                setTimeout(() => {
                    errorMsg.textContent = 'ใช้ได้เฉพาะตัวอักษรภาษาอังกฤษ, ตัวเลข, ขีดล่าง (_) และเครื่องหมายขีด (-) เท่านั้น';
                    errorMsg.classList.add('text-gray-500');
                    errorMsg.classList.add('dark:text-gray-400');
                    errorMsg.classList.remove('text-red-500');
                }, 3000);
            }
            return;
        }
        
        // Replace any invalid characters with empty string
        const sanitizedValue = value.replace(/[^a-zA-Z0-9_-]/g, '');
        
        // Update the state with sanitized value
        setIdName(sanitizedValue);
        
        // Show tooltip or error message if the input was sanitized
        if (value !== sanitizedValue) {
            // Optional: Set a temporary error message or tooltip
            const errorMsg = document.getElementById('id-name-error');
            if (errorMsg) {
                errorMsg.classList.remove('text-gray-500');
                errorMsg.classList.remove('dark:text-gray-400');
                
                errorMsg.classList.add('text-red-500');
                
                // Hide the error after 3 seconds
                setTimeout(() => {
                    errorMsg.classList.add('text-gray-500');
                    errorMsg.classList.add('dark:text-gray-400');
                    errorMsg.classList.remove('text-red-500');
                }, 3000);
            }
        }
    };

    // Fetch event data if editing an existing event
    useEffect(() => {
        const fetchEventData = async () => {
            if (eventIdName === "create") return; // Skip fetching for create mode

            try {
                const response = await fetch(
                    `/api/data/event/get/event_id_name`,
                    {
                        method: "POST",
                        body: JSON.stringify({ event_id_name: eventIdName }),
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
                if (response.status === 404) {
                    setNotFound(true);
                    return;
                }
                if (!response.ok) {
                    throw new Error("Failed to fetch event data");
                }
                const data = await response.json();
                setEventName(data.content.name || "");
                setIdName(data.content.id_name || "");
                setEventDescription(data.content.description || "");
                setStartDate(data.content.start_date || "");
                setEndDate(data.content.end_date || "");
                setStartTime(data.content.start_time || "");
                setEndTime(data.content.end_time || "");
                setEventPrice(
                    data.content.price !== null &&
                        data.content.price !== undefined
                        ? data.content.price.toString()
                        : ""
                );
                setEventCapacity(data.content.capacity || "");
                setEventLocation(data.content.location || "");
                setContactInfo(data.content.contact_info || "");
                setBooths(data.content.Booths || []); // Set booths from the event data
                setEventId(data.content.event_id || ""); // Set the actual event_id
            } catch (error) {
                console.error("Error fetching event data:", error);
                setError("An error occurred while fetching event data.");
            }
        };

        fetchEventData();
    }, [eventIdName]);

    // Autosave functionality with onUpdate trigger
    useEffect(() => {
        // Skip on first render to avoid unnecessary save
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        // Skip autosave if we have a 404 error or on empty create mode
        if (notFound || (eventIdName === "create" && !eventName)) return;

        // Check if values have changed since last render
        const valuesChanged =
            previousValues.current.eventName !== eventName ||
            previousValues.current.idName !== idName ||
            previousValues.current.eventDescription !== eventDescription ||
            previousValues.current.eventLocation !== eventLocation ||
            previousValues.current.startDate !== startDate ||
            previousValues.current.endDate !== endDate ||
            previousValues.current.startTime !== startTime ||
            previousValues.current.endTime !== endTime ||
            previousValues.current.eventCapacity !== eventCapacity ||
            previousValues.current.eventPrice !== eventPrice ||
            previousValues.current.contactInfo !== contactInfo;

        // Only update status and set timeout if values have changed
        if (valuesChanged) {
            // Clear any existing timeout to prevent multiple saves
            if (timeoutIdRef.current) {
                clearTimeout(timeoutIdRef.current);
                timeoutIdRef.current = null;
            }

            // Perform validation check without setting state
            const validationError = validateDatesAndTimes(startDate, endDate, startTime, endTime);
            
            if (validationError) {
                // If validation fails, update save status to show error, but avoid setting dateTimeError here
                setSaveStatus({
                    message: "มีข้อมูลไม่ถูกต้อง กรุณาตรวจสอบวันที่และเวลา",
                    status: saveStatusStatusStyleEnum.ERROR,
                });
                return; // Exit early - don't set up autosave
            }

            // Update the "pending save" status
            setSaveStatus({
                message: "มีการแก้ไข กำลังบันทึก...",
                status: saveStatusStatusStyleEnum.WARNING,
            });

            // Update the ref with current values for next comparison
            previousValues.current = {
                eventName,
                idName,
                eventDescription,
                eventLocation,
                startDate,
                endDate,
                startTime,
                endTime,
                eventCapacity,
                eventPrice,
                contactInfo,
            };

            // Define autosave function to be called after timeout
            const performAutosave = async () => {
                try {
                    // Check validation again just before saving without setting state
                    const validationError = validateDatesAndTimes(startDate, endDate, startTime, endTime);
                    if (validationError) {
                        setSaveStatus({
                            message: "มีข้อมูลไม่ถูกต้อง กรุณาตรวจสอบวันที่และเวลา",
                            status: saveStatusStatusStyleEnum.ERROR,
                        });
                        timeoutIdRef.current = null;
                        return;
                    }

                    const payload = {
                        name: eventName,
                        id_name: idName,
                        description: eventDescription,
                        location: eventLocation,
                        start_date: startDate,
                        end_date: endDate,
                        start_time: startTime,
                        end_time: endTime,
                        capacity: eventCapacity,
                        price: eventPrice,
                        contact_info: contactInfo,
                        organizer: organizerId,
                    };

                    const response = await fetch(
                        eventIdName === "create"
                            ? "/api/data/event/create"
                            : `/api/data/event/update/${eventId || eventIdName}`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(payload),
                        }
                    );

                    if (!response.ok) {
                        throw new Error("Failed to save event data");
                    }

                    const result = await response.json();

                    // Redirect to the event page if we were in create mode and got a successful response with event data
                    if (
                        eventIdName === "create" &&
                        result.isSuccess &&
                        result.content &&
                        result.content.event_id
                    ) {
                        setSaveStatus({
                            message: "บันทึกสำเร็จ กำลังเปลี่ยนเส้นทาง...",
                            status: saveStatusStatusStyleEnum.SUCCESS,
                        });

                        // Short delay to show success message before redirect
                        setTimeout(() => {
                            router.replace(
                                `/organizer/${organizerId}/event/${result.content.id_name || result.content.event_id}`
                            );
                        }, 1000);

                        return;
                    }

                    // Check if the id_name has changed and we need to redirect
                    if (
                        eventIdName !== "create" &&
                        result.isSuccess
                    ) {
                        // Case 1: id_name is removed (blank/null) but URL still has old id_name
                        const idNameWasRemoved = (!idName || idName.trim() === '') && 
                                                eventIdName !== eventId && 
                                                eventId;
                                                
                        // Case 2: id_name was changed to something different
                        const idNameWasChanged = idName && 
                                               idName.trim() !== '' && 
                                               idName !== eventIdName;
                        
                        if (idNameWasRemoved || idNameWasChanged) {
                            setSaveStatus({
                                message: "บันทึกสำเร็จ กำลังเปลี่ยนเส้นทาง...",
                                status: saveStatusStatusStyleEnum.SUCCESS,
                            });

                            // Short delay to show success message before redirect
                            setTimeout(() => {
                                // If id_name was removed, use the event_id for the URL
                                // If id_name was changed to something else, use the new id_name
                                const newPath = idNameWasRemoved 
                                    ? `/organizer/${organizerId}/event/${eventId}`
                                    : `/organizer/${organizerId}/event/${idName}`;
                                    
                                router.replace(newPath);
                            }, 1000);

                            return;
                        }
                    }

                    setSaveStatus({
                        message: "บันทึกสำเร็จ",
                        status: saveStatusStatusStyleEnum.SUCCESS,
                    });

                    // Reset success status after 3 seconds
                    setTimeout(() => {
                        setSaveStatus({
                            message: "บันทึกแล้ว",
                            status: saveStatusStatusStyleEnum.SUCCESS,
                        });
                    }, 3000);

                    // Clear the timeout ref after execution
                    timeoutIdRef.current = null;
                } catch (error) {
                    setSaveStatus({
                        message: "เกิดข้อผิดพลาดในการบันทึก",
                        status: saveStatusStatusStyleEnum.ERROR,
                    });
                    timeoutIdRef.current = null;
                }
            };

            // Set timeout and store its ID in the ref
            timeoutIdRef.current = setTimeout(performAutosave, 1500);
        }
    }, [
        eventName,
        idName,
        eventDescription,
        eventLocation,
        startDate,
        endDate,
        startTime,
        endTime,
        eventCapacity,
        eventPrice,
        contactInfo,
        eventIdName,
        organizerId,
        router,
        saveStatusStatusStyleEnum,
        notFound,
        eventId,
        validateDatesAndTimes,
    ]);

    // Ensure cleanup when component unmounts
    useEffect(() => {
        return () => {
            if (timeoutIdRef.current) {
                clearTimeout(timeoutIdRef.current);
            }
        };
    }, []);

    // Handle 404 Event Not Found
    if (notFound) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#5E9BD6] text-gray-700 dark:text-gray-300 px-6 dark:bg-gray-900">
                <h1 className="text-5xl font-extrabold mb-4">
                    404 Event Not Found
                </h1>
                <p className="text-lg mb-6">ไม่พบอีเวนต์ที่คุณกำลังมองหา</p>
                <button
                    onClick={() => router.push("/organizer")}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 transition"
                >
                    กลับไปยังหน้า Organizer
                </button>
            </div>
        );
    }

    return (
        <>
            {/* Existing HTML structure */}
            <div className="min-h-screen flex flex-col bg-[#5E9BD6] text-gray-700 dark:bg-gray-900 px-6">
                <div className="bg-white dark:bg-gray-800 dark:text-white p-16 border-primary mt-5 flex flex-col w-full">
                    <div className="mb-8 mt-0">
                        <button
                            onClick={() => router.push("/organizer")}
                            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-medium transition flex items-center gap-2"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            กลับไปยังหน้าหลัก
                        </button>
                    </div>
                    <h1 className="flex flex-col text-5xl font-extrabold mb-4 items-center">
                        {eventIdName === "create"
                            ? "สร้างอีเวนต์"
                            : "ข้อมูลอีเวนต์"}
                    </h1>

                    <section className="flex flex-col w-full">
                        <form>
                            {/* Display error messages */}
                            {error && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
                                    {error}
                                </div>
                            )}

                            {/* Display save status */}
                            <div
                                className={`text-right text-sm bg-gray mb-4 ${saveStatus.status}`}
                            >
                                {`สถานะการบันทึก: ${saveStatus.message}`}
                            </div>

                            {/* Display date and time validation error */}
                            {dateTimeError && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
                                    {dateTimeError}
                                </div>
                            )}

                            {/* Event Name */}
                            <div className="mb-4">
                                <label
                                    htmlFor="event_name"
                                    className="block text-lg font-medium text-gray-700 dark:text-gray-300"
                                >
                                    ชื่ออีเวนต์
                                </label>
                                <input
                                    type="text"
                                    id="event_name"
                                    name="event_name"
                                    value={eventName}
                                    onChange={(e) =>
                                        setEventName(e.target.value)
                                    }
                                    className="mt-1 p-2 block w-full border-gray-300 bg-gray-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    required
                                />
                            </div>

                            {/* Event ID Name */}
                            <div className="mb-4">
                                <label
                                    htmlFor="id_name"
                                    className="block text-lg font-medium text-gray-700 dark:text-gray-300"
                                >
                                    รหัสอีเวนต์ (ID Name)
                                </label>
                                <input
                                    type="text"
                                    id="id_name"
                                    name="id_name"
                                    value={idName}
                                    onChange={handleIdNameChange}
                                    className="mt-1 p-2 block w-full border-gray-300 bg-gray-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="ชื่อที่สั้นๆ ที่ใช้เรียกอีเวนต์ใน URL เช่น ku_openhouse_2025"
                                />
                                <p id="id-name-error" className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    ใช้ได้เฉพาะตัวอักษรภาษาอังกฤษ, ตัวเลข, ขีดล่าง (_) และเครื่องหมายขีด (-) เท่านั้น
                                </p>
                            </div>

                            {/* Event Description */}
                            <div className="mb-4">
                                <label
                                    htmlFor="event_description"
                                    className="block text-lg font-medium text-gray-700 dark:text-gray-300"
                                >
                                    รายละเอียดอีเวนต์
                                </label>
                                <textarea
                                    id="event_description"
                                    name="event_description"
                                    value={eventDescription}
                                    onChange={(e) =>
                                        setEventDescription(e.target.value)
                                    }
                                    rows="4"
                                    className="mt-1 p-2 block w-full border-gray-300 bg-gray-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    required
                                ></textarea>
                            </div>

                            {/* Event Location */}
                            <div className="mb-4">
                                <label
                                    htmlFor="event_location"
                                    className="block text-lg font-medium text-gray-700 dark:text-gray-300"
                                >
                                    สถานที่จัด
                                </label>
                                <input
                                    type="text"
                                    id="event_location"
                                    name="event_location"
                                    value={eventLocation}
                                    onChange={(e) =>
                                        setEventLocation(e.target.value)
                                    }
                                    className="mt-1 p-2 block w-full border-gray-300 bg-gray-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    required
                                />
                            </div>

                            {/* Event Dates */}
                            <div className="flex flex-wrap lg:flex-nowrap gap-4 mb-4">
                                <div className="flex-1">
                                    <label
                                        htmlFor="start_date"
                                        className="block text-lg font-medium text-gray-700 dark:text-gray-300"
                                    >
                                        วันที่เริ่มต้น
                                    </label>
                                    <input
                                        type="date"
                                        id="start_date"
                                        name="start_date"
                                        value={startDate}
                                        onChange={(e) => handleStartDateChange(e)}
                                        min={new Date().toISOString().split('T')[0]} // Set minimum date to today
                                        className="mt-1 p-2 block w-full border-gray-300 bg-gray-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        required
                                    />
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        {startDate ? formatDateToThaiDisplay(startDate) : "วัน เดือน ปี"}
                                    </p>
                                </div>

                                <div className="flex-1">
                                    <label
                                        htmlFor="end_date"
                                        className="block text-lg font-medium text-gray-700 dark:text-gray-300"
                                    >
                                        วันที่สิ้นสุด
                                    </label>
                                    <input
                                        type="date"
                                        id="end_date"
                                        name="end_date"
                                        value={endDate}
                                        onChange={(e) => handleEndDateChange(e)}
                                        min={startDate || new Date().toISOString().split('T')[0]} // Set minimum date to start date or today
                                        className="mt-1 p-2 block w-full border-gray-300 bg-gray-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    />
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        {endDate ? formatDateToThaiDisplay(endDate) : "วัน เดือน ปี"}
                                    </p>
                                </div>
                            </div>

                            {/* Event Times */}
                            <div className="flex flex-wrap lg:flex-nowrap gap-4 mb-4">
                                <div className="flex-1">
                                    <label
                                        htmlFor="start_time"
                                        className="block text-lg font-medium text-gray-700 dark:text-gray-300"
                                    >
                                        เวลาเริ่มต้น
                                    </label>
                                    <input
                                        type="time"
                                        id="start_time"
                                        name="start_time"
                                        value={startTime}
                                        onChange={handleStartTimeChange}
                                        className="mt-1 p-2 block w-full border-gray-300 bg-gray-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    />
                                </div>

                                <div className="flex-1">
                                    <label
                                        htmlFor="end_time"
                                        className="block text-lg font-medium text-gray-700 dark:text-gray-300"
                                    >
                                        เวลาสิ้นสุด
                                    </label>
                                    <input
                                        type="time"
                                        id="end_time"
                                        name="end_time"
                                        value={endTime}
                                        onChange={handleEndTimeChange}
                                        className="mt-1 p-2 block w-full border-gray-300 bg-gray-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Event Capacity */}
                            <div className="mb-4">
                                <label
                                    htmlFor="event_capacity"
                                    className="block text-lg font-medium text-gray-700 dark:text-gray-300"
                                >
                                    จำนวนที่รับ
                                </label>
                                <input
                                    type="text"
                                    id="event_capacity"
                                    name="event_capacity"
                                    value={eventCapacity}
                                    onChange={(e) =>
                                        setEventCapacity(e.target.value)
                                    }
                                    className="mt-1 p-2 block w-full border-gray-300 bg-gray-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                />
                            </div>

                            {/* Event Price */}
                            <div className="mb-4">
                                <label
                                    htmlFor="event_price"
                                    className="block text-lg font-medium text-gray-700 dark:text-gray-300"
                                >
                                    ค่าใช้จ่าย
                                </label>
                                <input
                                    type="number"
                                    id="event_price"
                                    name="event_price"
                                    value={eventPrice}
                                    onChange={handlePriceChange}
                                    style={hideNumberInputSpinners}
                                    className="mt-1 p-2 block w-full border-gray-300 bg-gray-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    min="0"
                                />
                            </div>

                            {/* Contact Info */}
                            <div className="mb-4">
                                <label
                                    htmlFor="contact_info"
                                    className="block text-lg font-medium text-gray-700 dark:text-gray-300"
                                >
                                    ข้อมูลติดต่อ
                                </label>
                                <input
                                    type="text"
                                    id="contact_info"
                                    name="contact_info"
                                    value={contactInfo}
                                    onChange={(e) =>
                                        setContactInfo(e.target.value)
                                    }
                                    className="mt-1 p-2 block w-full border-gray-300 bg-gray-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                />
                            </div>
                        </form>
                        {/* Action Buttons - Aligned to the right with delete button on the left */}
                        <div className="flex justify-between mt-6 mb-4">
                            {/* Delete button on the left */}
                            <div>
                                {eventIdName !== "create" && (
                                    <button 
                                        onClick={() => setIsDeleteModalOpen(true)}
                                        className="px-3 py-3 bg-red-600 text-white rounded-lg text-lg font-semibold hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-400 transition"
                                    >
                                        ลบอีเวนต์
                                    </button>
                                )}
                            </div>
                            
                            {/* Other action buttons on the right */}
                            <div className="flex gap-4">
                                <button className="px-3 py-3 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 transition">
                                    ออกแบบหน้าเว็บ
                                </button>
                                <button className="px-3 py-3 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 transition">
                                    จัดการสตาฟ
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
                
                {/* Only show booths section when not in create mode */}
                {eventIdName !== "create" && (
                    <div id="booths" className="bg-white dark:bg-gray-800 p-8 lg:p-16 border-primary mt-5 flex flex-col w-full rounded-lg shadow-md">
                        <section>
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                                <h2 className="text-3xl font-bold dark:text-gray-300">รายการบูธ</h2>

                                <button
                                    onClick={() =>
                                        router.push(
                                            `/organizer/${organizerId}/event/${eventIdName}/booth/create`
                                        )
                                    }
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-400 transition mt-4 md:mt-0"
                                >
                                    + สร้างบูธใหม่
                                </button>
                            </div>
                        </section>

                        <section>
                            {error && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
                                    {error}
                                </div>
                            )}
                            
                            {booths && booths.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {booths.map((booth) => (
                                        <div 
                                            key={booth.booth_id} 
                                            className="bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition " //cursor-pointer"
                                            // onClick={() => router.push(`/organizer/${organizerId}/event/${eventIdName}/booth/${booth.id_name || booth.booth_id}`)}
                                        >
                                            {/* Booth Banner Image */}
                                            <div className="h-40 overflow-hidden">
                                                {booth.banner ? (
                                                    <img
                                                        src={booth.banner}
                                                        alt={`${booth.name} banner`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="h-full w-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center text-white">
                                                        <span className="text-3xl">🛒</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-5">
                                                <h3 className="text-xl font-semibold mb-2 truncate dark:text-gray-200">{booth.name}</h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                                                    {booth.description || "ไม่มีคำอธิบาย"}
                                                </p>
                                                
                                                {booth.capacity && (
                                                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                                                        <span className="mr-2">👥</span>
                                                        <span>ความจุ: {booth.capacity}</span>
                                                    </div>
                                                )}
                                                
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        router.push(`/organizer/${organizerId}/event/${eventIdName}/booth/${booth.id_name || booth.booth_id}`);
                                                    }}
                                                    className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 transition w-full text-center"
                                                >
                                                    จัดการบูธ
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                    <div className="text-4xl mb-4">🛒</div>
                                    <h3 className="text-xl font-medium mb-2">ยังไม่มีบูธ</h3>
                                    <p className="text-gray-600 dark:text-gray-400 mb-6">เพิ่มบูธเพื่อให้ผู้เข้าร่วมอีเวนต์สามารถลงทะเบียนเข้าร่วมได้</p>

                                    <button
                                        onClick={() => router.push(`/organizer/${organizerId}/event/${eventIdName}/booth/create`)}
                                        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 transition"
                                    >
                                        + สร้างบูธใหม่
                                    </button>
                                </div>
                            )}
                        </section>
                    </div>
                )}
            </div>
            <DeleteEventModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                eventId={eventId || eventIdName}
                eventName={eventName}
                organizerId={organizerId}
            />
        </>
    );
}
