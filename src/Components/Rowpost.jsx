import React, { useState, useEffect } from "react";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import axios from "axios";

function Rowpost() {
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [category, setCategory] = useState("Fiction");
    const [search, setSearch] = useState("");
    const [sortOption, setSortOption] = useState("");

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const booksPerPage = 10; // Show 10 b
    // 
    // ooks per page

    useEffect(() => {
        fetchBooks();
    }, [category]);

    const fetchBooks = () => {
        setLoading(true);
        axios.get(`https://www.googleapis.com/books/v1/volumes?q=subject:${category}&maxResults=40`)

            .then((response) => {
                const bookData = response.data.items || [];
                setBooks(bookData);
                setFilteredBooks(bookData);
                setCurrentPage(1); // Reset to first page after fetching new books
            })
            .catch((error) => {
                console.error("Error fetching books:", error);
                setError("Failed to load books.");
            })
            .finally(() => {
                setLoading(false);
            });
    };

   
    useEffect(() => {
        const filtered = books.filter((book) =>
            book.volumeInfo.title.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredBooks(filtered);
        setCurrentPage(1); // Reset to first page when searching
    }, [search, books]);



    // Sorting Function
    useEffect(() => {
        let sortedBooks = [...filteredBooks];

        if (sortOption === "low-to-high") {
            sortedBooks.sort((a, b) => (a.saleInfo?.listPrice?.amount || 0) - (b.saleInfo?.listPrice?.amount || 0));
        } else if (sortOption === "high-to-low") {
            sortedBooks.sort((a, b) => (b.saleInfo?.listPrice?.amount || 0) - (a.saleInfo?.listPrice?.amount || 0));
        } else if (sortOption === "newest") {
            sortedBooks.sort((a, b) => new Date(b.volumeInfo.publishedDate) - new Date(a.volumeInfo.publishedDate));
        }

        setFilteredBooks(sortedBooks);
        setCurrentPage(1); // Reset to first page when sorting
    }, [sortOption]);

    // Pagination Calculation
    const startIndex = (currentPage - 1) * booksPerPage;
    const endIndex = startIndex + booksPerPage;
    const displayedBooks = filteredBooks.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

    
    const handleAddToCart = (book) => {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const isAlreadyInCart = cart.some(item => item.id === book.id);
        
        if (!isAlreadyInCart) {
            const updatedCart = [...cart, book]; 
            localStorage.setItem("cart", JSON.stringify(updatedCart)); 
            
        } else {
            alert("Book is already in the cart! ");
        }
    };


    const handleAddToWishlist = (book) => {
        const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
        const isAlreadyInWishlist = wishlist.some(item => item.id === book.id);
        
        if (!isAlreadyInWishlist) {
            const updatedWishlist = [...wishlist, book];
            localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
          
        } else {
            alert("Book is already in the wishlist! ");
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen dark:bg-black dark:text-white">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">📚 Book Collection</h2>

            {/* Filter & Search Bar */}
            <div className="flex flex-col md:flex-row items-center gap-4 mb-6 justify-center">
                {/* Search Bar */}
                <input
                    type="search"
                    className="border p-2 rounded-md w-full md:w-1/3"
                    placeholder="🔍 Search books..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                {/* Filter & Sorting */}
                <div className="flex gap-4 w-full md:w-auto">
                    {/* Category Filter */}
                    <select
                        className="border p-2 rounded-md w-full md:w-44 dark:bg-black dark:text-white"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="Fiction">Fiction</option>
                        <option value="Science">Science</option>
                        <option value="Business">Business</option>
                        <option value="History">History</option>
                        <option value="Technology">Technology</option>
                    </select>

                    {/* Sorting */}
                    <select
                        className="border p-2 rounded-md w-full md:w-44 dark:bg-black dark:text-white"
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                    >
                        <option value="">Sort By</option>
                        <option value="low-to-high">Price: Low to High</option>
                        <option value="high-to-low">Price: High to Low</option>
                        <option value="newest">Newest Arrivals</option>
                    </select>
                </div>
            </div>

            {/* Loading & Error Messages */}
            {loading && <p className="text-center">Loading...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}

            {/* Books List */}
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
                {displayedBooks.map((book) => {
                    const { title, authors, imageLinks, publishedDate } = book.volumeInfo;
                    const price = book.saleInfo?.listPrice?.amount;
                    const currency = book.saleInfo?.listPrice?.currencyCode;
                    const thumbnail = imageLinks?.thumbnail ;

                    return (
                        <div key={book.id} className="bg-white p-4 shadow-lg rounded-lg">
                            <img src={thumbnail} alt={title} className="w-full h-48 object-cover rounded-md" />
                            <h3 className="text-lg font-semibold mt-3">{title}</h3>
                            <p className="text-sm text-gray-600">{authors ? authors.join(", ") : "Unknown Author"}</p>
                            <p className="text-xs text-gray-500">Published: {publishedDate || ""}</p>
                            <p className="text-md font-bold text-green-600 mt-2">
                                {price ? `${currency} ${price}` : "Price Unavailable"}
                            </p>

                            <div className="flex justify-between mt-4">
                                <button onClick={() => handleAddToCart(book)} className="bg-blue-600 text-white px-3 py-2 rounded-md">
                                    <FaShoppingCart />
                                </button>
                                <button onClick={() => handleAddToWishlist(book)} className="bg-red-500 text-white px-3 py-2 rounded-md">
                                    <FaHeart />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-6">
                <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                    Previous
                </button>
                <span className="mx-4">{currentPage} / {totalPages}</span>
                <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
                    Next
                </button>
            </div>
        </div>
    );
}

export default Rowpost;
