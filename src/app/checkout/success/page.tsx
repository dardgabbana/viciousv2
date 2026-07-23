import Link from "next/link";
import PageBackground from "@/components/PageBackground";
import PageFooter from "@/components/PageFooter";
import ReceiptDownload from "@/components/ReceiptDownload";
import ClearCartOnMount from "@/components/ClearCartOnMount";
import { getOrder } from "@/lib/actions/orders";

interface SuccessPageProps {
  searchParams: Promise<{ orderId?: string }>;
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const { orderId } = await searchParams;
  const order = orderId ? await getOrder(parseInt(orderId, 10)) : null;

  return (
    <PageBackground className="min-h-screen" fixed>
      <ClearCartOnMount />

      <div className="pt-20 pb-32 px-4 flex flex-col items-center justify-center min-h-[80vh]">
        <div className="w-16 h-16 mb-8 flex items-center justify-center border border-[#3d8244] bg-[#0e1a0e]">
          <svg className="w-9 h-9" fill="none" stroke="#66b06e" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="v-title mb-4 text-center">ORDER CONFIRMED</h1>

        <p className="mb-8 text-center v-ui-11 v-muted">THANK YOU FOR YOUR PURCHASE</p>

        {order ? (
          <div className="mb-10">
            <ReceiptDownload
              orderId={order.id}
              createdAt={order.createdAt}
              items={order.items.map((item) => ({
                id: item.id,
                title: item.product.title,
                quantity: item.quantity,
                price: item.price,
                selectedVariations: item.selectedVariations,
              }))}
              total={order.total}
            />
          </div>
        ) : (
          <p className="mb-8 text-center max-w-md v-ui-11 v-muted" style={{ lineHeight: 1.7 }}>
            WE&apos;VE RECEIVED YOUR ORDER AND WILL CONTACT YOU SHORTLY TO CONFIRM DELIVERY DETAILS.
            PAYMENT WILL BE COLLECTED ON DELIVERY (CASH).
          </p>
        )}

        <p className="mb-8 text-center max-w-md v-ui-11 v-muted" style={{ lineHeight: 1.7 }}>
          WE WILL CONFIRM YOUR ORDER VIA EMAIL OR PHONE SHORTLY.
        </p>

        <Link href="/shop" className="v-btn px-6 py-3">
          CONTINUE SHOPPING
        </Link>
      </div>

      <PageFooter />
    </PageBackground>
  );
}
