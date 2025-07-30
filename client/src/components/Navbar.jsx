import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-white border-gray-200 border-b drop-shadow-md">
      <div className="w-full flex flex-wrap items-center justify-between mx-auto !py-[0.2rem] !px-[0.8rem]">
        <Link
          href="https://flowbite.com/"
          className="flex items-center !space-x-[0.5rem] rtl:space-x-reverse"
        >
          <img
            src="https://png.pngtree.com/png-vector/20240820/ourmid/pngtree-food-restaurant-logo-vector-png-image_13531729.png"
            className="h-16"
            alt="Flowbite Logo"
          />
          <span className="self-center hide-below-420 sm:text-2xl text-lg font-semibold whitespace-nowrap">
            Anurag fast food centre
          </span>
        </Link>
        <div className="flex items-center md:order-2 !space-x-[1rem] md:space-x-0 rtl:space-x-reverse">
          <button
            type="button"
            className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300"
            id="user-menu-button"
            aria-expanded="false"
            data-dropdown-toggle="user-dropdown"
            data-dropdown-placement="bottom"
          >
            <span className="sr-only">Open user menu</span>
            <img
              className="w-8 h-8 rounded-full"
              src="https://static.vecteezy.com/system/resources/previews/012/210/707/non_2x/worker-employee-businessman-avatar-profile-icon-vector.jpg"
              alt="user photo"
            />
          </button>
          
          <button
            data-collapse-toggle="navbar-user"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            aria-controls="navbar-user"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
