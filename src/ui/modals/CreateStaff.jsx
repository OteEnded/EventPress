"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from 'uuid';

export default function CreateStaff({ isOpen, onClose, eventIdName, availableBooths }) {
	const [isCreating, setIsCreating] = useState(false);
	const [error, setError] = useState("");
	const [emailError, setEmailError] = useState("");
	const router = useRouter();
	
	// Form state
	const [email, setEmail] = useState("");
	const [validUntil, setValidUntil] = useState("");
	const [note, setNote] = useState("");
	const [message, setMessage] = useState("");
	const [selectedBooths, setSelectedBooths] = useState([]);
	const [isPermanent, setIsPermanent] = useState(true);
	
	// Reset form when modal is closed
	useEffect(() => {
		if (!isOpen) {
			setEmail("");
			setValidUntil("");
			setNote("");
			setMessage("");
			setSelectedBooths([]);
			setIsPermanent(true);
			setError("");
			setEmailError("");
		}
	}, [isOpen]);
	
	// Set default expiration for non-permanent staff
	useEffect(() => {
		if (!isPermanent && !validUntil) {
			// Set default expiration to 1 month from now
			const date = new Date();
			date.setMonth(date.getMonth() + 1);
			
			// Format date to YYYY-MM-DDThh:mm
			const formattedDate = formatDateForInput(date);
			setValidUntil(formattedDate);
		}
	}, [isPermanent]);
	
	// Select all booths by default if there's only one
	useEffect(() => {
		if (availableBooths && availableBooths.length === 1) {
			setSelectedBooths([availableBooths[0].booth_id]);
		}
	}, [availableBooths]);

	if (!isOpen) return null;
	
	// Format date as YYYY-MM-DDThh:mm for datetime-local input
	const formatDateForInput = (date) => {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		const hours = String(date.getHours()).padStart(2, '0');
		const minutes = String(date.getMinutes()).padStart(2, '0');
		
		return `${year}-${month}-${day}T${hours}:${minutes}`;
	};
	
	const handleBoothToggle = (boothId) => {
		setSelectedBooths(prev => {
			if (prev.includes(boothId)) {
				return prev.filter(id => id !== boothId);
			} else {
				return [...prev, boothId];
			}
		});
	};
	
	const togglePermanent = () => {
		setIsPermanent(!isPermanent);
		if (!isPermanent) {
			setValidUntil("");
		} else {
			// Set default expiration to 1 month from now
			const date = new Date();
			date.setMonth(date.getMonth() + 1);
			const formattedDate = formatDateForInput(date);
			setValidUntil(formattedDate);
		}
	};

	const validateEmail = (email) => {
		if (!email) {
			setEmailError("");
			return true;
		}
		
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		const isValid = emailRegex.test(email);
		
		if (!isValid) {
			setEmailError("รูปแบบอีเมลไม่ถูกต้อง");
			return false;
		}
		
		setEmailError("");
		return true;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		
		// Validate email format first
		if (!validateEmail(email)) {
			return;
		}
		
		setIsCreating(true);
		setError("");

		try {
			// Get event ID from event ID name
			const eventResponse = await fetch("/api/data/event/get/event_id_name", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ event_id_name: eventIdName }),
			});
			
			if (!eventResponse.ok) {
				throw new Error("ไม่สามารถดึงข้อมูลอีเวนต์ได้");
			}
			
			const eventData = await eventResponse.json();
			
			if (!eventData.isSuccess || !eventData.content) {
				throw new Error("ไม่พบข้อมูลอีเวนต์");
			}
			
			const eventId = eventData.content.event_id;
			
			// Parse datetime to Date object if not permanent
			let expirationDate = null;
			if (!isPermanent && validUntil) {
				expirationDate = new Date(validUntil);
			}
			
			// Create staff data
			const staffData = {
				staff_tickets_id: uuidv4(), // Generate UUID for staff ticket
				verification_email: email || null,
				valid_until: isPermanent ? null : expirationDate,
				note: note || null,
				message: message || null,
				connected_user: null, // Will be set when a user claims the ticket
				Booths: selectedBooths,
				event: eventId
			};

			const response = await fetch("/api/data/staff/create", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(staffData),
			});

			const data = await response.json();

			if (!response.ok || !data.isSuccess) {
				throw new Error(data.message || "Failed to create staff");
			}

			// Reset form
			setEmail("");
			setValidUntil("");
			setNote("");
			setMessage("");
			setSelectedBooths([]);
			setIsPermanent(true);
			
			// Success, close modal and refresh
			onClose();
			
			// Force hard refresh to get the latest data
			window.location.reload();

		} catch (error) {
			console.error("Error creating staff:", error);
			setError(error.message || "เกิดข้อผิดพลาดในการสร้างสตาฟ");
		} finally {
			setIsCreating(false);
		}
	};

	return (
		<div className="fixed inset-0 flex items-center justify-center z-50">
			{/* Backdrop */}
			<div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>

			{/* Modal */}
			<div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto relative z-10">
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-2xl font-bold text-gray-800 dark:text-white">เพิ่มสตาฟใหม่</h1>
					<button 
						onClick={onClose}
						className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
					>
						<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>

				{error && (
					<div className="bg-red-100 border border-red-400 text-red-700 dark:bg-red-900/30 dark:text-red-300 px-4 py-3 rounded mb-4">
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label
							htmlFor="staff_email"
							className="block text-sm font-medium text-gray-700 dark:text-gray-300"
						>
							อีเมลสำหรับยืนยัน
						</label>
						<input
							type="email"
							id="staff_email"
							value={email}
							onChange={(e) => {
								setEmail(e.target.value);
								if (e.target.value) validateEmail(e.target.value);
							}}
							className={`mt-1 block w-full px-3 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border ${
								emailError ? "border-red-500 dark:border-red-500" : "border-gray-300 dark:border-gray-600"
							} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
							placeholder="example@email.com (ไม่บังคับ)"
							onBlur={() => validateEmail(email)}
						/>
						{emailError ? (
							<p className="text-sm text-red-500 dark:text-red-400 mt-1">{emailError}</p>
						) : email ? (
							<div className="flex items-center mt-1">
								<p className="text-sm text-gray-500 dark:text-gray-400">
									*สตาฟจะต้องยืนยันด้วยอีเมลนี้ก่อนเข้าใช้งาน
								</p>
								<span className="ml-2 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 text-xs px-2 py-1 rounded-full">
									ไม่สามารถแก้ไขภายหลัง
								</span>
							</div>
						) : (
							<div className="flex items-center mt-1">
								<p className="text-sm text-gray-500 dark:text-gray-400">
									*ผู้ใช้สามารถเข้าระบบโดยไม่ต้องยืนยันอีเมล
								</p>
								<span className="ml-2 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 text-xs px-2 py-1 rounded-full">
									ไม่สามารถแก้ไขภายหลัง
								</span>
							</div>
						)}
					</div>

					<div>
						<div className="flex items-center mb-2">
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mr-3">
								สิทธิ์หมดอายุเมื่อ
							</label>
							<label className="inline-flex items-center cursor-pointer">
								<input 
									type="checkbox" 
									className="sr-only peer" 
									checked={isPermanent}
									onChange={togglePermanent}
								/>
								<div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
								<span className="ms-3 text-sm font-medium text-gray-700 dark:text-gray-300">
									สตาฟถาวร
								</span>
							</label>
						</div>
						{!isPermanent && (
							<input
								type="datetime-local"
								value={validUntil}
								onChange={(e) => setValidUntil(e.target.value)}
								className="mt-1 block w-full px-3 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
							/>
						)}
						{isPermanent && (
							<p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
								สตาฟถาวรไม่มีวันหมดอายุ
							</p>
						)}
					</div>

					<div>
						<label
							htmlFor="note"
							className="block text-sm font-medium text-gray-700 dark:text-gray-300"
						>
							บันทึกสำหรับผู้จัดงาน
						</label>
						<textarea
							id="note"
							value={note}
							onChange={(e) => setNote(e.target.value)}
							rows="2"
							className="mt-1 block w-full px-3 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
							placeholder="หมายเหตุเกี่ยวกับสตาฟ (เห็นเฉพาะผู้จัดงาน)"
						></textarea>
					</div>

					<div>
						<label
							htmlFor="message"
							className="block text-sm font-medium text-gray-700 dark:text-gray-300"
						>
							ข้อความสำหรับสตาฟ
						</label>
						<div className="flex items-center">
							<textarea
								id="message"
								value={message}
								onChange={(e) => setMessage(e.target.value)}
								rows="2"
								className="mt-1 block w-full px-3 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
								placeholder="ข้อความที่จะแสดงให้สตาฟเห็น"
							></textarea>
						</div>
						<span className="text-sm bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 px-2 py-1 rounded-full mt-1 inline-block">
							ไม่สามารถแก้ไขภายหลัง
						</span>
					</div>
					
					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
							บูธที่สามารถเข้าถึงได้
						</label>
						
						{availableBooths && availableBooths.length > 0 ? (
							<div className="flex flex-wrap gap-2 mt-2">
								{availableBooths.map((booth) => (
									<div 
										key={booth.booth_id}
										onClick={() => handleBoothToggle(booth.booth_id)}
										className={`px-3 py-2 rounded-full border cursor-pointer transition-all duration-200 select-none ${
											selectedBooths.includes(booth.booth_id)
												? 'bg-blue-100 border-blue-500 text-blue-800 dark:bg-blue-900 dark:border-blue-400 dark:text-blue-200 font-medium'
												: 'bg-gray-100 border-gray-300 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
										}`}
									>
										<div className="flex items-center gap-1.5">
											{selectedBooths.includes(booth.booth_id) && (
												<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
													<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
												</svg>
											)}
											<span className="truncate max-w-[200px]">{booth.name}</span>
										</div>
									</div>
								))}
							</div>
						) : (
							<p className="text-yellow-500 dark:text-yellow-400 text-sm">ไม่มีบูธที่สามารถกำหนดสิทธิ์ได้ กรุณาสร้างบูธก่อน</p>
						)}
						
						{selectedBooths.length === 0 && availableBooths && availableBooths.length > 0 && (
							<p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
								<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-1" viewBox="0 0 20 20" fill="currentColor">
									<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
								</svg>
								สตาฟจะไม่สามารถเข้าถึงบูธใดๆ หากไม่มีการเลือกบูธ
							</p>
						)}
					</div>

					<div className="flex justify-end gap-4 pt-4">
						<button
							type="button"
							onClick={onClose}
							className="px-4 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded"
							disabled={isCreating}
						>
							ยกเลิก
						</button>
						<button
							type="submit"
							className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center"
							disabled={isCreating}
						>
							{isCreating ? (
								<>
									<svg
										className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
									>
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"
										></circle>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										></path>
									</svg>
									กำลังสร้าง...
								</>
							) : (
								"เพิ่มสตาฟ"
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
