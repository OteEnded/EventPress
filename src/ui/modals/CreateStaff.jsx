export default function CreateStaff() {
	return (
		<>
			<div className="max-w-4xl bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md mb-12">
				<div className="bg-white dark:bg-gray-800 dark:text-white p-16 border-primary mt-5 flex flex-col w-full ">
					<h1 className="flex flex-col text-5xl font-extrabold mb-4 items-center">
						สร้างสตาฟ
					</h1>
				</div>
			<section>
				<form className="flex flex-col gap-4 mb-4">
					<div>
						<label
							htmlFor="staff_name"
							className="block text-sm font-medium text-gray-700 dark:text-gray-300">
								ชื่อ
							</label>
							<input
							type="text"
							id="staff_name"
							name="staff_name"
							className="mt-1 block w-full px-3 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
							required>
							</input>
					</div>
					<div>
						<label
							htmlFor="staff_surname"
							className="block text-sm font-medium text-gray-700 dark:text-gray-300">
								สกุล
							</label>
							<input
							type="text"
							id="staff_surname"
							name="staff_surname"
							className="mt-1 block w-full px-3 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
							required>
								</input>
					</div>
					<div>
						<label
							htmlFor="staff_email"
							className="block text-sm font-medium text-gray-700 dark:text-gray-300">
								อีเมล
							</label>
							<input
							type="email"
							id="staff_email"
							name="staff_email"
							className="mt-1 block w-full px-3 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
							required>
								</input>
					</div>
					<div>
						<label
							htmlFor="staff_phone"
							className="block text-sm font-medium text-gray-700 dark:text-gray-300">
								หมายเลขโทรศัพท์
							</label>
							<input
							type="text"
							id="staff_phone"
							name="staff_phone"
							className="mt-1 block w-full px-3 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
							>
								</input>
					</div>

					<div className="text-xl">
						เลือกบูธที่ต้องการให้สตาฟทำงาน
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="flex items-center">
							<input
								type="checkbox"
								id="responsibility1"
								className="hidden peer"
							/>
							<label
								htmlFor="responsibility1"
								className="w-full px-4 py-2 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-lg cursor-pointer peer-checked:bg-blue-600 peer-checked:text-white transition flex justify-center items-center">
								บูธที่ 1
							</label>
						</div>
						<div className="flex items-center">
							<input
								type="checkbox"
								id="responsibility2"
								className="hidden peer"
							/>
							<label
								htmlFor="responsibility2"
								className="w-full px-4 py-2 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-lg cursor-pointer peer-checked:bg-blue-600 peer-checked:text-white transition flex justify-center items-center">
								บูธที่ 2
							</label>
						</div>
						<div className="flex items-center">
							<input
								type="checkbox"
								id="responsibility3"
								className="hidden peer"
							/>
							<label
								htmlFor="responsibility3"
								className="w-full px-4 py-2 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-lg cursor-pointer peer-checked:bg-blue-600 peer-checked:text-white transition flex justify-center items-center">
								บูธที่ 3
							</label>
						</div>
					</div>

					<button className="px-3 py-3 mt-3 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 transition">
							ยืนยัน
					</button>
				</form>
			</section>
			</div>
			
		</>
	);
}
