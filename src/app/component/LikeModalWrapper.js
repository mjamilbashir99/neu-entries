import React from "react";
import { IoMdClose } from "react-icons/io";

const LikeModalWrapper = ({ children, setlikemodal }) => {
  const handleCloseModal = () => {
    setlikemodal(false); // Close modal when the overlay is clicked
  };

  const handleModalContentClick = (e) => {
    e.stopPropagation(); // Stop the click event from propagating to the overlay
  };

  return (
    <div
      className="fixed top-0 right-0 left-0 bottom-0 flex justify-center items-center z-50"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
      onClick={handleCloseModal}
    >
      <dialog
        className="mx-auto p-6  rounded-lg relative bg-white w-[600px]"
        open
        onClick={handleModalContentClick} // Prevent closing when clicking inside modal content
      >
        <IoMdClose
          className="absolute top3 right-3 cursor-pointer"
          onClick={() => setlikemodal(false)}
        />
        {children}
      </dialog>
    </div>
  );
};

export default LikeModalWrapper;
