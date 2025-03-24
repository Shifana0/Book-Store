import React, { useState, useEffect } from "react";

function Cart() {
    const [cart, setCart] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [showCheckout, setShowCheckout] = useState(false);
    const [orderCompleted, setOrderCompleted] = useState(false);
    const [shippingDetails, setShippingDetails] = useState({
        name: "",
        email: "",
        address: "",
    });
    const [errors, setErrors] = useState({});

    // Fetch cart items from localStorage on mount
    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(storedCart);
        calculateTotalPrice(storedCart);
    }, []);

    // Calculate total price
    const calculateTotalPrice = (cartItems) => {
        const total = cartItems.reduce((acc, book) => acc + (book.saleInfo?.listPrice?.amount || 0), 0);
        setTotalPrice(total);
    };

    // Remove item from cart
    const handleRemoveFromCart = (bookId) => {
        const updatedCart = cart.filter((book) => book.id !== bookId);
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        calculateTotalPrice(updatedCart);
    };

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShippingDetails({ ...shippingDetails, [name]: value });
    };

    // Validate form
    const validateForm = () => {
        let formErrors = {};
        if (!shippingDetails.name.trim()) formErrors.name = "Name is required";
        if (!shippingDetails.email.trim()) formErrors.email = "Email is required";
        if (!shippingDetails.address.trim()) formErrors.address = "Address is required";
        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    // Handle Checkout
    const handleCheckout = () => {
        if (!validateForm()) return;

        setOrderCompleted(true);
        setCart([]);
        localStorage.removeItem("cart");
        setTotalPrice(0);
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen dark:bg-black ">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">🛒 Your Cart</h2>

            {cart.length === 0 ? (
                <p className="text-center text-gray-600 dark:text-white">Your cart is empty!</p>
            ) : (
                <>
                    {/* Books List */}
                    <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {cart.map((book) => {
                            const { title, authors, imageLinks, publishedDate } = book.volumeInfo;
                            const price = book.saleInfo?.listPrice?.amount;
                            const currency = book.saleInfo?.listPrice?.currencyCode;
                            const thumbnail = imageLinks?.thumbnail || "";

                            return (
                                <div key={book.id} className="bg-white p-4 shadow-lg rounded-lg">
                                    {/* Book Cover */}
                                    <img src={thumbnail} alt={title} className="w-full h-48 object-cover rounded-md" />

                                    {/* Book Details */}
                                    <h3 className="text-lg font-semibold mt-3">{title}</h3>
                                    <p className="text-sm text-gray-600">{authors ? authors.join(", ") : "Unknown Author"}</p>
                                    <p className="text-xs text-gray-500">Published: {publishedDate || ""}</p>

                                    {/* Price */}
                                    <p className="text-md font-bold text-green-600 mt-2">
                                        {price ? `${currency} ${price}` : "Price Unavailable"}
                                    </p>

                                    {/* Remove Button */}
                                    <button 
                                        onClick={() => handleRemoveFromCart(book.id)}
                                        className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 w-full"
                                    >
                                        Remove 
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    {/* Total Price */}
                    <div className="mt-6 text-xl font-bold text-gray-800">
                        Total Price: <span className="text-green-600">${totalPrice.toFixed(2)}</span>
                    </div>

                    {/* Checkout Button */}
                    <button
                        onClick={() => setShowCheckout(true)}
                        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                    >
                        Proceed to Checkout
                    </button>
                </>
            )}

            {/* Checkout Modal */}
            {showCheckout && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h3 className="text-xl font-bold mb-4">🚚 Shipping Details</h3>

                        {orderCompleted ? (
                            <div className="text-center text-green-600 text-lg font-bold">
                                ✅ Order Completed! Thank you for your purchase.
                            </div>
                        ) : (
                            <form className="space-y-4">
                                <div>
                                    <label className="block text-gray-700">Full Name:</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={shippingDetails.name}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded-md"
                                    />
                                    {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                                </div>
                                <div>
                                    <label className="block text-gray-700">Email:</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={shippingDetails.email}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded-md"
                                    />
                                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                                </div>
                                <div>
                                    <label className="block text-gray-700">Address:</label>
                                    <textarea
                                        name="address"
                                        value={shippingDetails.address}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded-md"
                                    />
                                    {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
                                </div>

                                {/* Checkout Button */}
                                <button
                                    type="button"
                                    onClick={handleCheckout}
                                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                                >
                                    Place Order
                                </button>
                            </form>
                        )}

                        {/* Close Modal Button */}
                        <button
                            onClick={() => {
                                setShowCheckout(false);
                                setOrderCompleted(false);
                            }}
                            className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 w-full"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Cart;
