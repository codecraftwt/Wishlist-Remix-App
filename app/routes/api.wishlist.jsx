import { json } from "@remix-run/node";
import db from "../db.server";

const corsOptions = {
  origin: "https://cc-wishlist-dev.myshopify.com", 
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
};

function withCors(request, response) {
  const origin = request.headers.get('origin') || '';
  const headers = new Headers(response.headers || {});
  headers.set('Access-Control-Allow-Origin', corsOptions.origin || '*');
  headers.set('Access-Control-Allow-Credentials', corsOptions.credentials ? 'true' : 'false');
  headers.set('Access-Control-Allow-Methods', (corsOptions.methods || ['GET','POST','PUT','DELETE','OPTIONS']).join(','));
  headers.set('Access-Control-Allow-Headers', (corsOptions.allowedHeaders || ['Content-Type','Authorization','Accept']).join(','));
  headers.set('Vary', 'Origin');

  return new Response(response.body, {
    status: response.status,
    headers,
  });
}

export async function loader({ request }) {
  const url = new URL(request.url);
  const customerId = url.searchParams.get("customerId");
  const shop = url.searchParams.get("shop");
  const productId = url.searchParams.get("productId");

  // Build dynamic where condition
  const where = {};
  if (customerId) where.customerId = customerId;
  if (shop) where.shop = shop;
  if (productId) where.productId = productId;

  const wishlist = await db.wishlist.findMany({ where });
  const response = json({ ok: true, message: "Success", wishlists: wishlist });
  return withCors(request, response);
}

export async function action({ request }) {
  // 👇 Handle preflight OPTIONS request
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: { 'Access-Control-Allow-Origin': corsOptions.origin || '*', 'Access-Control-Allow-Methods': corsOptions.methods.join(','), 'Access-Control-Allow-Headers': corsOptions.allowedHeaders.join(','), 'Access-Control-Allow-Credentials': corsOptions.credentials ? 'true' : 'false' } });
  }

  let data;
  const contentType = request.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    data = await request.json();
  } else {
    const formData = await request.formData();
    data = Object.fromEntries(formData);
  }

  console.log("Received data:", data);
  console.log("Content-Type:", contentType);

  const customerId = data.customerId;
  const productId = data.productId;
  const shop = data.shop;
  const _action = data._action || data.action;

  // Log validation details for debugging
  console.log("Validation check:");
  console.log("- customerId:", customerId, "valid:", customerId && customerId.trim() !== '');
  console.log("- productId:", productId, "valid:", productId && productId.trim() !== '' && productId !== 'null' && productId !== 'undefined');
  console.log("- shop:", shop, "valid:", shop && shop.trim() !== '');

  if (!_action) {
    return withCors(request, json({ message: "Missing _action or action field in request body" }, { status: 400 }));
  }

  if (_action === "DELETE_ALL") {
    if (!customerId || !shop) {
      return withCors(request, json({ message: "Missing data. Required: customerId, shop for DELETE_ALL" }, { status: 400 }));
    }
    const ids = data.ids || [];
    if (!Array.isArray(ids) || ids.length === 0) {
      return withCors(request, json({ message: "Missing or empty ids array for DELETE_ALL" }, { status: 400 }));
    }
    await db.wishlist.deleteMany({
      where: {
        id: { in: ids },
        customerId,
        shop,
      },
    });
    return withCors(request, json({ message: "All wishlist items removed", method: _action }));
  }

  // Require core identifiers for DB-backed operations
  if (!customerId || String(customerId).trim() === '') {
    return withCors(request, json({ ok: false, message: 'Invalid or missing customerId', method: _action }, { status: 400 }));
  }

  if (!productId || String(productId).trim() === '' || productId === 'null' || productId === 'undefined') {
    return withCors(request, json({ ok: false, message: 'Missing or invalid productId', method: _action }, { status: 400 }));
  }

  if (!shop || String(shop).trim() === '') {
    return withCors(request, json({ ok: false, message: 'Invalid or missing shop domain', method: _action }, { status: 400 }));
  }

  let response;

  switch (_action) {
    case "CREATE": {
      const parsedQty = data.quantity ? parseInt(data.quantity, 10) : 1;
      const parsedPrice = data.price ? parseFloat(data.price) : null;

      try {
        const wishlist = await db.wishlist.upsert({
          where: {
            customerId_productId_shop: {
              customerId: String(customerId),
              productId: String(productId),
              shop: String(shop),
            },
          },
          update: {
            quantity: { increment: parsedQty },
            productTitle: data.productTitle,
            productImage: data.productImage,
            price: parsedPrice,
          },
          create: {
            customerId: String(customerId),
            productId: String(productId),
            shop: String(shop),
            productTitle: data.productTitle,
            productImage: data.productImage,
            quantity: parsedQty,
            price: parsedPrice,
          },
        });

  response = json({ ok: true, message: "Product added to wishlist", method: _action, wishlisted: true, wishlist });
  return withCors(request, response);
      } catch (e) {
        // Fallback: try find/update/create if composite unique isn't present
        console.warn('[api.wishlist] Upsert failed, falling back:', e?.code || e?.message);
        const existing = await db.wishlist.findFirst({ where: { customerId: String(customerId), productId: String(productId), shop: String(shop) } });
        let wishlist;
        if (existing) {
          wishlist = await db.wishlist.update({ where: { id: existing.id }, data: { quantity: existing.quantity + parsedQty, productTitle: data.productTitle || existing.productTitle, productImage: data.productImage || existing.productImage, price: parsedPrice ?? existing.price } });
        } else {
          wishlist = await db.wishlist.create({ data: { customerId: String(customerId), productId: String(productId), shop: String(shop), productTitle: data.productTitle, productImage: data.productImage, quantity: parsedQty, price: parsedPrice } });
        }

  response = json({ ok: true, message: 'Product added to wishlist (fallback)', method: _action, wishlisted: true, wishlist });
  return withCors(request, response);
      }
    }

    case "PATCH": {
      const updatedWishlist = await db.wishlist.updateMany({
        where: { customerId, shop, productId },
        data: {
          productTitle: data.productTitle,
          productImage: data.productImage,
          quantity: data.quantity ? parseInt(data.quantity) : 1,
          price: data.price ? parseFloat(data.price) : null,
        },
      });
      response = json({ message: "Product updated in wishlist", method: "PATCH", updated: updatedWishlist });
      return withCors(request, response);
    }

    case "DELETE": {
      // Only delete the specific user's wishlist item for that shop/product
      const deletedWishlist = await db.wishlist.findMany({ where: { customerId: String(customerId), productId: String(productId), shop: String(shop) } });
      const result = await db.wishlist.deleteMany({ where: { customerId: String(customerId), productId: String(productId), shop: String(shop) } });

  response = json({ ok: true, message: "Product removed from your wishlist", method: _action, deleted: deletedWishlist, deletedCount: result.count, wishlisted: false });
  return withCors(request, response);
    }

    default:
      return new Response("Method Not Allowed", { status: 405 });
  }
}
