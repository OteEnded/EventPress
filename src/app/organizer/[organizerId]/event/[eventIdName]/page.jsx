export default async function OrganizerEventManagePage({ params }) {
	const param = await params;
	const event = await param.eventIdName;

	if (event == "create") {
		// Create event page
        return (
            <>
                <div className="min-h-screen flex flex-col bg-[#5E9BD6] text-gray-700 dark:bg-gray-900 px-6">
                    <div className="bg-white dark:bg-gray-800 dark:text-white p-16 border-primary mt-5 flex flex-col w-full ">
                            <h1 className="flex flex-col text-5xl font-extrabold mb-4 items-center">
                                ข้อมูลอีเวนต์
                            </h1>

                            <section className="flex flex-col w-full">
                                <form>
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
                                            className="mt-1 p-2 block flex flex-row border-gray-300 bg-gray-200  rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            required
                                        />
                                    </div>

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
                                            rows="4"
                                            className="mt-1 p-2 block w-full border-gray-300 bg-gray-200  rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            required
                                        ></textarea>
                                    </div>

                                    <div className="flex flex-wrap lg:flex-nowrap gap-4 mb-4">
                                        <div className="flex-1">
                                            <label
                                                htmlFor="event_date"
                                                className="block text-lg font-medium text-gray-700 dark:text-gray-300"
                                            >
                                                วันที่จัดอีเวนต์
                                            </label>
                                            <input
                                                type="date"
                                                id="event_date"
                                                name="event_date"
                                                className="mt-1 p-2 block w-full border-gray-300 bg-gray-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                required
                                            />
                                        </div>

                                        <div className="flex-1">
                                            <label
                                                htmlFor="event_time"
                                                className="block text-lg font-medium text-gray-700 dark:text-gray-300"
                                            >
                                                เวลาที่จัดอีเวนต์
                                            </label>
                                            <input
                                                type="time"
                                                id="event_time"
                                                name="event_time"
                                                className="mt-1 p-2 block w-full border-gray-300 bg-gray-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                required
                                            />
                                        </div>

                                        <div className="flex-1">
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
                                                className="mt-1 p-2 block w-full border-gray-300 bg-gray-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap lg:flex-nowrap gap-4 mb-4">
                                        <div className="flex-1">
                                            <label
                                                htmlFor="event_capacity"
                                                className="block text-lg font-medium text-gray-700 dark:text-gray-300"
                                            >
                                                จำนวนที่รับ
                                            </label>
                                            <input
                                                type="number"
                                                id="event_capacity"
												name="event_capacity"
												className="mt-1 p-2 block w-full border-gray-300 bg-gray-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500"
												required
											/>
										</div>

										<div className="flex-1">
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
												className="mt-1 p-2 block w-full border-gray-300 bg-gray-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500"
												required
											/>
										</div>
									</div>

									<button
										type="submit"
										className="px-3 py-3 mt-3 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 transition"
									>
										สร้างอีเวนต์
									</button>
								</form>
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
                                        <button className="px-3 py-3 mt-3 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 transition">
                                        ออกแบบหน้าเว็บ
                                        </button>
                                        <button className="px-3 py-3 mt-3 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 transition">
                                        จัดการสตาฟ
                                        </button>
                                        <button className="px-3 py-3 mt-3 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 transition">
                                        สร้างบูธ
                                        </button>
                                    </div>
                                </div>
                            </section>

                            <section className="mt-8">
                                <div className="flex flex-col gap-4">
                                    <div className="bg-white text-gray-600  dark:text-gray-300  dark:bg-gray-900 p-4 rounded-lg shadow">
                                        <h3 className="text-xl font-semibold">บูธ 1</h3>
                                        <p className="text-sm mt-2">
                                            รายละเอียดบูธ 1
                                        </p>
                                    </div>
                                    <div className="bg-white text-gray-600 dark:text-gray-300 dark:bg-gray-900 p-4 rounded-lg shadow">
                                        <h3 className="text-xl font-semibold">บูธ 2</h3>
                                        <p className="text-sm  mt-2">
                                            รายละเอียดบูธ 2
                                        </p>
                                    </div>
                                </div>
                            </section>
						</div>

					</div>

			</>
		);
	}

	return <></>;
}
