This is a great start on the `BookingNotes` component. The UI looks clean and functional.

Here are a few suggestions for improvement:

1.  **Timestamp Formatting:** Instead of `new Date().toLocaleString()`, let's use a more consistent format like `YYYY-MM-DD HH:mm:ss`. We can create a utility function for this.
2.  **Author Name:** The author is currently hardcoded as "Current User". We should pass the current user's name as a prop to the component.

Please proceed with these changes.