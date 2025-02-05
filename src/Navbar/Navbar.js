import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart, User } from "lucide-react";
import Login from "../Login/login";

const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [medicines, setMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // User authentication state

  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const navigate = useNavigate();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Manage body overflow based on modal state
  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "unset";
  }, [isModalOpen]);

  // Check if user is authenticated on component mount
  useEffect(() => {
    const userToken = localStorage.getItem("userToken");
    setIsAuthenticated(!!userToken);
  }, []);

  const handleUserIconClick = () => {
    if (isAuthenticated) {
      navigate("/profile");
    }
  };

  // Fetch medicines from API
  const getMedicines = async () => {
    const URL = "http://localhost:5001/api/medicines";
    try {
      const response = await fetch(URL);
      if (response.ok) {
        const medicines = await response.json();
        setMedicines(medicines);
      } else {
        console.log("Could not fetch medicines");
      }
    } catch (error) {
      console.log("Internal Server error.");
    }
  };

  useEffect(() => {
    getMedicines();
  }, []);

  const handleSearchInputChange = (e) => {
    const userData = e.target.value;
    setSearchTerm(userData);

    if (userData) {
      const filtered = medicines.filter((medicine) =>
        medicine.name.toLowerCase().startsWith(userData.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (medicineId) => {
    setSearchTerm("");
    setShowSuggestions(false);
    navigate(`/medicine/${medicineId}`);
  };

  return (
    <nav className="shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="text-3xl font-bold text-green-600">
            MediQuick
          </Link>

          {/* Conditionally Render Search Bar */}
          {!isHomePage && (
            <div className="hidden sm:block flex-grow px-4 lg:ml-6">
              <div className="relative max-w-lg w-full">
                <input
                  id="search"
                  name="search"
                  className="block w-full pl-4 pr-12 py-3 border border-gray-300 rounded-md bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 sm:text-lg"
                  placeholder="Search for Medicines/Healthcare products"
                  type="search"
                  value={searchTerm}
                  onChange={handleSearchInputChange}
                  onFocus={() => setShowSuggestions(true)}
                />
                <button
                  type="submit"
                  className="absolute right-0 inset-y-0 px-4 py-2 bg-green-500 text-white rounded-r-md hover:bg-green-600"
                >
                  Search
                </button>

                {showSuggestions && filteredSuggestions.length > 0 && (
                  <ul className="absolute z-10 bg-white border border-gray-300 w-full rounded-md mt-1 max-h-60 overflow-auto shadow-lg">
                    {filteredSuggestions.map((medicine) => (
                      <li
                        key={medicine._id}
                        onClick={() => selectSuggestion(medicine._id)}
                        className="p-2 hover:bg-gray-200 cursor-pointer"
                      >
                        {medicine.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {/* Menu Items */}
          <div className="hidden sm:flex items-center space-x-6">
            <button
              onClick={openModal}
              className="text-gray-700 hover:text-green-500 px-4 py-2 rounded-md text-lg font-medium"
            >
              Login
            </button>
            <Link
              to="/offers"
              className="text-gray-700 hover:text-green-500 px-4 py-2 rounded-md text-lg font-medium"
            >
              Offers
            </Link>
            <Link
              to="/cart"
              className="text-gray-700 hover:text-green-500 p-2 rounded-full hover:bg-gray-100"
            >
              <ShoppingCart className="h-7 w-7" />
            </Link>

            {/* User Icon */}
            <Link
              to={localStorage.getItem('authToken') ? "/profile" : "#"}
              className={`p-2 rounded-full ${
                localStorage.getItem('authToken')
                  ? "text-gray-700 hover:text-green-500"
                  : "text-gray-400 cursor-not-allowed"
              }`}
            >
              <User className="h-7 w-7" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-green-500 focus:outline-none"
              aria-label="Toggle navigation"
            >
              <svg
                className="h-8 w-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-end">
          <div className="bg-white w-64 h-full p-6 flex flex-col space-y-6">
            <button className="self-end text-gray-500" onClick={toggleMenu}>
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <button
              onClick={() => {
                openModal();
                toggleMenu();
              }}
              className="text-gray-700 hover:text-green-500 text-lg font-medium"
            >
              Login
            </button>
            <Link
              to="/offers"
              onClick={toggleMenu}
              className="text-gray-700 hover:text-green-500 text-lg font-medium"
            >
              Offers
            </Link>
            <Link
              to="/cart"
              onClick={toggleMenu}
              className="text-gray-700 hover:text-green-500 text-lg font-medium"
            >
              Cart
            </Link>
            {isAuthenticated && (
              <button
                onClick={() => {
                  handleUserIconClick();
                  toggleMenu();
                }}
                className="text-gray-700 hover:text-green-500 text-lg font-medium"
              >
                Profile
              </button>
            )}
          </div>
        </div>
      )}

      {/* Modal for Login */}
      {isModalOpen && (
        <div className="modal-overlay flex justify-center items-center">
          <div className="bg-white p-6 rounded-md relative z-50">
            <button
              className="absolute top-1 right-3 text-gray-600"
              onClick={closeModal}
            >
              &times;
            </button>
            <Login />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
