import { useState } from "react";

export default function page({ setlikemodal }) {
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ feedback }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Feedback submitted:", data);
        // Optionally, show a success message
        aetlikemodal(false);
      } else {
        console.error("Error:", data);
        // Optionally, show an error message
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  return (
    <div className="bg-white z-40  mx-auto  w-full">
      <h2 className="text-xl font-semibold">Provide Additional Feedback</h2>
      <p className="font-lg text-wrap mb-4 mt-2">
        Help us improve our AI's responses by sharing details about your
        experience
      </p>
      <textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder="What could be improved?"
        rows={4}
        cols={50}
        className="p-4 focus:outline-none border border-gray-500"
      />
      <br />
      <div className="flex justify-end gap-3 mt-4">
        <button
          className="px-5 py-3 text-lg bg-gray-100 hover:bg-gray-200 rounded-xl"
          onClick={() => setlikemodal(false)}
        >
          No Thanks
        </button>
        <button
          onClick={handleSubmit}
          className="px-5 py-3 text-lg bg-black text-white rounded-xl"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
