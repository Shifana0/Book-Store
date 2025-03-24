import React, { useEffect, useState } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';

function Theme() {
    const [theme, setTheme] = useState(
        localStorage.getItem("currentTheme") === "light" ? "light" : "dark"
    );

    useEffect(() => {
        if (theme === "light") {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("currentTheme", "light");
        } else {
            document.documentElement.classList.add("dark");
            localStorage.setItem("currentTheme", "dark");
        }
    }, [theme]);

    return (
        <div>
            <button
                className="text-white mr-10 px-4 py-2 rounded-2xl bg-[#403d34] flex items-center gap-2"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
                {theme === "dark" ?  <FaMoon className="text-gray-300" /> : <FaSun className="text-yellow-400" />}
            </button>
        </div>
    );
}

export default Theme;
