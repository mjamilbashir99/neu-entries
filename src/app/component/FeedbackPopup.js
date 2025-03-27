import React from "react";

const FeedbackPopup = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-96"
        onClick={(e) => e.stopPropagation()} // Prevents click from closing the popup
      >
        <h2 className="text-xl font-semibold mb-4">
          Provide Additional Feedback?
        </h2>
        <p className="mb-4 text-sm text-gray-600">
          Help us improve our AI's responses by sharing details about your
          experience.
        </p>
        <form className="space-y-4">
          <textarea
            placeholder="What could be improved?"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              No thanks
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackPopup;
