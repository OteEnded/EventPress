"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DeleteStaffModal from "./DeleteStaffModal";

export default function EditStaffModal({ isOpen, onClose, staffId, initialData, availableBooths }) {
	const [isUpdating, setIsUpdating] = useState(false);
	const [isFetching, setIsFetching] = useState(false);
	const [error, setError] = useState("");
	const router = useRouter();
	
	// Form state
	const [verificationEmail, setVerificationEmail] = useState("");
	const [validUntil, setValidUntil] = useState("");
	const [note, setNote] = useState("");
	const [message, setMessage] = useState("");
	const [selectedBooths, setSelectedBooths] = useState([]);
	const [connectedUser, setConnectedUser] = useState(null);
	const [isPermanent, setIsPermanent] = useState(false);
	
	// State for delete modal
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	
	// Reset form when modal is opened with initialData
	useEffect(() => {
		if (isOpen && initialData) {
			populateForm(initialData);
		} else if (isOpen && staffId && !initialData) {
			fetchStaffData();
		}
	}, [isOpen, initialData, staffId]);
	
	// Format date as YYYY-MM-DDThh:mm for datetime-local input
	const formatDateForInput = (date) => {
		if (!date) return "";
		
		const dateObj = new Date(date);
		const year = dateObj.getFullYear();
		const month = String(dateObj.getMonth() + 1).padStart(2, '0');
		const day = String(dateObj.getDate()).padStart(2, '0');
		const hours = String(dateObj.getHours()).padStart(2, '0');
		const minutes = String(dateObj.getMinutes()).padStart(2, '0');
		
		return `${year}-${month}-${day}T${hours}:${minutes}`;
	};
	
	const fetchStaffData = async () => {
		setIsFetching(true);
		setError("");
		
		try {
			const response = await fetch("/api/data/staff/get/staff_ticket_id", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ staff_tickets_id: staffId }),
			});
			
			const data = await response.json();
			
			if (!response.ok || !data.isSuccess) {
				throw new Error(data.message || "Failed to fetch staff data");
			}
			
			// Populate form with staff data
			populateForm(data.content);
			
		} catch (error) {
			console.error("Error fetching staff data:", error);
			setError(error.message || "เกิดข้อผิดพลาดในการโหลดข้อมูลสตาฟ");
		} finally {
			setIsFetching(false);
		}
	};
	
	const populateForm = (data) => {
		setVerificationEmail(data.verification_email || "");
		
		if (data.valid_until) {
			setValidUntil(formatDateForInput(data.valid_until));
			setIsPermanent(false);
		} else {
			setValidUntil("");
			setIsPermanent(true);
		}
		
		setNote(data.note || "");
		setMessage(data.message || "");
		
		// Handle connected user if present
		setConnectedUser(data.connected_user || null);
		
		// Handle booth permissions
		const boothIds = data.Booths ? 
			data.Booths.map(booth => booth.booth_id || booth) : 
			[];
		setSelectedBooths(boothIds);
	};
	
	if (!isOpen) return null;
	
	const handleBoothToggle = (boothId) => {
		setSelectedBooths(prev => {
			if (prev.includes(boothId)) {
				return prev.filter(id => id !== boothId);
			} else {
				return [...prev, boothId];
			}
		});
	};
	
	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsUpdating(true);
		setError("");
		
		try {
			// Parse datetime to Date object if not permanent
			let expirationDate = null;
			if (!isPermanent && validUntil) {
				expirationDate = new Date(validUntil);
			}
			
			const staffData = {
				verification_email: verificationEmail || null, // Keep the original value (can't be edited)
				valid_until: isPermanent ? null : expirationDate,
				note: note || null,
				message: message || null, // Keep the original value (can't be edited)
				Booths: selectedBooths // This already handles empty array case
			};
			
			const response = await fetch(`/api/data/staff/update/${staffId}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(staffData),
			});
			
			const data = await response.json();
			
			if (!response.ok || !data.isSuccess) {
				throw new Error(data.message || "Failed to update staff");
			}
			
			// Success, close modal and refresh
			onClose();
			
			// Force hard refresh instead of router.refresh()
			window.location.reload();
			
		} catch (error) {
			console.error("Error updating staff:", error);
			setError(error.message || "เกิดข้อผิดพลาดในการแก้ไขข้อมูลสตาฟ");
		} finally {
			setIsUpdating(false);
		}
	};
	
	const handleDelete = () => {
		setIsDeleteModalOpen(true);
	};
	
	const togglePermanent = () => {
		setIsPermanent(!isPermanent);
		if (!isPermanent) {
			setValidUntil("");
		} else {
			// Set default expiration to 1 month from now
			const date = new Date();
			date.setMonth(date.getMonth() + 1);
			setValidUntil(formatDateForInput(date));
		}
	};
	
	// Format staff name for display
	const getStaffDisplayName = () => {
		if (connectedUser && connectedUser.UserProfile && connectedUser.UserProfile.firstname) {
			let displayName = `${connectedUser.UserProfile.firstname} ${connectedUser.UserProfile.lastname || ''}`;
			if (connectedUser.UserProfile.display_name) {
				displayName += ` (${connectedUser.UserProfile.display_name})`;
			}
			return displayName;
		} else if (connectedUser && connectedUser.identity_email) {
			return connectedUser.identity_email;
		} else if (verificationEmail) {
			return verificationEmail;
		} else {
			return `Staff #${staffId.substring(0, 8)}...`;
		}
	};
	
	return (
		<div className="fixed inset-0 flex items-center justify-center z-50">
			{/* Backdrop */}
			<div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
			
			{/* Modal */}
			<div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto relative z-10">
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-2xl font-bold text-gray-800 dark:text-white">แก้ไขข้อมูลสตาฟ</h1>
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
				
				{isFetching ? (
					<div className="flex items-center justify-center py-10">
						<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
					</div>
				) : (
					<form onSubmit={handleSubmit} className="space-y-4">
						{connectedUser ? (
							<div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 mb-4">
								<div className="flex items-center">
									<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
									</svg>
									<p className="ml-3 text-blue-700 dark:text-blue-400 font-medium">
										สตาฟนี้เชื่อมต่อกับผู้ใช้ <strong>{getStaffDisplayName()}</strong>
									</p>
								</div>
							</div>
						) : (
							<div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 mb-4">
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
						
						<div>
							<label
								htmlFor="verification_email"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300"
							>
								อีเมลสำหรับยืนยัน
							</label>
							<input
								type="email"
								id="verification_email"
								value={verificationEmail}
								disabled
								className="mt-1 block w-full px-3 py-2 text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none sm:text-sm cursor-not-allowed"
							/>
							<div className="flex items-center mt-1">
								<p className="text-sm text-red-500 dark:text-red-400">
									ไม่สามารถแก้ไขอีเมลสำหรับยืนยันได้หลังจากสร้างสตาฟแล้ว
								</p>
							</div>
							{verificationEmail ? (
								<div className="mt-1 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 text-blue-700 dark:text-blue-300">
									<p className="text-sm">
										สตาฟจะต้องยืนยันด้วยอีเมล <strong>{verificationEmail}</strong> ก่อนเข้าใช้งาน
									</p>
								</div>
							) : (
								<div className="mt-1 px-3 py-2 bg-gray-50 dark:bg-gray-700/50 border-l-4 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400">
									<p className="text-sm">
										สตาฟสามารถเข้าใช้งานได้โดยไม่ต้องยืนยันอีเมล
									</p>
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
									placeholder="เลือกวันที่และเวลาหมดอายุ"
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
								หมายเหตุ (สำหรับผู้จัดงาน)
							</label>
							<textarea
								id="note"
								value={note}
								onChange={(e) => setNote(e.target.value)}
								rows="2"
								placeholder="หมายเหตุเกี่ยวกับสตาฟคนนี้"
								className="mt-1 block w-full px-3 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
							></textarea>
						</div>
						
						<div>
							<label
								htmlFor="message"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300"
							>
								ข้อความ (สำหรับสตาฟ)
							</label>
							<textarea
								id="message"
								value={message}
								disabled
								rows="2"
								className="mt-1 block w-full px-3 py-2 text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none sm:text-sm cursor-not-allowed"
							></textarea>
							<p className="text-sm text-red-500 dark:text-red-400 mt-1">
								ไม่สามารถแก้ไขข้อความสำหรับสตาฟได้หลังจากสร้างสตาฟแล้ว
							</p>
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
														<path fillRule="evenodd" d="M10 18a8 8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
													</svg>
												)}
												<span className="truncate max-w-[200px]">{booth.name}</span>
											</div>
										</div>
									))}
								</div>
							) : (
								<p className="text-gray-500 dark:text-gray-400 text-sm italic">ไม่มีบูธที่สามารถกำหนดสิทธิ์ได้</p>
							)}
							
							{selectedBooths.length === 0 && availableBooths && availableBooths.length > 0 && (
								<p className="text-yellow-500 dark:text-yellow-400 text-sm mt-2">
									<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
									</svg>
									สตาฟจะไม่สามารถเข้าถึงบูธใดได้เลย
								</p>
							)}
						</div>
						
						<div className="flex justify-between gap-4 pt-4">
							<button
								type="button"
								onClick={handleDelete}
								className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
								disabled={isUpdating}
							>
								ลบสตาฟ
							</button>
							
							<div className="flex gap-4">
								<button
									type="button"
									onClick={onClose}
									className="px-4 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded"
									disabled={isUpdating}
								>
									ยกเลิก
								</button>
								<button
									type="submit"
									className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center"
									disabled={isUpdating}
								>
									{isUpdating ? (
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
											กำลังบันทึก...
										</>
									) : (
										"บันทึกการเปลี่ยนแปลง"
									)}
								</button>
							</div>
						</div>
					</form>
				)}
			</div>
			
			{/* Delete Modal */}
			{isDeleteModalOpen && (
				<DeleteStaffModal
					isOpen={isDeleteModalOpen}
					onClose={() => setIsDeleteModalOpen(false)}
					staffId={staffId}
					staffName={getStaffDisplayName()}
				/>
			)}
		</div>
	);
}