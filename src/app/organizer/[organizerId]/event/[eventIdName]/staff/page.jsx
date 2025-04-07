"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import CreateStaff from "@/ui/modals/CreateStaff";
import EditStaffModal from "@/ui/modals/EditStaff";

// Add a helper function to format and shorten UUID
const shortenUuid = (uuid) => {
	if (!uuid) return "";
	// Extract just the first section of the UUID (before first dash)
	return uuid.split("-")[0];
};

// Add function to copy text to clipboard
const copyToClipboard = (text) => {
	navigator.clipboard.writeText(text)
		.then(() => {
			// Show temporary success message or toast notification
			setShowCopySuccess(true);
			setTimeout(() => setShowCopySuccess(false), 2000);
		})
		.catch(err => {
			console.error('Failed to copy: ', err);
		});
};

export default function OrganizerEventStaffIndexPage() {
	const { organizerId, eventIdName } = useParams();
	const router = useRouter();
	
	// State for staff list and selected staff
	const [staffList, setStaffList] = useState([]);
	const [selectedStaff, setSelectedStaff] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	
	// State for booth list
	const [boothList, setBoothList] = useState([]);
	
	// State for modals
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);

	// Add state for copy success message
	const [showCopySuccess, setShowCopySuccess] = useState(false);
	
	// Fetch staff data
	useEffect(() => {
		const fetchStaffData = async () => {
			try {
				setLoading(true);
				const response = await fetch("/api/data/staff/get/event_id_name", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ event_id_name: eventIdName }),
				});
				
				if (!response.ok) {
					throw new Error(`Failed to fetch staff data: ${response.status}`);
				}
				
				const data = await response.json();
				
				if (!data.isSuccess) {
					throw new Error(data.message || "Failed to fetch staff data");
				}
				
				setStaffList(data.content || []);
				
				// Select the first staff member if available
				if (data.content && data.content.length > 0) {
					setSelectedStaff(data.content[0]);
				}
				
			} catch (error) {
				console.error("Error fetching staff data:", error);
				setError(error.message || "An error occurred while fetching staff data");
			} finally {
				setLoading(false);
			}
		};
		
		// Fetch booth data for the event
		const fetchBoothData = async () => {
			try {
				const response = await fetch("/api/data/event/get/event_id_name", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ event_id_name: eventIdName }),
				});
				
				if (!response.ok) {
					throw new Error(`Failed to fetch booth data: ${response.status}`);
				}
				
				const data = await response.json();
				
				if (!data.isSuccess) {
					throw new Error(data.message || "Failed to fetch booth data");
				}
				
				setBoothList(data.content.Booths || []);
				
			} catch (error) {
				console.error("Error fetching booth data:", error);
				// Don't set error state here as it's not critical for the page to load
			}
		};
		
		if (eventIdName) {
			fetchStaffData();
			fetchBoothData();
		}
	}, [eventIdName]);

	// Handle opening the edit modal
	const handleEditStaff = () => {
		if (selectedStaff) {
			setIsEditModalOpen(true);
		}
	};

	return (
		<div className="min-h-screen flex flex-col bg-[#5E9BD6] text-gray-700 dark:bg-gray-900 px-6">
			<div className="bg-white dark:bg-gray-800 dark:text-white p-6 lg:p-12 border-primary mt-5 flex flex-col w-full rounded-lg shadow-md">
				{/* Header with Back Button */}
				<div className="mb-8">
					<button
						onClick={() => router.push(`/organizer/${organizerId}/event/${eventIdName}`)}
						className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-medium transition flex items-center gap-2"
					>
						<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
							<path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
						</svg>
						กลับไปยังอีเวนต์
					</button>
				</div>
			
				<div className="flex justify-between items-center mb-8">
					<h1 className="text-3xl font-bold">จัดการสตาฟ</h1>
					
					<button 
						onClick={() => setIsCreateModalOpen(true)}
						className="px-4 py-2 bg-blue-600 text-white rounded-lg text-base font-semibold hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 transition flex items-center gap-2"
					>
						<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
							<path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
						</svg>
						เพิ่มสตาฟ
					</button>
				</div>

				{/* Loading and Error States */}
				{loading && (
					<div className="flex justify-center items-center p-8">
						<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
					</div>
				)}
				
				{error && !loading && (
					<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
						<p>{error}</p>
					</div>
				)}

				{/* Staff Section - Split into Info and List */}
				{!loading && !error && (
					<div className="flex flex-col lg:flex-row gap-6">
						{/* Staff Info Section - 2/3 width on desktop */}
						<div className="lg:w-2/3 bg-gray-50 dark:bg-gray-700 rounded-lg p-6 shadow-md">
							{selectedStaff ? (
								<div className="space-y-4">
									<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
										<h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
											ข้อมูลสตาฟ
										</h2>
										<button 
											onClick={handleEditStaff}
											className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 transition mt-2 md:mt-0">
											จัดการสตาฟ
										</button>
									</div>
									
									{!selectedStaff.connected_user && (
										<div className="bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-500 p-4 mb-4">
											<div className="flex items-center">
												<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
												</svg>
												<p className="ml-3 text-yellow-700 dark:text-yellow-400 font-medium">
													ยังไม่มีผู้ใช้เชื่อมต่อกับสตาฟนี้ สตาฟยังไม่ได้ยอมรับคำเชิญ
												</p>
											</div>
										</div>
									)}
									
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<p className="text-sm text-gray-500 dark:text-gray-400">ชื่อ</p>
											{selectedStaff.connected_user ? (
												<p className="text-lg font-medium">
													{`${selectedStaff.connected_user?.UserProfile?.firstname || ''} ${selectedStaff.connected_user?.UserProfile?.lastname || ''}`}
													{selectedStaff.connected_user?.UserProfile?.display_name && 
														<span className="ml-1 text-gray-500 dark:text-gray-400">
															({selectedStaff.connected_user.UserProfile.display_name})
														</span>
													}
												</p>
											) : (
												<p className="text-lg text-gray-500 dark:text-gray-400 italic">
													<span className="font-medium text-orange-500">รอการเชื่อมต่อกับผู้ใช้</span>
												</p>
											)}
										</div>
										<div>
											<p className="text-sm text-gray-500 dark:text-gray-400">อีเมลสำหรับยืนยัน</p>
											<p className="text-lg">
												{selectedStaff.verification_email || 
													<span className="text-gray-500 dark:text-gray-400 italic">ไม่บังคับยืนยันด้วยอีเมล</span>
												}
											</p>
										</div>
									</div>
									
									<div>
										<p className="text-sm text-gray-500 dark:text-gray-400">รหัสสตาฟ</p>
										<div className="flex items-center mt-1">
											<p className="text-lg font-mono bg-gray-100 dark:bg-gray-800 p-1 px-2 rounded mr-2">
												{shortenUuid(selectedStaff.staff_tickets_id)}
											</p>
											<button
												onClick={() => copyToClipboard(selectedStaff.staff_tickets_id)}
												className="p-1.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md text-gray-700 dark:text-gray-300 transition"
												title="คัดลอกรหัสสตาฟทั้งหมด"
											>
												<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
												</svg>
											</button>
											{showCopySuccess && (
												<span className="ml-2 text-sm text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20 px-2 py-1 rounded-md">
													คัดลอกแล้ว
												</span>
											)}
										</div>
										<p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
											*รหัสนี้จะใช้สำหรับเชิญสตาฟ
										</p>
									</div>
									
									<div>
										<p className="text-sm text-gray-500 dark:text-gray-400 mt-4">บูธที่สามารถเข้าถึง</p>
										{selectedStaff.Booths && selectedStaff.Booths.length > 0 ? (
											<div className="mt-2 flex flex-wrap gap-2">
												{selectedStaff.Booths.map((booth) => (
													<span 
														key={booth.booth_id} 
														className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-sm font-medium px-3 py-1 rounded-full"
													>
														{booth.name}
													</span>
												))}
											</div>
										) : (
											<p className="text-gray-500 dark:text-gray-400 italic mt-2">ไม่มีบูธที่เข้าถึงได้</p>
										)}
									</div>
									
									<div>
										<p className="text-sm text-gray-500 dark:text-gray-400">หมายเหตุ</p>
										<p className="mt-1 text-base">
											{selectedStaff.note || 'ไม่มีหมายเหตุ'}
										</p>
									</div>
									
									{/* Expiration date section - handle null valid_until for permanent staff */}
									{selectedStaff.valid_until ? (
										<div>
											<p className="text-sm text-gray-500 dark:text-gray-400">สิทธิ์หมดอายุเมื่อ</p>
											<div className="flex items-center gap-2">
												<p className="text-base">
													{(() => {
														// Parse date without timezone adjustment
														const validUntil = new Date(selectedStaff.valid_until);
														
														// Format the date in Thai locale without timezone conversion
														const options = {
															year: 'numeric',
															month: 'long',
															day: 'numeric',
															hour: '2-digit',
															minute: '2-digit',
															timeZone: 'UTC' // Use UTC to avoid timezone conversion
														};
														
														return validUntil.toLocaleDateString('th-TH', options);
													})()}
												</p>
												{(() => {
													// Compare dates without timezone adjustment
													const validUntil = new Date(selectedStaff.valid_until);
													const now = new Date();
													
													// Set both dates to UTC for comparison
													const validUntilUTC = Date.UTC(
														validUntil.getUTCFullYear(),
														validUntil.getUTCMonth(),
														validUntil.getUTCDate(),
														validUntil.getUTCHours(),
														validUntil.getUTCMinutes(),
														validUntil.getUTCSeconds()
													);
													
													const nowUTC = Date.UTC(
														now.getUTCFullYear(),
														now.getUTCMonth(),
														now.getUTCDate(),
														now.getUTCHours(),
														now.getUTCMinutes(),
														now.getUTCSeconds()
													);
													
													if (validUntilUTC < nowUTC) {
														return (
															<span className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 text-xs font-medium px-2 py-1 rounded-full">
																หมดอายุแล้ว
															</span>
														);
													} else {
														return (
															<span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs font-medium px-2 py-1 rounded-full">
																ยังไม่หมดอายุ
															</span>
														);
													}
												})()}
											</div>
										</div>
									) : (
										<div>
											<p className="text-sm text-gray-500 dark:text-gray-400">สิทธิ์หมดอายุเมื่อ</p>
											<div className="flex items-center gap-2">
												<p className="text-base">ไม่มีวันหมดอายุ</p>
												<span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs font-medium px-2 py-1 rounded-full">
													สตาฟถาวร
												</span>
											</div>
										</div>
									)}
								</div>
							) : (
								<div className="flex flex-col items-center justify-center h-64">
									<svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
									</svg>
									<p className="mt-4 text-gray-500 dark:text-gray-400">
										{staffList.length === 0 ? "ยังไม่มีสตาฟในอีเวนต์นี้" : "เลือกสตาฟเพื่อดูรายละเอียด"}
									</p>
								</div>
							)}
						</div>
						
						{/* Staff List Section - 1/3 width on desktop */}
						<div className="lg:w-1/3 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-md max-h-[600px] overflow-y-auto">
							{staffList.length > 0 ? (
								<div className="divide-y divide-gray-200 dark:divide-gray-600">
									{staffList.map((staff) => (
										<div 
											key={staff.staff_tickets_id}
											className={`p-4 cursor-pointer transition-all duration-200 ${
												selectedStaff && selectedStaff.staff_tickets_id === staff.staff_tickets_id 
												? 'bg-blue-100 dark:bg-blue-600/50 shadow-md' 
												: 'hover:bg-gray-100 dark:hover:bg-gray-600'
											}`}
											onClick={() => setSelectedStaff(staff)}
										>
											<h3 className={`font-semibold ${
												selectedStaff && selectedStaff.staff_tickets_id === staff.staff_tickets_id
												? 'text-blue-700 dark:text-white' 
												: 'text-gray-800 dark:text-blue-300'
											}`}>
												{staff.connected_user ? (
													<>
														{staff.connected_user?.UserProfile?.firstname || ''} {staff.connected_user?.UserProfile?.lastname || 'ไม่ระบุชื่อ'}
													</>
												) : (
													<span className="italic text-orange-500">รอการเชื่อมต่อกับผู้ใช้</span>
												)}
											</h3>
											<p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
												{staff.connected_user?.identity_email || staff.verification_email || 'ไม่ระบุอีเมล'}
											</p>
											<div className="mt-1 flex flex-wrap items-center gap-2">
												<span className="text-xs text-gray-500 dark:text-gray-400">
													ดูแลบูธ: {staff.Booths && staff.Booths.length > 0 ? staff.Booths.length : 0} รายการ
												</span>
												
												{!staff.connected_user && (
													<span className="text-xs bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300 px-1.5 py-0.5 rounded-full">
														ยังไม่ได้รับการยอมรับ
													</span>
												)}
												
												{/* Add expiration status indicator */}
												{staff.valid_until ? (
													(() => {
														// Compare dates without timezone adjustment
														const validUntil = new Date(staff.valid_until);
														const now = new Date();
														
														// Set both dates to UTC for comparison
														const validUntilUTC = Date.UTC(
															validUntil.getUTCFullYear(),
															validUntil.getUTCMonth(),
															validUntil.getUTCDate(),
															validUntil.getUTCHours(),
															validUntil.getUTCMinutes(),
															validUntil.getUTCSeconds()
														);
														
														const nowUTC = Date.UTC(
															now.getUTCFullYear(),
															now.getUTCMonth(),
															now.getUTCDate(),
															now.getUTCHours(),
															now.getUTCMinutes(),
															now.getUTCSeconds()
														);
														
														if (validUntilUTC < nowUTC) {
															return (
																<span className="text-xs bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 px-1.5 py-0.5 rounded-full">
																	หมดอายุแล้ว
																</span>
															);
														} else {
															return (
																<span className="text-xs bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 px-1.5 py-0.5 rounded-full">
																	{new Date(staff.valid_until).toLocaleDateString('th-TH', {
																		day: 'numeric', 
																		month: 'short',
																		year: '2-digit',
																		timeZone: 'UTC'
																	})}
																</span>
															);
														}
													})()
												) : (
													<span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 px-1.5 py-0.5 rounded-full">
														ถาวร
													</span>
												)}
											</div>
										</div>
									))}
								</div>
							) : (
								<div className="p-8 text-center">
									<p className="text-gray-500 dark:text-gray-400">ยังไม่มีสตาฟในอีเวนต์นี้</p>
									<button 
										onClick={() => setIsCreateModalOpen(true)} 
										className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 transition"
									>
										เพิ่มสตาฟใหม่
									</button>
								</div>
							)}
						</div>
					</div>
				)}
			</div>
			
			{/* Modals */}
			<CreateStaff 
				isOpen={isCreateModalOpen} 
				onClose={() => setIsCreateModalOpen(false)} 
				eventIdName={eventIdName}
				availableBooths={boothList}
			/>
			
			{isEditModalOpen && selectedStaff && (
				<EditStaffModal
					isOpen={isEditModalOpen}
					onClose={() => setIsEditModalOpen(false)}
					staffId={selectedStaff.staff_tickets_id}
					initialData={selectedStaff}
					availableBooths={boothList}
				/>
			)}
		</div>
	);
}
