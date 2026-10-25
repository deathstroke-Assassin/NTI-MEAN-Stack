# Casual Shop API

All endpoints use the `/api/v1.0` prefix and return JSON. Start the server with `npm start` (or the configured start command) and use the port in `.env`.

## Seed the sample database

Run `npm run seed:demo` to create exactly 5 categories, 50 products, and 150 orders total. Orders are generated across the previous two calendar months in UTC. The seed is repeatable: it replaces only records tagged by this seed and preserves unseeded records. If unseeded records already exist, it fills the remaining count up to each target; it stops without changing the sample data if a collection already exceeds its target.

## Catalog

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/categories` | List categories |
| `POST` | `/categories/store` | Create a category (`name`, `description`) |
| `POST` | `/categories/update` | Update a category (`id`, `name`, `description`) |
| `GET` | `/products` | List products with category names |
| `GET` | `/products/show/:id` | Get one product |
| `POST` | `/products/store` | Create a product (`name`, `price`, `categoryId`, optional `photo`) |
| `DELETE` | `/products/destroy/:id` | Delete a product |

Product uploads use `multipart/form-data` with the `photo` field; JSON is accepted when no image is uploaded.

## Orders

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/orders?date=YYYY-MM-DD&status=Pending` | List/filter orders; both filters are optional and date is UTC |
| `POST` | `/orders` | Create an order; the server looks up prices and calculates `quantity` and `total` |
| `GET` | `/orders/:id` | Get one order |
| `PATCH` | `/orders/:id/status` | Append a status update (`Pending`, `In Progress`, or `Completed`) |

Example order request:

```json
{
  "customer": {
    "customerName": "Mariam Adel",
    "customerPhone": "01012345678",
    "customerAddress": "Cairo"
  },
  "products": [
    { "productId": "PRODUCT_OBJECT_ID", "quantity": 2 }
  ]
}
```

## Reports

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/reports/products?categoryId=CATEGORY_OBJECT_ID` | List products, optionally filtered by category |
| `GET` | `/reports/orders?date=YYYY-MM-DD&status=Completed` | Report orders, optionally filtered by UTC date and current status, including count and total revenue |
