"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import DeleteOrganizerModal from "@/ui/modals/DeleteOrganizerModal";
import ApproveOrganizerModal from "@/ui/modals/ApproveOrganizerModal";

export default function OrganizerDetailPage() {
    const { organizerId } = useParams();
    const router = useRouter();
    const { data: session } = useSession();

    // State for user data and admin check
    const [userData, setUserData] = useState(null);
    const [isSystemAdmin, setIsSystemAdmin] = useState(false);
    
    // State for approval confirmation modal
    const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);

    // State for organizer data
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [website, setWebsite] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");
    const [owner, setOwner] = useState("");
    const [ownerData, setOwnerData] = useState(null);
    const [approver, setApprover] = useState(null); // Add state for approver

    // State for delete organizer modal
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // New state for logo
    const [logo, setLogo] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);

    // State for events list
    const [events, setEvents] = useState([]);

    // State for UI
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    // Autosave states
    const saveStatusStyleEnum = {
        SUCCESS: "text-green-500 dark:text-green-400",
        WARNING: "text-yellow-500 dark:text-yellow-400",
        ERROR: "text-red-500 dark:text-red-400",
        LOADING: "text-blue-500 dark:text-blue-400",
    };

    const [saveStatus, setSaveStatus] = useState({
        message: "กำลังโหลดข้อมูล...",
        status: saveStatusStyleEnum.LOADING,
    });

    // Create a reference to store previous values for change detection
    const previousValues = useRef({
        name,
        description,
        website,
        email,
        phoneNumber,
        address,
        logo,
    });

    // Fetch organizer data
    useEffect(() => {
        const fetchOrganizerData = async () => {
            try {
                setLoading(true);
                const response = await fetch("/api/data/organizer/get/organizer_id", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ organizer_id: organizerId }),
                });

                if (response.status === 404) {
                    setNotFound(true);
                    setLoading(false);
                    return;
                }

                if (!response.ok) {
                    throw new Error("Failed to fetch organizer data");
                }

                const data = await response.json();

                if (!data.isSuccess) {
                    throw new Error(data.message || "Failed to fetch organizer data");
                }

                const organizerData = data.content;

                // Set organizer data to state
                setName(organizerData.name || "");
                setDescription(organizerData.description || "");
                setWebsite(organizerData.website || "");
                setEmail(organizerData.email || "");
                setPhoneNumber(organizerData.phone_number || "");
                setAddress(organizerData.address || "");
                setOwner(organizerData.owner || "");
                
                // Set logo if available
                if (organizerData.logo) {
                    setLogoPreview(organizerData.logo);
                }
                
                if (organizerData.ownerData) {
                    setOwnerData(organizerData.ownerData);
                }
                
                // Updated to use correct Events property name from API response
                if (organizerData.Events && Array.isArray(organizerData.Events)) {
                    setEvents(organizerData.Events);
                }

                // Set approver if available
                if (organizerData.approver) {
                    setApprover(organizerData.approver);
                }

                // Update previous values for change detection
                previousValues.current = {
                    name: organizerData.name || "",
                    description: organizerData.description || "",
                    website: organizerData.website || "",
                    email: organizerData.email || "",
                    phoneNumber: organizerData.phone_number || "",
                    address: organizerData.address || "",
                    logo: organizerData.logo || null,
                };

                setSaveStatus({
                    message: "ข้อมูลพร้อมแล้ว",
                    status: saveStatusStyleEnum.SUCCESS,
                });

            } catch (error) {
                console.error("Error fetching organizer data:", error);
                setError("เกิดข้อผิดพลาดในการโหลดข้อมูลองค์กร");
                setSaveStatus({
                    message: "เกิดข้อผิดพลาดในการโหลดข้อมูล",
                    status: saveStatusStyleEnum.ERROR,
                });
            } finally {
                setLoading(false);
            }
        };

        if (organizerId) {
            fetchOrganizerData();
        }
    }, [organizerId]);

    // Fetch user data to check if SystemAdmin
    useEffect(() => {
        const fetchUserData = async () => {
            if (userData) {
                return;
            }

            if (!session?.user?.email) {
                console.log("No session or email found");
                return;
            }

            try {
                const response = await fetch("/api/data/user/get/identity_email", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ identity_email: session.user.email }),
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch user data: ${response.status}`);
                }

                const data = await response.json();
                setUserData(data.content);
                
                // Check if user is SystemAdmin
                setIsSystemAdmin(data.content.SystemAdmin !== null);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, [session, userData]);

    // Function to handle file selection for logo
    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Set the file for future upload
            setLogo(file);

            // Create a preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result);
            };
            reader.readAsDataURL(file);

            // Update save status to show changes
            setSaveStatus({
                message: "มีการเปลี่ยนแปลง กรุณากดบันทึก",
                status: saveStatusStyleEnum.WARNING,
            });
        }
    };

    // Function to remove logo
    const handleRemoveLogo = () => {
        setLogo(null);
        setLogoPreview(null);
        setSaveStatus({
            message: "มีการเปลี่ยนแปลง กรุณากดบันทึก",
            status: saveStatusStyleEnum.WARNING,
        });
    };

    // Function to handle updates to organizer data
    const handleSave = async () => {
        try {
            setSaveStatus({
                message: "กำลังบันทึก...",
                status: saveStatusStyleEnum.LOADING,
            });

            const response = await fetch(`/api/data/organizer/update/${organizerId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    description,
                    website,
                    email,
                    phone_number: phoneNumber,
                    address,
                    owner,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to update organizer");
            }

            const result = await response.json();

            if (!result.isSuccess) {
                throw new Error(result.message || "Failed to update organizer");
            }

            // Update previous values after successful save
            previousValues.current = {
                name,
                description,
                website,
                email,
                phoneNumber,
                address,
                logo,
            };

            setSaveStatus({
                message: "บันทึกสำเร็จ",
                status: saveStatusStyleEnum.SUCCESS,
            });

            // Reset success status after 3 seconds
            setTimeout(() => {
                setSaveStatus({
                    message: "ข้อมูลถูกบันทึกแล้ว",
                    status: saveStatusStyleEnum.SUCCESS,
                });
            }, 3000);

        } catch (error) {
            console.error("Error updating organizer:", error);
            setError("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
            setSaveStatus({
                message: "เกิดข้อผิดพลาดในการบันทึก",
                status: saveStatusStyleEnum.ERROR,
            });
        }
    };

    // Function to handle approval of organizer
    const handleApproveOrganizer = async () => {
        try {
            const response = await fetch(`/api/data/organizer/approve/${organizerId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Failed to approve organizer");
            }

            const result = await response.json();

            if (!result.isSuccess) {
                throw new Error(result.message || "Failed to approve organizer");
            }

            setApprover(result.content.approver);
        } catch (error) {
            console.error("Error approving organizer:", error);
            setError("เกิดข้อผิดพลาดในการอนุมัติองค์กร");
        }
    };

    // Check for form changes
    useEffect(() => {
        const valuesChanged =
            previousValues.current.name !== name ||
            previousValues.current.description !== description ||
            previousValues.current.website !== website ||
            previousValues.current.email !== email ||
            previousValues.current.phoneNumber !== phoneNumber ||
            previousValues.current.address !== address ||
            previousValues.current.logo !== logo;

        if (valuesChanged) {
            setSaveStatus({
                message: "มีการเปลี่ยนแปลง กรุณากดบันทึก",
                status: saveStatusStyleEnum.WARNING,
            });
        }
    }, [name, description, website, email, phoneNumber, address, logo]);

    // Handle 404 Not Found
    if (notFound) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#5E9BD6] text-gray-700 dark:text-gray-300 px-6 dark:bg-gray-900">
                <h1 className="text-5xl font-extrabold mb-4">
                    404 Organizer Not Found
                </h1>
                <p className="text-lg mb-6">ไม่พบองค์กรที่คุณกำลังมองหา</p>
                <button
                    onClick={() => router.push("/organizer")}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 transition"
                >
                    กลับไปยังหน้าหลัก
                </button>
            </div>
        );
    }

    // Handle loading state
    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#5E9BD6] text-white px-6 dark:bg-gray-900">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold mb-4">กำลังโหลด...</h2>
                    <div className="w-16 h-16 border-4 border-blue-400 border-t-blue-200 rounded-full animate-spin mx-auto"></div>
                </div>
            </div>
        );
    }

    // Check if current user is the owner
    const isOwner = true; //session && session.user && session.user.id === owner;

    return (
        <div className="min-h-screen flex flex-col bg-[#5E9BD6] dark:bg-gray-900 text-gray-700 dark:text-white px-6">
            {/* Organization Info Section */}
            <div className="bg-white dark:bg-gray-800 p-8 lg:p-16 border-primary mt-5 flex flex-col w-full rounded-lg shadow-md">
                <div className="mb-8 mt-0">
                    <button
                        onClick={() => router.push("/organizer")}
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-medium transition flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        กลับไปยังหน้าหลัก
                    </button>
                </div>

                <div className="flex items-center gap-4 mb-6">
                    {/* Logo Section */}
                    <h1 className="text-4xl lg:text-5xl font-extrabold mb-4 md:mb-0">
                        ข้อมูลองค์กร
                    </h1>
                    
                    {/* Approval Status Badge */}
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${approver ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}>
                        {approver ? 'ได้รับการอนุมัติแล้ว' : 'รอการอนุมัติ'}
                    </div>
                    
                    {/* Approval Button for SystemAdmin */}
                    {isSystemAdmin && !approver && (
                        <button
                            onClick={() => setIsApprovalModalOpen(true)} 
                            className="ml-2 px-3 py-1 bg-green-600 text-white rounded-full text-sm font-medium hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-400 transition flex items-center gap-1"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            อนุมัติองค์กร
                        </button>
                    )}
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-6">
                        {error}
                    </div>
                )}

                <form className="space-y-6">
                    {/* Logo Upload Section */}
                    <div className="mb-8">
                        <div className="flex flex-col md:flex-row gap-8">
                            <div className="flex-shrink-0">
                                <div className="relative group">
                                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center shadow-lg">
                                        {logoPreview ? (
                                            <img
                                                src={logoPreview}
                                                alt="Organization logo"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="text-4xl text-gray-400 dark:text-gray-500">🏢</div>
                                        )}
                                    </div>
                                    {/* Label below the image */}
                                    <div className="text-center mt-2">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            โลโก้องค์กร
                                        </span>
                                    </div>
                                    {isOwner && (
                                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="text-white flex flex-col items-center">
                                                <label htmlFor="logo-upload" className="cursor-pointer p-2 hover:text-blue-300">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                                    </svg>
                                                    <span className="text-sm">อัพโหลดโลโก้</span>
                                                </label>
                                                <input
                                                    id="logo-upload"
                                                    name="logo"
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={handleLogoChange}
                                                    disabled={!isOwner}
                                                />
                                                {logoPreview && (
                                                    <button
                                                        type="button"
                                                        onClick={handleRemoveLogo}
                                                        className="cursor-pointer p-2 hover:text-red-300 text-center"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                        <span className="text-sm">ลบโลโก้</span>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex-grow flex flex-col gap-6 justify-center">
                                {/* Organizer Name */}
                                <div>
                                    <label
                                        htmlFor="organizer_name"
                                        className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2"
                                    >
                                        ชื่อองค์กร
                                    </label>
                                    <input
                                        type="text"
                                        id="organizer_name"
                                        name="organizer_name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="p-3 block w-full border-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:text-white"
                                        disabled={!isOwner}
                                        required
                                    />
                                </div>

                                {/* Website */}
                                <div>
                                    <label
                                        htmlFor="website"
                                        className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2"
                                    >
                                        เว็บไซต์
                                    </label>
                                    <input
                                        type="url"
                                        id="website"
                                        name="website"
                                        value={website}
                                        onChange={(e) => setWebsite(e.target.value)}
                                        className="p-3 block w-full border-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:text-white"
                                        disabled={!isOwner}
                                        placeholder="https://example.com"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2"
                            >
                                อีเมล
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="p-3 block w-full border-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:text-white"
                                disabled={!isOwner}
                                placeholder="contact@example.com"
                            />
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label
                                htmlFor="phone_number"
                                className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2"
                            >
                                เบอร์โทรติดต่อ
                            </label>
                            <input
                                type="tel"
                                id="phone_number"
                                name="phone_number"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className="p-3 block w-full border-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:text-white"
                                disabled={!isOwner}
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label
                            htmlFor="description"
                            className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2"
                        >
                            คำอธิบายองค์กร
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="4"
                            className="p-3 block w-full border-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:text-white"
                            disabled={!isOwner}
                        ></textarea>
                    </div>

                    {/* Address */}
                    <div>
                        <label
                            htmlFor="address"
                            className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2"
                        >
                            ที่อยู่
                        </label>
                        <textarea
                            id="address"
                            name="address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            rows="3"
                            className="p-3 block w-full border-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:text-white"
                            disabled={!isOwner}
                        ></textarea>
                    </div>

                    {/* Owner info - read only */}
                    {ownerData && (
                        <div>
                            <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                                ผู้ดูแลองค์กร
                            </p>
                            <p className="p-3 block w-full bg-gray-100 dark:bg-gray-700 rounded-md dark:text-white">
                                {ownerData.firstname} {ownerData.lastname} ({ownerData.display_name || ownerData.indentity_email})
                            </p>
                        </div>
                    )}

                    {/* Approver info - read only */}
                    {approver && (
                        <div>
                            <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                                รหัสผู้อนุมัติองค์กร
                            </p>
                            <p className="p-3 block w-full bg-gray-100 dark:bg-gray-700 rounded-md dark:text-white">
                                {approver}
                            </p>
                        </div>
                    )}

                    {/* Action buttons for owner */}
                    {isOwner && (
                        <div className="flex justify-end gap-4 pt-4">
                            <button
                                type="button"
                                onClick={() => setIsDeleteModalOpen(true)}
                                className="px-5 py-3 bg-red-600 text-white rounded-lg text-lg font-semibold hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-400 transition"
                            >
                                ลบองค์กร
                            </button>
                            <button
                                type="button"
                                onClick={handleSave}
                                className="px-5 py-3 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 transition"
                                disabled={saveStatus.status === saveStatusStyleEnum.SUCCESS}
                            >
                                บันทึกข้อมูล
                            </button>
                        </div>
                    )}
                </form>
            </div>

            {/* Events Section */}
            <div className="bg-white dark:bg-gray-800 p-8 lg:p-16 border-primary mt-8 flex flex-col w-full rounded-lg shadow-md">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <h2 className="text-3xl font-bold">อีเวนต์ขององค์กร</h2>

                    {isOwner && (
                        <button
                            onClick={() => router.push(`/organizer/${organizerId}/event/create`)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-400 transition mt-4 md:mt-0"
                        >
                            + สร้างอีเวนต์ใหม่
                        </button>
                    )}
                </div>

                {events && events.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.map((event) => (
                            <div 
                                key={event.event_id} 
                                className="bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition"
                            >
                                {/* Event Image Banner - Handle base64 or use placeholder */}
                                <div className="h-40 overflow-hidden">
                                    {event.banner ? (
                                        <img
                                            src={event.banner}
                                            alt={`${event.name} banner`}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="h-full w-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center text-white">
                                            <span className="text-3xl">🎭</span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-5">
                                    <h3 className="text-xl font-semibold mb-2 truncate">{event.name}</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                                        {event.description || "ไม่มีคำอธิบาย"}
                                    </p>
                                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                                        <span className="mr-2">📅</span>
                                        {event.start_date && event.end_date ? (
                                            <span>
                                                {new Date(event.start_date).toLocaleDateString('th-TH')} - {new Date(event.end_date).toLocaleDateString('th-TH')}
                                            </span>
                                        ) : (
                                            <span>{event.start_date ? new Date(event.start_date).toLocaleDateString('th-TH') : 'ไม่ระบุ'}</span>
                                        )}
                                    </div>
                                    <Link 
                                        href={`/organizer/${organizerId}/event/${event.id_name || event.event_id}`}
                                        className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 transition w-full text-center"
                                    >
                                        ดูรายละเอียด
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <div className="text-4xl mb-4">📅</div>
                        <h3 className="text-xl font-medium mb-2">ยังไม่มีอีเวนต์</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">คุณสามารถสร้างอีเวนต์แรกขององค์กรเพื่อเริ่มต้นการใช้งาน</p>

                        {isOwner && (
                            <button
                                onClick={() => router.push(`/organizer/${organizerId}/event/create`)}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 transition"
                            >
                                + สร้างอีเวนต์ใหม่
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Delete Organizer Modal */}
            <DeleteOrganizerModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                organizerId={organizerId}
                organizerName={name}
            />

            {/* Approve Organizer Modal */}
            <ApproveOrganizerModal
                isOpen={isApprovalModalOpen}
                onClose={() => setIsApprovalModalOpen(false)}
                onApprove={handleApproveOrganizer}
                organizerId={organizerId}
                organizerName={name}
            />
        </div>
    );
}