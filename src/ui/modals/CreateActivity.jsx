"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CreateActivity({ isOpen, onClose, boothId }) {
	const [isCreating, setIsCreating] = useState(false);
	const [error, setError] = useState("");
	const router = useRouter();
	
	// Form state
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [location, setLocation] = useState("");
	const [startTime, setStartTime] = useState("");
	const [endTime, setEndTime] = useState("");
	const [price, setPrice] = useState(0);

	// Time validation error
	const [timeError, setTimeError] = useState("");

	// Validate time when either start or end time changes
	useEffect(() => {
		// Clear any existing time errors
		setTimeError("");
		
		// Only validate if both times are set
		if (startTime && endTime) {
			// Convert to comparable format (minutes since midnight)
			const startMinutes = convertTimeToMinutes(startTime);
			const endMinutes = convertTimeToMinutes(endTime);
			
			// Check if end time is before start time
			if (endMinutes < startMinutes) {
				setTimeError("เวลาสิ้นสุดต้องมาหลังเวลาเริ่มต้น");
			}
		}
	}, [startTime, endTime]);

	// Helper function to convert HH:MM to minutes for comparison
	const convertTimeToMinutes = (timeString) => {
		const [hours, minutes] = timeString.split(':').map(Number);
		return hours * 60 + minutes;
	};

	if (!isOpen) return null;

	const handleSubmit = async (e) => {
		e.preventDefault();
		
		// Validate times before proceeding
		if (startTime && endTime) {
			const startMinutes = convertTimeToMinutes(startTime);
			const endMinutes = convertTimeToMinutes(endTime);
			
			if (endMinutes < startMinutes) {
				setTimeError("เวลาสิ้นสุดต้องมาหลังเวลาเริ่มต้น");
				return; // Prevent form submission
			}
		}
		
		setIsCreating(true);
		setError("");

		try {
			const activityData = {
				booth: boothId,
				name: name,
				description: description,
				location: location,
				start_time: startTime || null,
				end_time: endTime || null,
				price: parseFloat(price) || 0
			};

			const response = await fetch("/api/data/activity/create", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(activityData),
			});

			const data = await response.json();

			if (!response.ok || !data.isSuccess) {
				throw new Error(data.error || "Failed to create activity");
			}

			// Reset form
			setName("");
			setDescription("");
			setLocation("");
			setStartTime("");
			setEndTime("");
			setPrice(0);
			
			// Success, close modal and refresh
			onClose();
			
			// Force hard refresh instead of router.refresh() to get the latest data
			window.location.reload();

		} catch (error) {
			console.error("Error creating activity:", error);
			setError(error.message || "เกิดข้อผิดพลาดในการสร้างกิจกรรม");
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
					<h1 className="text-2xl font-bold text-gray-800 dark:text-white">สร้างกิจกรรม</h1>
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

				{timeError && (
					<div className="bg-yellow-100 border border-yellow-400 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 px-4 py-3 rounded mb-4">
						{timeError}
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label
							htmlFor="activity_name"
							className="block text-sm font-medium text-gray-700 dark:text-gray-300"
						>
							ชื่อกิจกรรม *
						</label>
						<input
							type="text"
							id="activity_name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="mt-1 block w-full px-3 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
							required
						/>
					</div>

					<div>
						<label
							htmlFor="activity_description"
							className="block text-sm font-medium text-gray-700 dark:text-gray-300"
						>
							รายละเอียดกิจกรรม
						</label>
						<textarea
							placeholder="รายละเอียดกิจกรรม"
							id="activity_description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							rows="4"
							className="mt-1 block w-full px-3 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
						></textarea>
					</div>

					<div>
						<label
							htmlFor="activity_location"
							className="block text-sm font-medium text-gray-700 dark:text-gray-300"
						>
							สถานที่จัดกิจกรรม
						</label>
						<input
							type="text"
							placeholder="สถานที่จัดกิจกรรม"
							id="activity_location"
							value={location}
							onChange={(e) => setLocation(e.target.value)}
							className="mt-1 block w-full px-3 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
						/>
					</div>

					<div>
						<label
							htmlFor="activity_price"
							className="block text-sm font-medium text-gray-700 dark:text-gray-300"
						>
							ราคา (บาท)
						</label>
						<input
							type="number"
							placeholder="ราคา"
							id="activity_price"
							value={price}
							onChange={(e) => setPrice(e.target.value)}
							min="0"
							step="0.01"
							className="mt-1 block w-full px-3 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
						/>
					</div>

					<div className="flex flex-row gap-4">
						<div className="flex-1">
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
								เวลาเริ่มต้น
							</label>
							<input
								type="time"
								id="activity_start_time"
								value={startTime}
								onChange={(e) => setStartTime(e.target.value)}
								className="block p-3 w-full text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
							/>
						</div>
						<div className="flex-1">
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
								เวลาสิ้นสุด
							</label>
							<input
								type="time"
								id="activity_end_time"
								value={endTime}
								onChange={(e) => setEndTime(e.target.value)}
								className="block p-3 w-full text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
							/>
						</div>
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
								"สร้างกิจกรรม"
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
