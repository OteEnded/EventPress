export default function CreateActivity() {
	return (
		<>
			<div className="max-w-4xl bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md mb-12">
				<div className="bg-white dark:bg-gray-800 dark:text-white p-16 border-primary mt-5 flex flex-col w-full ">
					<h1 className="flex flex-col text-5xl font-extrabold mb-4 items-center">
						สร้างกิจกรรม
					</h1>
				</div>
				<section className="">
					<form className="mb-4">
						<div className="flex flex-col md:flex-row gap-4">
							<div className="mb-4">
								<label
									htmlFor="event_name"
									className="block text-sm font-medium text-gray-700 dark:text-gray-300"
								>
									ชื่อกิจกรรม
								</label>
								<input
									type="text"
									id="event_name"
									name="event_name"
									className="mt-1 block w-full px-3 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
									required
								></input>
							</div>
						</div>

						<div className="mb-4">
							<label
								htmlFor="event_description"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300"
							>
								รายละเอียดกิจกรรม
							</label>
							<textarea
								placeholder="รายละเอียดกิจกรรม"
								id="event_description"
								name="event_description"
								className="mt-1 block w-full px-3 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
							></textarea>
						</div>

						<div className="mb-4">
							<label
								htmlFor="event_detail"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300"
							>
								วิธีการเข้าร่วมกิจกรรม
							</label>
							<textarea
								placeholder="วิธีการเข้าร่วมกิจกรรม"
								id="event_detail"
								name="event_detail"
								className="mt-1 block w-full px-3 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
							></textarea>
						</div>

						<div className="mb-4">
							<label
								htmlFor="event_capacity"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300"
							>
								จำนวนที่รับ
							</label>
							<input
								type="number"
								placeholder="จำนวนที่รับ"
								id="event_capacity"
								name="event_capacity"
								className="mt-1 block w-full px-3 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
							></input>
						</div>

						<div className="flex flex-row gap-4 mb-4">
							{" "}
							{/* Updated to flex-row for horizontal layout */}
							<div className="flex-1">
								{" "}
								{/* Flex-1 ensures equal width */}
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
									วันที่เริ่มต้น
								</label>
								<input
									type="date"
									id="event_start_date"
									name="event_start_date"
									className="block p-3 w-full text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
								></input>
							</div>
							<div className="flex-1">
								{" "}
								{/* Flex-1 ensures equal width */}
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
									วันที่สิ้นสุด
								</label>
								<input
									type="date"
									id="event_end_date"
									name="event_end_date"
									className="block p-3 w-full text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
								></input>
							</div>
						</div>

						<div className="flex justify-center">
							<button className="px-3 py-3 mt-3 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 item-center flex justify-center transition">
								สร้างกิจกรรม
							</button>
						</div>
					</form>
				</section>
			</div>
		</>
	);
}
