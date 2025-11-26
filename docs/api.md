# API Documentation

## Authentication

### Login
- **POST** `/token`
- **Body**: `username`, `password`
- **Response**: `access_token`, `token_type`

### Register
- **POST** `/users/`
- **Body**: `username`, `email`, `password`
- **Response**: User object

### Get Current User
- **GET** `/users/me`
- **Headers**: `Authorization: Bearer <token>`

## Menu

### Get Menu Items
- **GET** `/menu/`
- **Response**: List of menu items

### Create Menu Item (Admin)
- **POST** `/menu/`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `name`, `description`, `price`, `category`, `is_available`

### Update Menu Item (Admin)
- **PUT** `/menu/{item_id}`
- **Headers**: `Authorization: Bearer <token>`

### Delete Menu Item (Admin)
- **DELETE** `/menu/{item_id}`
- **Headers**: `Authorization: Bearer <token>`

## Orders

### Create Order
- **POST** `/orders/`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `items: [{menu_item_id, quantity}]`

### Get Orders
- **GET** `/orders/`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: List of orders (User sees own, Admin sees all)

### Update Order Status (Admin)
- **PUT** `/orders/{order_id}/status`
- **Headers**: `Authorization: Bearer <token>`
- **Query**: `status` (pending, paid, completed, cancelled)

## Admin

### Get Stats
- **GET** `/admin/stats`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `total_orders`, `total_revenue`, `pending_orders`, `completed_orders`
