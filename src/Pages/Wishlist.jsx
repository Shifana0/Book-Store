import React, { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import Navbar from "../Components/Navbar";

function Wishlist() {
    const [wishlist, setWishlist] = useState([]);

    // Load Wishlist from localStorage
    useEffect(() => {
        const savedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
        setWishlist(savedWishlist);
    }, []);

    // Remove book from wishlist
    const removeFromWishlist = (bookId) => {
        const updatedWishlist = wishlist.filter((book) => book.id !== bookId);
        setWishlist(updatedWishlist);
        localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen dark:bg-black">
            <Navbar/>
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">❤️ Your Wishlist</h2>

            {/* No Wishlist Items */}
            {wishlist.length === 0 ? (
                <p className="text-center text-gray-500">Your wishlist is empty.</p>
            ) : (
                <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {wishlist.map((book) => {
                        const { title, authors, imageLinks, publishedDate } = book.volumeInfo;
                        const price = book.saleInfo?.listPrice?.amount;
                        const currency = book.saleInfo?.listPrice?.currencyCode;
                        const thumbnail = imageLinks?.thumbnail || "https://via.placeholder.com/128x192";

                        return (
                            <div key={book.id} className="bg-white p-4 shadow-lg rounded-lg">
                                {/* Book Cover */}
                                <img src={thumbnail} alt={title} className="w-full h-48 object-cover rounded-md" />

                                {/* Book Details */}
                                <h3 className="text-lg font-semibold mt-3">{title}</h3>
                                <p className="text-sm text-gray-600">{authors ? authors.join(", ") : "Unknown Author"}</p>
                                <p className="text-xs text-gray-500">Published: {publishedDate || "N/A"}</p>

                                {/* Price */}
                                <p className="text-md font-bold text-green-600 mt-2">
                                    {price ? `${currency} ${price}` : "Price Unavailable"}
                                </p>

                                {/* Remove from Wishlist */}
                                <button
                                    onClick={() => removeFromWishlist(book.id)}
                                    className="mt-4 flex items-center bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600"
                                >
                                    <FaTrash className="mr-2" /> Remove
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default Wishlist;
