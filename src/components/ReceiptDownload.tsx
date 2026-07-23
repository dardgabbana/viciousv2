"use client";

import { useRef, useState } from "react";
import OrderReceipt from "@/components/OrderReceipt";

interface ReceiptItem {
  id: number;
  title: string;
  quantity: number;
  price: number;
  selectedVariations: string | null;
}

interface ReceiptDownloadProps {
  orderId: number;
  createdAt: Date;
  items: ReceiptItem[];
  total: number;
}

export default function ReceiptDownload({ orderId, createdAt, items, total }: ReceiptDownloadProps) {
  const receiptRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!receiptRef.current || downloading) return;
    setDownloading(true);
    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import("html2canvas-pro"),
        import("jspdf"),
      ]);

      const canvas = await html2canvas(receiptRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        unit: "px",
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(`vicious-receipt-${String(orderId).padStart(6, "0")}.pdf`);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div ref={receiptRef}>
        <OrderReceipt orderId={orderId} createdAt={createdAt} items={items} total={total} />
      </div>

      <button
        type="button"
        onClick={handleDownload}
        disabled={downloading}
        className="v-btn px-6 py-3 disabled:opacity-60"
      >
        {downloading ? "PREPARING PDF..." : "DOWNLOAD RECEIPT (PDF)"}
      </button>
    </div>
  );
}
