"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

// Widget option editor components
const TextSizeSelector = ({ value, onChange }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium mb-1 dark:text-gray-300">
      ขนาดตัวอักษร
    </label>
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => onChange("s")}
        className={`px-4 py-2 rounded ${
          value === "s"
            ? "bg-blue-600 text-white"
            : "bg-gray-200 dark:bg-gray-700"
        }`}
      >
        เล็ก
      </button>
      <button
        type="button"
        onClick={() => onChange("m")}
        className={`px-4 py-2 rounded ${
          value === "m"
            ? "bg-blue-600 text-white"
            : "bg-gray-200 dark:bg-gray-700"
        }`}
      >
        กลาง
      </button>
      <button
        type="button"
        onClick={() => onChange("l")}
        className={`px-4 py-2 rounded ${
          value === "l"
            ? "bg-blue-600 text-white"
            : "bg-gray-200 dark:bg-gray-700"
        }`}
      >
        ใหญ่
      </button>
    </div>
  </div>
);

const AlignmentSelector = ({ value, onChange }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium mb-1 dark:text-gray-300">
      การจัดวาง
    </label>
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => onChange("left")}
        className={`px-4 py-2 rounded ${
          value === "left"
            ? "bg-blue-600 text-white"
            : "bg-gray-200 dark:bg-gray-700"
        }`}
        title="จัดชิดซ้าย"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => onChange("center")}
        className={`px-4 py-2 rounded ${
          value === "center"
            ? "bg-blue-600 text-white"
            : "bg-gray-200 dark:bg-gray-700"
        }`}
        title="จัดกึ่งกลาง"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3 5a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm-3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => onChange("right")}
        className={`px-4 py-2 rounded ${
          value === "right"
            ? "bg-blue-600 text-white"
            : "bg-gray-200 dark:bg-gray-700"
        }`}
        title="จัดชิดขวา"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm7 5a1 1 0 011-1h5a1 1 0 110 2h-5a1 1 0 01-1-1zm-7 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  </div>
);

const StyleSelector = ({ value, onChange }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium mb-1 dark:text-gray-300">
      รูปแบบการแสดงผล
    </label>
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => onChange("list")}
        className={`px-4 py-2 rounded ${
          value === "list"
            ? "bg-blue-600 text-white"
            : "bg-gray-200 dark:bg-gray-700"
        }`}
      >
        รายการ
      </button>
      <button
        type="button"
        onClick={() => onChange("grid")}
        className={`px-4 py-2 rounded ${
          value === "grid"
            ? "bg-blue-600 text-white"
            : "bg-gray-200 dark:bg-gray-700"
        }`}
      >
        ตาราง
      </button>
    </div>
  </div>
);

const ToggleOption = ({ label, value, onChange }) => (
  <div className="flex items-center justify-between py-2">
    <span className="text-sm font-medium dark:text-gray-300">{label}</span>
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only peer"
      />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
    </label>
  </div>
);

