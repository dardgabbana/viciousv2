interface ReceiptItem {
  id: number;
  title: string;
  quantity: number;
  price: number;
  selectedVariations: string | null;
}

interface OrderReceiptProps {
  orderId: number;
  createdAt: Date;
  items: ReceiptItem[];
  total: number;
}

function parseVariations(json: string | null): string {
  if (!json) return "";
  try {
    const parsed = JSON.parse(json) as { name: string; value: string }[];
    return parsed.map((v) => `${v.name}: ${v.value}`).join(", ");
  } catch {
    return "";
  }
}

export default function OrderReceipt({ orderId, createdAt, items, total }: OrderReceiptProps) {
  const recNumber = String(orderId).padStart(6, "0");
  const dateStr = createdAt
    .toUTCString()
    .replace(" GMT", "")
    .toUpperCase();

  return (
    <div className="w-full max-w-[380px] bg-white text-black font-mono shadow-[0_20px_60px_rgba(0,0,0,0.55)]">
      <div className="v-receipt-tear v-receipt-tear-top" />

      <div className="px-6 pt-7 pb-5 text-center">
        <div className="text-2xl font-bold tracking-[0.15em]">VICIOUS</div>
        <div className="mt-1 text-[10px] tracking-[0.2em] text-black/60">
          THANK YOU. COME AGAIN.
        </div>
      </div>

      <div className="px-6 text-[11px] leading-relaxed text-center text-black/80">
        <div>{dateStr}</div>
        <div>ORDER #{recNumber}</div>
      </div>

      <div className="mx-6 mt-4 h-8 v-receipt-barcode" />
      <div className="text-center text-[10px] tracking-[0.3em] pb-4">
        *{recNumber}*
      </div>

      <div className="mx-6 border-t border-dashed border-black/40" />

      <div className="px-6 py-4 text-[12px]">
        {items.map((item) => {
          const variations = parseVariations(item.selectedVariations);
          const lineTotal = (item.price * item.quantity).toFixed(2);
          return (
            <div key={item.id} className="mb-3 last:mb-0">
              <div className="flex justify-between gap-3">
                <span className="uppercase">
                  {item.quantity} × {item.title}
                </span>
                <span>€{lineTotal}</span>
              </div>
              {variations && (
                <div className="text-[10px] text-black/50">{variations}</div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mx-6 border-t border-dashed border-black/40" />

      <div className="px-6 py-4 text-[13px]">
        <div className="flex justify-between font-bold">
          <span>TOTAL</span>
          <span>€{total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-black/60 text-[11px] mt-1">
          <span>CASH ON DELIVERY</span>
        </div>
      </div>

      <div className="mx-6 border-t border-dashed border-black/40" />

      <div className="px-6 py-6 text-center">
        <div className="text-[11px] leading-relaxed text-black/70">
          YOUR ORDER IS BEING PREPARED.
          <br />
          WE&apos;LL REACH OUT TO CONFIRM DELIVERY.
        </div>
        <div className="mt-4 text-[10px] tracking-[0.2em] text-black/40">
          — SEE YOU AROUND —
        </div>
      </div>

      <div className="v-receipt-tear v-receipt-tear-bottom" />
    </div>
  );
}
