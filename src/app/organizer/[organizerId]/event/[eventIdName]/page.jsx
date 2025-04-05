"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";

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

    // State for autosave and error handling
    const saveStatusStatusStyleEnum = {
        SUCCESS: "text-green-500 dark:text-green-400",
        WARNING: "text-yellow-500 dark:text-yellow-400",
        ERROR: "text-red-500 dark:text-red-400",
        LOADING: "text-blue-500 dark:text-blue-400",
    };
    const [saveStatus, setSaveStatus] = useState({
        message: "กรุณาตั้งชื่ออีเวนต์",
        status: saveStatusStatusStyleEnum.WARNING,
    });
    const [error, setError] = useState("");
    const [notFound, setNotFound] = useState(false); // For 404 handling

    // State for booths
    const [booths, setBooths] = useState([]); // Initialize empty booth data

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
            } catch (error) {
                console.error("Error fetching event data:", error);
                setError("An error occurred while fetching event data.");
            }
        };

        fetchEventData();
    }, [eventIdName]);

    // Create the autosave function with useCallback to prevent recreating it on every render
    const autosave = useCallback(async () => {
        console.log("Autosaving...");
        try {
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
                    : `/api/data/event/update/${eventIdName}`,
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
                        `/organizer/${organizerId}/event/${result.content.event_id}`
                    );
                }, 1000);

                return;
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
        } catch (error) {
            console.error("Error saving event data:", error);
            setSaveStatus({
                message: "เกิดข้อผิดพลาดในการบันทึก",
                status: saveStatusStatusStyleEnum.ERROR,
            });
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
        organizerId,
        eventIdName,
        router,
        saveStatusStatusStyleEnum,
    ]);

    // Use a separate effect for setting up the autosave timeout
    useEffect(() => {
        // Only create the timeout if autosave is needed
        if (notFound || (eventIdName === "create" && !eventName)) {
            return;
        }

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

        if (valuesChanged) {
            console.log(
                "Values changed, updating status and scheduling autosave"
            );

            // Update the status immediately
            setSaveStatus({
                message: "มีการแก้ไข กำลังบันทึก...",
                status: saveStatusStatusStyleEnum.WARNING,
            });

            // Update previous values
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
        notFound,
        eventIdName,
        saveStatusStatusStyleEnum,
    ]);

    // Use a separate effect JUST for the timeout to avoid conflicts
    useEffect(() => {
        if (notFound || (eventIdName === "create" && !eventName)) {
            return;
        }

        // This effect only handles the timeout, not checking for changes
        console.log("Setting up autosave timeout");
        const timeoutId = setTimeout(() => {
            console.log("Timeout triggered, executing autosave");
            autosave();
        }, 5000);

        // Clean up on unmount or when dependencies change
        return () => {
            console.log("Clearing timeout due to dependency change or unmount");
            clearTimeout(timeoutId);
        };
    }, [autosave, notFound, eventIdName, eventName]);

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
                                    onChange={(e) => setIdName(e.target.value)}
                                    className="mt-1 p-2 block w-full border-gray-300 bg-gray-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                />
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
                                        onChange={(e) =>
                                            setStartDate(e.target.value)
                                        }
                                        className="mt-1 p-2 block w-full border-gray-300 bg-gray-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        required
                                    />
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
                                        onChange={(e) =>
                                            setEndDate(e.target.value)
                                        }
                                        className="mt-1 p-2 block w-full border-gray-300 bg-gray-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    />
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
                                        onChange={(e) =>
                                            setStartTime(e.target.value)
                                        }
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
                                        onChange={(e) =>
                                            setEndTime(e.target.value)
                                        }
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
                                    onChange={(e) =>
                                        setEventPrice(e.target.value)
                                    }
                                    className="mt-1 p-2 block w-full border-gray-300 bg-gray-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                        {/* Action Buttons - Aligned to the right */}
                        <div className="flex justify-end gap-4 mt-6 mb-4">
                            <button className="px-3 py-3 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 transition">
                                ออกแบบหน้าเว็บ
                            </button>
                            <button className="px-3 py-3 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 transition">
                                จัดการสตาฟ
                            </button>
                        </div>
                    </section>
                </div>
                <div className="bg-gray-800 dark:bg-gray-700 text-white p-16 border-primary flex flex-col w-full">
                    <section>
                        <div className="px-4 py-2 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <h2 className="flex flex-col text-2xl font-extrabold mb-4">
                                    รายการบูธ
                                </h2>
                            </div>

                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() =>
                                        router.push(
                                            `/organizer/${organizerId}/event/${eventIdName}/booth/create`
                                        )
                                    }
                                    className="px-3 py-3 mt-3 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 transition"
                                >
                                    สร้างบูธ
                                </button>
                            </div>
                        </div>
                    </section>

                    <section className="mt-8">
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
                                {error}
                            </div>
                        )}
                        <div className="flex flex-col gap-4">
                            {booths.length > 0 ? (
                                booths.map((booth) => (
                                    <div
                                        key={booth.booth_id}
                                        className="bg-white text-gray-600 dark:text-gray-300 dark:bg-gray-900 p-4 rounded-lg shadow"
                                    >
                                        <h3 className="text-xl font-semibold">
                                            {booth.name}
                                        </h3>
                                        <p className="text-sm mt-2">
                                            {booth.description}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-400">
                                    ยังไม่มีบูธในอีเวนต์นี้
                                </p>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}
