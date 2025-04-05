"use client";

import { useState } from "react";

export default function OrganizerEventStaffIndexPage({ params }) {
	const [selectedValue, setSelectedValue] = useState("Select Value");

	const handleSelect = (event) => {
		setSelectedValue(event.target.value);
	};

	return (
		<>
			<div className="min-h-screen flex flex-col bg-[#5E9BD6] text-gray-700 dark:bg-gray-900 px-6">
				<div className="bg-white dark:bg-gray-800 dark:text-white p-16 border-primary mt-5 flex flex-col w-full ">
					<h1 className="flex flex-col text-5xl font-extrabold mb-4 items-center">
						จัดการสตาฟ
					</h1>

					<div className="flex flex-col gap-6 sm:flex-row justify-between mt-6">
						<div className="w-3/5">
							<label
								htmlFor="dropdown"
								className="my-2 text-lg font-medium text-gray-700 dark:text-gray-300"
							></label>
							<select
								id="dropdown"
								value={selectedValue}
								onChange={handleSelect}
								className="block w-2/3 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 dark:bg-gray-800 dark:text-white"
							>
								<option disabled value="Select Value">
									แสดงสตาฟ
								</option>
								<option value="Option 1">บูธที่ 1</option>
								<option value="Option 2">บูธที่ 2</option>
								<option value="Option 3">สตาฟทั้งหมด</option>
								<option value="Option 4">
									ยังไม่มีหน้าที่
								</option>
							</select>
							{/* <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">Selected: {selectedValue}</p> */}
						</div>

                        <div>
                            <button>
                                <span className="px-3 py-3 mt-3 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 transition">
                                    เพิ่มสตาฟ
                                </span>
                            </button>
                        </div>
					</div>

					<section className="mt-8">
						<div className="flex flex-col gap-4">
                            {/* Example Staff List Item */}
                            <div className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-md">
                                <div className="flex flex-col">
                                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">ชื่อ นามสกุล</h2>
                                    
                                    <p className="text-sm text-gray-600 dark:text-gray-400">อีเมล</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">บูธที่ 1</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">หมายเหตุ</p>
                                </div>
                                <div className="flex gap-2">
                                    <button className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                                        แก้ไข    
                                    </button>
                                    <button className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                                        ลบ
                                    </button>
                                </div>

                                </div>
                        </div>
					</section>
				</div>
			</div>
		</>
	);
}
