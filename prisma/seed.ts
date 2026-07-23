import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const slider = (n: number) => `/images/slider/kobra-${String(n).padStart(2, "0")}.jpg`;

const products = [
  {
    title: "Vicious Tee Black",
    price: 45,
    image: "/images/vicious4.jpg",
    images: JSON.stringify(["/images/vicious0.jpg", slider(1)]),
    category: "singles",
    description: "Premium black tee with Vicious branding. 100% cotton, comfortable fit.",
  },
  {
    title: "Vicious Hoodie",
    price: 89,
    image: "/images/vicious0.jpg",
    images: JSON.stringify(["/images/vicious4.jpg", slider(2)]),
    category: "collections",
    description: "Cozy hoodie perfect for any season. Features embroidered Vicious logo.",
  },
  {
    title: "Vicious Cap",
    price: 35,
    image: "/images/vicious4.jpg",
    images: JSON.stringify(["/images/vicious0.jpg", slider(3)]),
    category: "singles",
    description: "Adjustable cap with classic Vicious design. One size fits all.",
  },
  {
    title: "Vicious Jacket",
    price: 120,
    image: "/images/vicious0.jpg",
    images: JSON.stringify(["/images/vicious4.jpg", slider(4)]),
    category: "collections",
    description: "Stylish jacket for the bold. Water-resistant with premium finish.",
  },
  {
    title: "Vicious Pants",
    price: 75,
    image: "/images/vicious4.jpg",
    images: JSON.stringify(["/images/vicious0.jpg", slider(5)]),
    category: "singles",
    description: "Comfortable pants with modern cut. Perfect for everyday wear.",
  },
  {
    title: "Vicious Set",
    price: 150,
    image: "/images/vicious0.jpg",
    images: JSON.stringify(["/images/vicious4.jpg", slider(6)]),
    category: "collections",
    description: "Complete matching set. Includes top and bottom pieces.",
  },
  {
    title: "Vicious Tank Top",
    price: 40,
    image: "/images/vicious4.jpg",
    images: JSON.stringify(["/images/vicious0.jpg", slider(7)]),
    category: "singles",
    description: "Breathable tank top for active lifestyle. Lightweight and durable.",
  },
  {
    title: "Vicious Bundle",
    price: 180,
    image: "/images/vicious0.jpg",
    images: JSON.stringify(["/images/vicious4.jpg", slider(8)]),
    category: "collections",
    description: "Ultimate bundle pack. Multiple items at special price.",
  },
  {
    title: "Vicious Shorts",
    price: 55,
    image: "/images/vicious4.jpg",
    images: JSON.stringify(["/images/vicious0.jpg", slider(9)]),
    category: "singles",
    description: "Athletic shorts with premium comfort. Quick-dry material.",
  },
  {
    title: "Vicious Full Kit",
    price: 200,
    image: "/images/vicious0.jpg",
    images: JSON.stringify(["/images/vicious4.jpg", slider(10)]),
    category: "collections",
    description: "The complete Vicious experience. Everything you need in one package.",
  },
];

async function main() {
  console.log("Seeding database...");

  // Clear existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.adminSession.deleteMany();

  // Create products
  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log(`Created ${products.length} products`);
  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
