# Wishlist Toggle Implementation

## Tasks:
- [ ] Add checkWishlistStatus() function to check existing items on page load
- [ ] Add toggleWishlist() function for add/remove logic
- [ ] Update button UI to show different states (wishlisted vs not wishlisted)
- [ ] Use different icons for different states (outlined vs filled heart)
- [ ] Handle API responses and update UI accordingly
- [ ] Test the toggle functionality

## Implementation Details:
- Use GET request to check wishlist status on page load
- Use POST with _action: "CREATE" to add items
- Use POST with _action: "DELETE" to remove items
- Update button text and icon based on wishlist state
- Handle success/error notifications