// Widget Preview Component
const WidgetPreview = ({ type, options }) => {
  const textSizeClasses = {
    s: "text-sm",
    m: "text-base",
    l: "text-lg",
  };

  const textSizeClass = textSizeClasses[options?.textSize || "m"];

  switch (type) {
    case "INFORMATION":
      return (
        <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
          <h3 className={`font-semibold mb-2 ${textSizeClass}`}>
            {options?.header || "ข้อมูลอีเวนต์"}
          </h3>
          <div className="space-y-2">
            {options?.showDescription && (
              <div className={textSizeClass}>
                <span className="font-medium">รายละเอียด:</span>
                <span className="text-gray-600 dark:text-gray-400">
                  รายละเอียดจะแสดงที่นี่
                </span>
              </div>
            )}
            {options?.showDateTime && (
              <div className={textSizeClass}>
                <span className="font-medium">วันเวลา:</span>
                <span className="text-gray-600 dark:text-gray-400">
                  1 มกราคม 2566, 10:00 - 16:00
                </span>
              </div>
            )}
            {options?.showLocation && (
              <div className={textSizeClass}>
                <span className="font-medium">สถานที่:</span>
                <span className="text-gray-600 dark:text-gray-400">
                  สถานที่จัดงาน
                </span>
              </div>
            )}
            {options?.showCapacity && (
              <div className={textSizeClass}>
                <span className="font-medium">จำนวนที่รับ:</span>
                <span className="text-gray-600 dark:text-gray-400">500 คน</span>
              </div>
            )}
            {options?.showPrice && (
              <div className={textSizeClass}>
                <span className="font-medium">ค่าใช้จ่าย:</span>
                <span className="text-gray-600 dark:text-gray-400">ฟรี</span>
              </div>
            )}
            {options?.showContact && (
              <div className={textSizeClass}>
                <span className="font-medium">ติดต่อ:</span>
                <span className="text-gray-600 dark:text-gray-400">
                  example@email.com
                </span>
              </div>
            )}
          </div>
        </div>
      );
    case "TEXT":
      if (options?.hidden) {
        return (
          <div className="p-3 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-center text-gray-400">
            วิดเจ็ตข้อความถูกซ่อนอยู่
          </div>
        );
      }

      return (
        <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
          {options?.header && (
            <h3
              className={`font-semibold mb-2 ${textSizeClass} text-${
                options?.alignment || "left"
              }`}
            >
              {options.header}
            </h3>
          )}
          <div
            className={`${textSizeClass} text-${
              options?.alignment || "left"
            } whitespace-pre-wrap`}
          >
            {options?.content || "เนื้อหาข้อความจะแสดงที่นี่"}
          </div>
        </div>
      );
    case "CHILDREN":
      return (
        <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
          <h3 className={`font-semibold mb-2 ${textSizeClass}`}>
            {options?.header || "บูธทั้งหมด"}
          </h3>
          <div
            className={`${
              options?.style === "grid"
                ? "grid grid-cols-2 gap-2"
                : "flex flex-col space-y-2"
            }`}
          >
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`p-2 border border-gray-200 dark:border-gray-700 rounded ${textSizeClass}`}
              >
                <div className="font-medium">บูธตัวอย่าง {i}</div>
                <div className="text-gray-600 dark:text-gray-400 text-sm">
                  รายละเอียดบูธ
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    default:
      return <div>ไม่รองรับวิดเจ็ตนี้</div>;
  }
};

