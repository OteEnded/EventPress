"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import DeleteBoothModal from "@/ui/modals/DeleteBoothModal";
import CreateActivity from "@/ui/modals/CreateActivity";
import EditActivity from "@/ui/modals/EditActivity";
import DeleteActivityModal from "@/ui/modals/DeleteActivityModal";

// Add custom CSS to hide number input spinners
const hideNumberInputSpinners = {
    WebkitAppearance: "none",
    MozAppearance: "textfield",
    appearance: "textfield",
    margin: 0
};

export default function OrganizerBoothManagePage() {
    const { organizerId, eventIdName, boothIdName } = useParams(); // Access route params
    const router = useRouter();

    // State for form fields
    const [boothName, setBoothName] = useState("");
    const [idName, setIdName] = useState("");
    const [boothDescription, setBoothDescription] = useState("");
    const [boothLocation, setBoothLocation] = useState("");
    const [contactInfo, setContactInfo] = useState("");
    const [capacity, setCapacity] = useState("");
    const [boothId, setBoothId] = useState(""); // Store the actual booth_id
    const [eventId, setEventId] = useState(""); // Store the actual event_id

    // State for activities
    const [activities, setActivities] = useState([]);

    // Create a reference to store previous values
    const previousValues = useRef({
        boothName,
        idName,
        boothDescription,
        boothLocation,
        contactInfo,
        capacity
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
        message: "กรุณาตั้งชื่อบูธ",
        status: saveStatusStatusStyleEnum.WARNING,
    });
    const [error, setError] = useState("");
    const [notFound, setNotFound] = useState(false); // For 404 handling
    
    // State for delete booth modal
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // State for activity modals
    const [isCreateActivityModalOpen, setIsCreateActivityModalOpen] = useState(false);
    const [isEditActivityModalOpen, setIsEditActivityModalOpen] = useState(false);
    const [isDeleteActivityModalOpen, setIsDeleteActivityModalOpen] = useState(false);
    const [selectedActivityId, setSelectedActivityId] = useState("");
    const [selectedActivityName, setSelectedActivityName] = useState("");
    const [selectedActivityData, setSelectedActivityData] = useState(null);

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

    // Fetch booth data and event ID
    useEffect(() => {
        const fetchEventData = async () => {
            try {
                // First fetch the actual event ID using event ID name
                const eventResponse = await fetch(
                    `/api/data/event/get/event_id_name`,
                    {
                        method: "POST",
                        body: JSON.stringify({ event_id_name: eventIdName }),
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
                
                if (!eventResponse.ok) {
                    console.error("Error fetching event data");
                    return;
                }
                
                const eventData = await eventResponse.json();
                if (eventData.isSuccess && eventData.content && eventData.content.event_id) {
                    setEventId(eventData.content.event_id);
                }
            } catch (error) {
                console.error("Error fetching event ID:", error);
            }
        };

        const fetchBoothData = async () => {
            if (boothIdName === "create") return; // Skip fetching for create mode

            try {
                const response = await fetch(
                    `/api/data/booth/get/booth_id_name`,
                    {
                        method: "POST",
                        body: JSON.stringify({ 
                            booth_id_name: boothIdName,
                            event_id: eventIdName
                        }),
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
                    throw new Error("Failed to fetch booth data");
                }
                const data = await response.json();
                
                // Set booth data to state
                setBoothName(data.content.name || "");
                setIdName(data.content.id_name || "");
                setBoothDescription(data.content.description || "");
                setBoothLocation(data.content.location || "");
                setContactInfo(data.content.contact_info || "");
                setCapacity(data.content.capacity || "");
                setBoothId(data.content.booth_id || ""); // Set the actual booth_id
                setEventId(data.content.event || ""); // Set the event ID
                setActivities(data.content.Activities || []); // Set activities
            } catch (error) {
                console.error("Error fetching booth data:", error);
                setError("An error occurred while fetching booth data.");
            }
        };

        // First fetch event ID, then fetch booth data if needed
        fetchEventData().then(() => {
            if (boothIdName !== "create") {
                fetchBoothData();
            }
        });
    }, [boothIdName, eventIdName]);

    // Autosave functionality
    useEffect(() => {
        // Skip on first render to avoid unnecessary save
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        // Skip autosave if we have a 404 error or on empty create mode
        if (notFound || (boothIdName === "create" && !boothName)) return;

        // Check if values have changed since last render
        const valuesChanged =
            previousValues.current.boothName !== boothName ||
            previousValues.current.idName !== idName ||
            previousValues.current.boothDescription !== boothDescription ||
            previousValues.current.boothLocation !== boothLocation ||
            previousValues.current.contactInfo !== contactInfo ||
            previousValues.current.capacity !== capacity;

        // Only update status and set timeout if values have changed
        if (valuesChanged) {
            // Clear any existing timeout to prevent multiple saves
            if (timeoutIdRef.current) {
                clearTimeout(timeoutIdRef.current);
                timeoutIdRef.current = null;
            }

            // Update the "pending save" status
            setSaveStatus({
                message: "มีการแก้ไข กำลังบันทึก...",
                status: saveStatusStatusStyleEnum.WARNING,
            });

            // Update the ref with current values for next comparison
            previousValues.current = {
                boothName,
                idName,
                boothDescription,
                boothLocation,
                contactInfo,
                capacity,
            };

            // Define autosave function to be called after timeout
            const performAutosave = async () => {
                try {
                    // If we don't have the event ID yet (especially in create mode), fetch it first
                    let actualEventId = eventId;
                    if (!actualEventId && eventIdName !== "create") {
                        try {
                            const eventResponse = await fetch(
                                `/api/data/event/get/event_id_name`,
                                {
                                    method: "POST",
                                    body: JSON.stringify({ event_id_name: eventIdName }),
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                }
                            );
                            
                            if (eventResponse.ok) {
                                const eventData = await eventResponse.json();
                                if (eventData.isSuccess && eventData.content && eventData.content.event_id) {
                                    actualEventId = eventData.content.event_id;
                                    setEventId(actualEventId);
                                }
                            }
                        } catch (error) {
                            console.error("Failed to fetch event ID:", error);
                            setSaveStatus({
                                message: "เกิดข้อผิดพลาดในการบันทึก: ไม่สามารถอ้างอิงอีเวนต์ได้",
                                status: saveStatusStatusStyleEnum.ERROR,
                            });
                            timeoutIdRef.current = null;
                            return;
                        }
                    }

                    // Check if we have a valid event ID
                    if (!actualEventId) {
                        console.error("No valid event ID available");
                        setSaveStatus({
                            message: "เกิดข้อผิดพลาดในการบันทึก: ไม่สามารถอ้างอิงอีเวนต์ได้",
                            status: saveStatusStatusStyleEnum.ERROR,
                        });
                        timeoutIdRef.current = null;
                        return;
                    }

                    const payload = {
                        name: boothName,
                        id_name: idName,
                        description: boothDescription,
                        location: boothLocation,
                        contact_info: contactInfo,
                        capacity,
                        event: actualEventId, // Use the actual event UUID, not the ID name
                    };

                    const response = await fetch(
                        boothIdName === "create"
                            ? "/api/data/booth/create"
                            : `/api/data/booth/update/${boothId || boothIdName}`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(payload),
                        }
                    );

                    if (!response.ok) {
                        throw new Error("Failed to save booth data");
                    }

                    const result = await response.json();

                    // Redirect to the booth page if we were in create mode and got a successful response
                    if (
                        boothIdName === "create" &&
                        result.isSuccess &&
                        result.content &&
                        result.content.booth_id
                    ) {
                        setSaveStatus({
                            message: "บันทึกสำเร็จ กำลังเปลี่ยนเส้นทาง...",
                            status: saveStatusStatusStyleEnum.SUCCESS,
                        });

                        // Short delay to show success message before redirect
                        setTimeout(() => {
                            router.replace(
                                `/organizer/${organizerId}/event/${eventIdName}/booth/${result.content.id_name || result.content.booth_id}`
                            );
                        }, 1000);

                        return;
                    }

                    // Check if the id_name has changed and we need to redirect
                    if (
                        boothIdName !== "create" &&
                        result.isSuccess
                    ) {
                        // Case 1: id_name is removed but URL still has old id_name
                        const idNameWasRemoved = (!idName || idName.trim() === '') && 
                                            boothIdName !== boothId && 
                                            boothId;
                                            
                        // Case 2: id_name was changed to something different
                        const idNameWasChanged = idName && 
                                            idName.trim() !== '' && 
                                            idName !== boothIdName;
                        
                        if (idNameWasRemoved || idNameWasChanged) {
                            setSaveStatus({
                                message: "บันทึกสำเร็จ กำลังเปลี่ยนเส้นทาง...",
                                status: saveStatusStatusStyleEnum.SUCCESS,
                            });

                            // Short delay to show success message before redirect
                            setTimeout(() => {
                                // If id_name was removed, use the booth_id for the URL
                                // If id_name was changed to something else, use the new id_name
                                const newPath = idNameWasRemoved 
                                    ? `/organizer/${organizerId}/event/${eventIdName}/booth/${boothId}`
                                    : `/organizer/${organizerId}/event/${eventIdName}/booth/${idName}`;
                                    
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
                    console.error("Error saving booth data:", error);
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
        boothName,
        idName,
        boothDescription,
        boothLocation,
        contactInfo,
        capacity,
        boothIdName,
        eventIdName,
        organizerId,
        router,
        saveStatusStatusStyleEnum,
        notFound,
        boothId,
        eventId,
    ]);

    // Ensure cleanup when component unmounts
    useEffect(() => {
        return () => {
            if (timeoutIdRef.current) {
                clearTimeout(timeoutIdRef.current);
            }
        };
    }, []);

    // Handle 404 Booth Not Found
    if (notFound) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#5E9BD6] text-gray-700 dark:text-gray-300 px-6 dark:bg-gray-900">
                <h1 className="text-5xl font-extrabold mb-4">
                    404 Booth Not Found
                </h1>
                <p className="text-lg mb-6">ไม่พบบูธที่คุณกำลังมองหา</p>
                <button
                    onClick={() => router.push(`/organizer/${organizerId}/event/${eventIdName}#booths`)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 transition"
                >
                    กลับไปยังหน้าอีเวนต์
                </button>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen flex flex-col bg-[#5E9BD6] text-gray-700 dark:bg-gray-900 px-6">
                <div className="bg-white dark:bg-gray-800 dark:text-white p-16 border-primary mt-5 flex flex-col w-full">
                    <div className="mb-8 mt-0">
                        <button
                            onClick={() => router.push(`/organizer/${organizerId}/event/${eventIdName}#booths`)}
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
                            กลับไปยังหน้าอีเวนต์
                        </button>
                    </div>
                    <h1 className="flex flex-col text-5xl font-extrabold mb-4 items-center">
                        {boothIdName === "create"
                            ? "สร้างบูธ"
                            : "ข้อมูลบูธ"}
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
                                className={`text-right text-sm mb-4 ${saveStatus.status}`}
                            >
                                {`สถานะการบันทึก: ${saveStatus.message}`}
                            </div>

                            {/* Booth Name */}
                            <div className="mb-4">
                                <label
                                    htmlFor="booth_name"
                                    className="block text-lg font-medium text-gray-700 dark:text-gray-300"
                                >
                                    ชื่อบูธ
                                </label>
                                <input
                                    type="text"
                                    id="booth_name"
                                    name="booth_name"
                                    value={boothName}
                                    onChange={(e) => setBoothName(e.target.value)}
                                    className="mt-1 p-2 block w-full border-gray-300 bg-gray-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    required
                                />
                            </div>

                            {/* Booth ID Name */}
                            <div className="mb-4">
                                <label
                                    htmlFor="id_name"
                                    className="block text-lg font-medium text-gray-700 dark:text-gray-300"
                                >
                                    รหัสบูธ (ID Name)
                                </label>
                                <input
                                    type="text"
                                    id="id_name"
                                    name="id_name"
                                    value={idName}
                                    onChange={handleIdNameChange}
                                    className="mt-1 p-2 block w-full border-gray-300 bg-gray-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="ชื่อที่สั้นๆ ที่ใช้เรียกบูธใน URL เช่น science_booth"
                                />
                                <p id="id-name-error" className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    ใช้ได้เฉพาะตัวอักษรภาษาอังกฤษ, ตัวเลข, ขีดล่าง (_) และเครื่องหมายขีด (-) เท่านั้น
                                </p>
                            </div>

                            {/* Booth Description */}
                            <div className="mb-4">
                                <label
                                    htmlFor="booth_description"
                                    className="block text-lg font-medium text-gray-700 dark:text-gray-300"
                                >
                                    รายละเอียดบูธ
                                </label>
                                <textarea
                                    id="booth_description"
                                    name="booth_description"
                                    value={boothDescription}
                                    onChange={(e) => setBoothDescription(e.target.value)}
                                    rows="4"
                                    className="mt-1 p-2 block w-full border-gray-300 bg-gray-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    required
                                ></textarea>
                            </div>

                            {/* Booth Location */}
                            <div className="mb-4">
                                <label
                                    htmlFor="booth_location"
                                    className="block text-lg font-medium text-gray-700 dark:text-gray-300"
                                >
                                    สถานที่บูธ
                                </label>
                                <input
                                    type="text"
                                    id="booth_location"
                                    name="booth_location"
                                    value={boothLocation}
                                    onChange={(e) => setBoothLocation(e.target.value)}
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
                                    onChange={(e) => setContactInfo(e.target.value)}
                                    className="mt-1 p-2 block w-full border-gray-300 bg-gray-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                />
                            </div>

                            {/* Booth Capacity */}
                            <div className="mb-4">
                                <label
                                    htmlFor="capacity"
                                    className="block text-lg font-medium text-gray-700 dark:text-gray-300"
                                >
                                    จำนวนที่รับ
                                </label>
                                <input
                                    type="text"
                                    id="capacity"
                                    name="capacity"
                                    value={capacity}
                                    onChange={(e) => setCapacity(e.target.value)}
                                    className="mt-1 p-2 block w-full border-gray-300 bg-gray-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                />
                            </div>
                        </form>
                        {/* Action Buttons - Aligned to the right with delete button on the left */}
                        <div className="flex justify-between mt-6 mb-4">
                            {/* Delete button on the left */}
                            <div>
                                {boothIdName !== "create" && (
                                    <button 
                                        onClick={() => setIsDeleteModalOpen(true)}
                                        className="px-3 py-3 bg-red-600 text-white rounded-lg text-lg font-semibold hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-400 transition"
                                    >
                                        ลบบูธ
                                    </button>
                                )}
                            </div>
                            
                            {/* Other action buttons on the right */}
                            <div className="flex gap-4">
                                {/* Removed the duplicate "สร้างกิจกรรม" button */}
                            </div>
                        </div>
                    </section>
                </div>
                
                {/* Only show activities section when not in create mode */}
                {boothIdName !== "create" && (
                    <div className="bg-white dark:bg-gray-800 p-8 lg:p-16 border-primary mt-5 flex flex-col w-full rounded-lg shadow-md">
                        <section>
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                                <h2 className="text-3xl font-bold text-gray-700 dark:text-gray-100">รายการกิจกรรม</h2>

                                <button
                                    onClick={() => setIsCreateActivityModalOpen(true)}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-400 transition mt-4 md:mt-0"
                                >
                                    + สร้างกิจกรรมใหม่
                                </button>
                            </div>
                        </section>

                        <section>
                            {error && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
                                    {error}
                                </div>
                            )}
                            
                            {activities && activities.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {activities.map((activity) => (
                                        <div 
                                            key={activity.activity_id} 
                                            className="bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition cursor-pointer flex flex-col h-full"
                                        >
                                            <div className="p-5 flex flex-col flex-grow">
                                                <h3 className="text-xl font-semibold mb-2 truncate flex items-center text-gray-700 dark:text-gray-200">
                                                    <span className="text-xl mr-2">🎯</span>
                                                    {activity.name}
                                                </h3>
                                                
                                                <div className="bg-gray-200 dark:bg-gray-600 h-0.5 w-full mb-3"></div>
                                                
                                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-4">
                                                    {activity.description || "ไม่มีคำอธิบาย"}
                                                </p>
                                                
                                                {/* Activity details */}
                                                <div className="space-y-2 mt-auto mb-4">
                                                    {activity.location && (
                                                        <div className="flex items-start text-sm text-gray-500 dark:text-gray-400">
                                                            <span className="mr-2 flex-shrink-0">📍</span>
                                                            <span className="break-words">{activity.location}</span>
                                                        </div>
                                                    )}
                                                    
                                                    {(activity.start_time || activity.end_time) && (
                                                        <div className="flex items-start text-sm text-gray-500 dark:text-gray-400">
                                                            <span className="mr-2 flex-shrink-0">🕒</span>
                                                            <span>
                                                                {activity.start_time && activity.end_time ? 
                                                                    `${activity.start_time.slice(0, 5)} - ${activity.end_time.slice(0, 5)}` : 
                                                                    activity.start_time ? activity.start_time.slice(0, 5) : activity.end_time.slice(0, 5)}
                                                            </span>
                                                        </div>
                                                    )}
                                                    
                                                    {activity.price > 0 ? (
                                                        <div className="flex items-start text-sm text-gray-500 dark:text-gray-400">
                                                            <span className="mr-2 flex-shrink-0">💰</span>
                                                            <span>{activity.price} บาท</span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-start text-sm text-green-500 dark:text-green-400">
                                                            <span className="mr-2 flex-shrink-0">✓</span>
                                                            <span>เข้าร่วมฟรี</span>
                                                        </div>
                                                    )}
                                                    
                                                    {/* Add more details - Created/Updated timestamp */}
                                                    {activity.created_at && (
                                                        <div className="flex items-start text-sm text-gray-500 dark:text-gray-400">
                                                            <span className="mr-2 flex-shrink-0">🆕</span>
                                                            <span>สร้างเมื่อ: {new Date(activity.created_at).toLocaleString('th-TH', {
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: 'numeric',
                                                            })}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                <div className="mt-auto">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedActivityId(activity.activity_id);
                                                            setSelectedActivityName(activity.name);
                                                            setSelectedActivityData(activity);
                                                            setIsEditActivityModalOpen(true);
                                                        }}
                                                        className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 transition w-full text-center"
                                                    >
                                                        จัดการกิจกรรม
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                    <div className="text-4xl mb-4">🎯</div>
                                    <h3 className="text-xl font-medium mb-2">ยังไม่มีกิจกรรม</h3>
                                    <p className="text-gray-600 dark:text-gray-400 mb-6">เพิ่มกิจกรรมเพื่อให้ผู้เข้าร่วมบูธได้มีส่วนร่วม</p>

                                    <button
                                        onClick={() => setIsCreateActivityModalOpen(true)}
                                        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 transition"
                                    >
                                        + สร้างกิจกรรมใหม่
                                    </button>
                                </div>
                            )}
                        </section>
                    </div>
                )}
            </div>
            
            {/* Delete Booth Modal */}
            {boothIdName !== "create" && (
                <DeleteBoothModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    boothId={boothId || boothIdName}
                    boothName={boothName}
                    eventIdName={eventIdName}
                    organizerId={organizerId}
                />
            )}
            
            {/* Activity Modals */}
            <CreateActivity 
                isOpen={isCreateActivityModalOpen}
                onClose={() => setIsCreateActivityModalOpen(false)}
                boothId={boothId || boothIdName}
            />
            
            <EditActivity
                isOpen={isEditActivityModalOpen}
                onClose={() => setIsEditActivityModalOpen(false)}
                activityId={selectedActivityId}
                initialData={selectedActivityData}
            />
            
            <DeleteActivityModal
                isOpen={isDeleteActivityModalOpen}
                onClose={() => setIsDeleteActivityModalOpen(false)}
                activityId={selectedActivityId}
                activityName={selectedActivityName}
                boothId={boothId || boothIdName}
            />
        </>
    );
}
