# Add to Wishlist Extension

This extension adds a wishlist functionality to your Shopify store, allowing customers to add products to their wishlist and manage them.

## Features

- ❤️ Heart icon button that toggles between add/remove from wishlist
- Visual feedback with filled/unfilled heart icons
- Toast notifications for user feedback
- Responsive design that works on all devices
- Database storage for wishlist items
- Customer-specific wishlists (optional)
- **Single File Implementation** - All code consolidated into one Liquid file

## Installation Steps

### 1. Deploy the Extension

1. Make sure your Shopify app is running:
   ```bash
   npm run dev
   ```

2. Deploy the extension to your development store:
   ```bash
   npm run shopify app deploy -- --source extensions/add-to-wishlist-icon
   ```

### 2. Add the Wishlist Button to Your Theme

#### Option A: Using the Block (Recommended)
1. Go to your Shopify Admin
2. Navigate to **Online Store > Themes**
3. Click **Customize** on your theme
4. In the theme editor, look for sections where you want to add the wishlist button:
   - Product pages (product template)
   - Collection pages
   - Search results
5. Add a new **Section** or **Block** and select **Wishlist Button**
6. Configure the settings:
   - **Product**: Auto-filled with current product
   - **Button Text**: "Add to Wishlist" (customizable)

#### Option B: Manual Installation
If you prefer to manually add the button:

1. **Copy the entire content** from `extensions/add-to-wishlist-icon/blocks/wishlist-btn.liquid`
2. **Paste it into your theme** at the desired location (product pages, collection pages, etc.)

### 3. Test the Functionality

1. **Add to Cart and Buy Now buttons** should now have a wishlist button below them
2. **Click the heart icon** to add a product to wishlist
3. **Click again** to remove it from wishlist
4. **Visual feedback**: Heart icon fills when product is in wishlist
5. **Notifications**: Popup messages appear for user feedback

## API Endpoints

The extension creates the following API endpoints:

- `GET /api/wishlist?productId={id}` - Check if product is in wishlist
- `POST /api/wishlist` - Add/remove product from wishlist
- `GET /api/wishlist/all` - Get all wishlist items

## Database Schema

The wishlist data is stored in the `Wishlist` model with the following fields:
- `id` - Primary key
- `customerId` - Customer identifier (optional)
- `productId` - Shopify product ID
- `productTitle` - Product title
- `productImage` - Product image URL
- `price` - Product price
- `quantity` - Quantity (default: 1)
- `shop` - Shop domain
- `createdAt` - Creation timestamp

## Key Features

### **1. Single File Design**
- All HTML, CSS, JavaScript, and schema in one file
- Uses Alpine.js for reactivity
- No external dependencies required
- Easy to deploy and maintain

### **2. Visual Design**
- ❤️ Heart icon that fills when product is in wishlist
- Smooth animations and hover effects
- Responsive design for all devices
- Beautiful popup notifications with checkmark/cross animations

### **3. Functionality**
- **Add to Wishlist**: Click to add product with all details
- **Remove from Wishlist**: Click again to remove
- **Database Storage**: All wishlist items stored in your database
- **Customer Tracking**: Supports customer-specific wishlists
- **Real-time Updates**: Synchronizes across multiple buttons

### **4. User Experience**
- **Login Check**: Prompts users to login if not authenticated
- **Visual Feedback**: Animated popup notifications
- **Responsive**: Works perfectly on mobile and desktop
- **Accessibility**: Proper ARIA labels and keyboard support

## Customization

### Styling
All styles are included in the single file. You can modify:
- Colors and themes
- Button sizes and spacing
- Animation timings
- Popup positioning

### Functionality
The JavaScript is embedded in the file. You can customize:
- API endpoints
- Notification messages
- Animation behaviors
- Error handling

### Block Settings
- **Product**: Auto-filled with current product
- **Button Text**: Customizable text for the button

## Troubleshooting

### Button not appearing
1. Check if the extension is properly deployed
2. Verify the block is added to the correct template
3. Check browser console for JavaScript errors

### Button not working
1. Ensure the API route is accessible at `/api/wishlist`
2. Check that the database is properly configured
3. Verify customer authentication is working

### Styling issues
1. Check if Alpine.js is loaded in your theme
2. Ensure no conflicting CSS rules
3. Test on different devices and browsers

## Technical Details

### Alpine.js Integration
- Uses Alpine.js for reactive data binding
- Handles button state changes
- Manages popup visibility and animations

### API Communication
- Fetches wishlist status on page load
- Sends POST requests to add/remove items
- Handles errors gracefully

### Responsive Design
- Mobile-first approach
- Flexible layouts for different screen sizes
- Touch-friendly button sizes

## Files Structure

```
extensions/add-to-wishlist-icon/
├── shopify.extension.toml          # Extension configuration
├── blocks/
│   └── wishlist-btn.liquid         # Complete wishlist implementation
├── assets/
│   ├── thumbs-up.png               # (existing asset)
│   ├── wishlist.js                 # (deprecated - functionality moved to liquid)
│   ├── wishlist.css                # (deprecated - styles moved to liquid)
│   └── test.html                   # Test page
└── locales/
    └── en.default.json             # Translation strings
```

## Support

For issues or questions:
1. Check the browser console for errors
2. Verify all files are properly deployed
3. Test the API endpoints directly
4. Check the database for wishlist entries

## Migration from Multi-File Version

If you were using the previous multi-file version:
1. Remove the separate `wishlist.js` and `wishlist.css` files
2. Update your theme to use the new consolidated block
3. No other changes needed - all functionality is preserved