export default function EventPageCustomize() {
  const { organizerId, eventIdName } = useParams();
  const router = useRouter();

  // State for data
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [event, setEvent] = useState(null);
  const [page, setPage] = useState(null);
  const [widgets, setWidgets] = useState([]);
  // Add state for error refresh countdown
  const [errorRefreshCountdown, setErrorRefreshCountdown] = useState(null);

  // State for UI interaction
  const [activeWidgetIndex, setActiveWidgetIndex] = useState(0);
  const [primaryColor, setPrimaryColor] = useState("#333333");
  const [accentColor, setAccentColor] = useState("#3B82F6");
  const [backgroundColor, setBackgroundColor] = useState("#F3F4F6");
  const [saveMessage, setSaveMessage] = useState("");
  const [saving, setSaving] = useState(false);

  // Fetch event and page data on component mount
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        setError(null);
        // Reset error refresh countdown
        setErrorRefreshCountdown(null);

        // First fetch the event data
        const eventResponse = await fetch("/api/data/event/get/event_id_name", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            event_id_name: eventIdName,
          }),
        });

        if (!eventResponse.ok) {
          throw new Error("Failed to load event data");
        }

        const eventData = await eventResponse.json();

        if (!eventData.isSuccess) {
          throw new Error(eventData.message || "Failed to load event data");
        }

        setEvent(eventData.content);

        // Then fetch the page data
        const pageResponse = await fetch(
          "/api/data/event/page/get/event_id_name",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              event_id_name: eventIdName,
            }),
          }
        );

        if (!pageResponse.ok) {
          throw new Error("Failed to load page data");
        }

        const pageData = await pageResponse.json();

        if (!pageData.isSuccess) {
          throw new Error(pageData.message || "Failed to load page data");
        }

        // Process page data
        setPage(pageData.content);

        // Set theme colors if available
        if (pageData.content.primary_color) {
          setPrimaryColor(pageData.content.primary_color);
        }

        if (pageData.content.ccent_color) {
          setAccentColor(pageData.content.accent_color);
        }

        if (pageData.content.background_color) {
          setBackgroundColor(pageData.content.background_color || "#F3F4F6");
        }

        // Process widgets - ensure options are properly parsed
        if (
          pageData.content.EventPageWidgets &&
          Array.isArray(pageData.content.EventPageWidgets)
        ) {
          const processedWidgets = pageData.content.EventPageWidgets.map(
            (widget) => ({
              ...widget,
              options:
                typeof widget.options === "string"
                  ? JSON.parse(widget.options)
                  : widget.options || {},
            })
          );

          setWidgets(processedWidgets);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching event page data:", error);
        setError(
          error.message || "An error occurred while loading the page"
        );
        setIsLoading(false);

        // Start countdown for auto-refresh (3 seconds)
        setErrorRefreshCountdown(3);
      }
    }

    fetchData();
  }, [eventIdName]);

  // Handle auto-refresh countdown
  useEffect(() => {
    if (errorRefreshCountdown === null) return;

    if (errorRefreshCountdown === 0) {
      window.location.reload();
      return;
    }

    const timer = setTimeout(() => {
      setErrorRefreshCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearTimeout(timer);
  }, [errorRefreshCountdown]);

  // Update widget options
  const handleUpdateWidget = (index, newOptions) => {
    const updatedWidgets = [...widgets];
    updatedWidgets[index] = {
      ...updatedWidgets[index],
      options: {
        ...updatedWidgets[index].options,
        ...newOptions,
      },
    };

    setWidgets(updatedWidgets);
    setSaveMessage("มีการเปลี่ยนแปลง (ยังไม่บันทึก)");
  };

  // Save changes to the server
  const handleSave = async () => {
    try {
      setSaving(true);
      setSaveMessage("กำลังบันทึก...");

      // First update page theme settings
      const pageUpdateResponse = await fetch(
        `/api/data/event/page/update/${eventIdName}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            primary_color: primaryColor,
            accent_color: accentColor,
            background_color: backgroundColor,
          }),
        }
      );

      if (!pageUpdateResponse.ok) {
        throw new Error("Failed to update page theme");
      }

      // Then update each widget's options
      for (const widget of widgets) {
        const widgetResponse = await fetch(
          `/api/data/event/page/widget/update/${widget.event_page_widget_id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              event_page_widget_id: widget.event_page_widget_id,
              option: widget.options,
            }),
          }
        );

        if (!widgetResponse.ok) {
          throw new Error(`Failed to update widget: ${widget.widget_type}`);
        }
      }

      setSaving(false);
      setSaveMessage("บันทึกสำเร็จ");

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error saving page data:", error);
      setSaving(false);
      setSaveMessage(
        "เกิดข้อผิดพลาดในการบันทึก: " + (error.message || "Unknown error")
      );
    }
  };

  // Generate options editor based on active widget type
  const renderOptionsEditor = () => {
    if (!widgets[activeWidgetIndex]) return null;

    const widget = widgets[activeWidgetIndex];
    const widgetType = widget.widget_type;
    const widgetOptions = widget.options || {};

    switch (widgetType) {
      case "INFORMATION":
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg mb-4">
              <h3 className="font-medium mb-1">วิดเจ็ตข้อมูลอีเวนต์</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                แสดงข้อมูลสำคัญของอีเวนต์ เช่น วันเวลา สถานที่ และรายละเอียดอื่นๆ
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                หัวข้อวิดเจ็ต
              </label>
              <input
                type="text"
                value={widgetOptions.header || ""}
                onChange={(e) =>
                  handleUpdateWidget(activeWidgetIndex, {
                    header: e.target.value,
                  })
                }
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700"
                placeholder="ข้อมูลอีเวนต์"
              />
            </div>

            <TextSizeSelector
              value={widgetOptions.textSize || "m"}
              onChange={(value) =>
                handleUpdateWidget(activeWidgetIndex, { textSize: value })
              }
            />

            <div className="border-t dark:border-gray-700 pt-4 mt-4">
              <h3 className="font-medium mb-3">ข้อมูลที่ต้องการแสดง</h3>

              <ToggleOption
                label="คำอธิบายอีเวนต์"
                value={widgetOptions.showDescription !== false}
                onChange={(value) =>
                  handleUpdateWidget(activeWidgetIndex, {
                    showDescription: value,
                  })
                }
              />

              <ToggleOption
                label="วันและเวลา"
                value={widgetOptions.showDateTime !== false}
                onChange={(value) =>
                  handleUpdateWidget(activeWidgetIndex, { showDateTime: value })
                }
              />

              <ToggleOption
                label="สถานที่"
                value={widgetOptions.showLocation !== false}
                onChange={(value) =>
                  handleUpdateWidget(activeWidgetIndex, { showLocation: value })
                }
              />

              <ToggleOption
                label="จำนวนที่รับ"
                value={widgetOptions.showCapacity !== false}
                onChange={(value) =>
                  handleUpdateWidget(activeWidgetIndex, { showCapacity: value })
                }
              />

              <ToggleOption
                label="ค่าใช้จ่าย"
                value={widgetOptions.showPrice !== false}
                onChange={(value) =>
                  handleUpdateWidget(activeWidgetIndex, { showPrice: value })
                }
              />

              <ToggleOption
                label="ข้อมูลติดต่อ"
                value={widgetOptions.showContact !== false}
                onChange={(value) =>
                  handleUpdateWidget(activeWidgetIndex, { showContact: value })
                }
              />
            </div>
          </div>
        );

      case "TEXT":
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg mb-4">
              <h3 className="font-medium mb-1">วิดเจ็ตข้อความกำหนดเอง</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                แสดงข้อความที่คุณต้องการสื่อสารกับผู้เข้าชมหน้าเว็บ
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                หัวข้อวิดเจ็ต
              </label>
              <input
                type="text"
                value={widgetOptions.header || ""}
                onChange={(e) =>
                  handleUpdateWidget(activeWidgetIndex, {
                    header: e.target.value,
                  })
                }
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700"
                placeholder="หัวข้อข้อความ"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                เนื้อหา
              </label>
              <textarea
                value={widgetOptions.content || ""}
                onChange={(e) =>
                  handleUpdateWidget(activeWidgetIndex, {
                    content: e.target.value,
                  })
                }
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 h-32"
                placeholder="ใส่ข้อความที่ต้องการแสดงที่นี่"
              ></textarea>
            </div>

            <ToggleOption
              label="ซ่อนวิดเจ็ตนี้"
              value={widgetOptions.hidden === true}
              onChange={(value) =>
                handleUpdateWidget(activeWidgetIndex, { hidden: value })
              }
            />

            <TextSizeSelector
              value={widgetOptions.textSize || "m"}
              onChange={(value) =>
                handleUpdateWidget(activeWidgetIndex, { textSize: value })
              }
            />

            <AlignmentSelector
              value={widgetOptions.alignment || "left"}
              onChange={(value) =>
                handleUpdateWidget(activeWidgetIndex, { alignment: value })
              }
            />
          </div>
        );

      case "CHILDREN":
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg mb-4">
              <h3 className="font-medium mb-1">วิดเจ็ตรายการบูธ</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                แสดงรายการบูธทั้งหมดภายในอีเวนต์นี้
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                หัวข้อวิดเจ็ต
              </label>
              <input
                type="text"
                value={widgetOptions.header || ""}
                onChange={(e) =>
                  handleUpdateWidget(activeWidgetIndex, {
                    header: e.target.value,
                  })
                }
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700"
                placeholder="บูธภายในอีเวนต์"
              />
            </div>

            <TextSizeSelector
              value={widgetOptions.textSize || "m"}
              onChange={(value) =>
                handleUpdateWidget(activeWidgetIndex, { textSize: value })
              }
            />

            <StyleSelector
              value={widgetOptions.style || "grid"}
              onChange={(value) =>
                handleUpdateWidget(activeWidgetIndex, { style: value })
              }
            />
          </div>
        );

      default:
        return <div>ไม่พบตัวแก้ไขสำหรับวิดเจ็ตประเภทนี้</div>;
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#5E9BD6] dark:bg-gray-900 flex justify-center items-center">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-[#5E9BD6] dark:bg-gray-900 flex justify-center items-center">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="text-red-500 text-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4 dark:text-white text-center">เกิดข้อผิดพลาด</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">{error}</p>
          {errorRefreshCountdown !== null && (
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
              กำลังรีเฟรชใน {errorRefreshCountdown} วินาที...
            </p>
          )}
          <div className="flex justify-center">
            <Link 
              href={`/organizer/${organizerId}/event/${eventIdName}`}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              กลับไปยังหน้าอีเวนต์
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#5E9BD6] dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6 flex flex-col md:flex-row justify-between items-center">
          <div>
            <Link 
              href={`/organizer/${organizerId}/event/${eventIdName}`}
              className="inline-flex items-center text-blue-800 dark:text-blue-400 hover:underline mb-2 md:mb-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              กลับไปหน้าจัดการอีเวนต์
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-white dark:text-gray-100">
              ออกแบบหน้าเว็บ {event?.name || ""}
            </h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className={`text-sm ${
              saveMessage ? (
                saveMessage.includes("สำเร็จ") ? "text-green-500" : 
                saveMessage.includes("กำลัง") ? "text-blue-500" : 
                "text-yellow-500"
              ) : "invisible"
            }`}>
              {saveMessage || "..."}
            </span>
            <button
              onClick={handleSave}
              disabled={saving}
              className={`px-4 py-2 rounded-lg font-medium ${
                saving
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 text-white dark:bg-green-500 dark:hover:bg-green-400"
              }`}
            >
              {saving ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
            </button>
            <Link
              href={`/${eventIdName}`}
              target="_blank"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
            >
              ดูตัวอย่าง
            </Link>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left side - Preview (2/3) */}
          <div className="lg:w-2/3">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4 dark:text-gray-100">
                ตัวอย่างหน้าเว็บ
              </h2>

              {/* Theme settings */}
              <div className="mb-6 border-b dark:border-gray-700 pb-6">
                <h3 className="font-medium mb-3 dark:text-gray-300">ตั้งค่าธีม</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 dark:text-gray-400">
                      สีหลัก
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="h-8 w-8 rounded border border-gray-300 dark:border-gray-600"
                      />
                      <input
                        type="text"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="flex-1 p-1 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 dark:text-gray-400">
                      สีรอง
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={accentColor}
                        onChange={(e) => setAccentColor(e.target.value)}
                        className="h-8 w-8 rounded border border-gray-300 dark:border-gray-600"
                      />
                      <input
                        type="text"
                        value={accentColor}
                        onChange={(e) => setAccentColor(e.target.value)}
                        className="flex-1 p-1 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 dark:text-gray-400">
                      สีพื้นหลัง
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="h-8 w-8 rounded border border-gray-300 dark:border-gray-600"
                      />
                      <input
                        type="text"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="flex-1 p-1 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Page layout preview */}
              <div style={{ backgroundColor }} className="rounded-lg p-4 min-h-[500px] border border-gray-200 dark:border-gray-700">
                {/* Banner preview if available */}
                {event?.banner && (
                  <div className="w-full mb-4 overflow-hidden rounded-lg shadow-md">
                    <img
                      src={`/api/data/file/load?id=${event.banner}`}
                      alt={`${event.name} banner`}
                      className="w-full h-auto object-cover"
                      style={{ maxHeight: "200px" }}
                      onError={(e) => {
                        e.target.style.display = "none"; // Hide if image fails to load
                      }}
                    />
                  </div>
                )}
                
                {/* Content container */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                  {/* Event title */}
                  <h1 
                    className="text-2xl font-bold mb-6 text-center"
                    style={{ color: primaryColor }}
                  >
                    {event?.name || "ชื่ออีเวนต์"}
                  </h1>
                  
                  {/* Widget previews */}
                  {widgets.map((widget, index) => (
                    <div key={widget.event_page_widget_id} 
                      className={`mb-4 cursor-pointer ${index === activeWidgetIndex ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''}`}
                      onClick={() => setActiveWidgetIndex(index)}
                    >
                      <WidgetPreview 
                        type={widget.widget_type} 
                        options={widget.options} 
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Tools (1/3) */}
          <div className="lg:w-1/3">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4 dark:text-gray-100">
                แก้ไขวิดเจ็ต
              </h2>

              {/* Widget selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                  เลือกวิดเจ็ตที่ต้องการแก้ไข
                </label>
                <div className="flex flex-wrap gap-2">
                  {widgets.map((widget, index) => (
                    <button
                      key={widget.event_page_widget_id}
                      onClick={() => setActiveWidgetIndex(index)}
                      className={`px-3 py-1 text-sm rounded-full ${
                        index === activeWidgetIndex
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 dark:bg-gray-700"
                      }`}
                    >
                      {widget.widget_type === "INFORMATION" && "ข้อมูลอีเวนต์"}
                      {widget.widget_type === "TEXT" && "ข้อความ"}
                      {widget.widget_type === "CHILDREN" && "บูธ"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Widget options editor */}
              <div className="border-t dark:border-gray-700 pt-4">
                {renderOptionsEditor()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}