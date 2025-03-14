// "use client";
// import { useState, useRef, useEffect } from "react";
// import { CiImageOn } from "react-icons/ci";
// import { HiOutlineMicrophone } from "react-icons/hi2";

// const page = () => {
//   const [image, setImage] = useState(null);
//   const [isRecording, setIsRecording] = useState(false);
//   const [audioUrl, setAudioUrl] = useState(null);
//   const [audioBlob, setAudioBlob] = useState(null);
//   const [prompt, setPrompt] = useState(""); // State for the input prompt
//   const [currentDate, setCurrentDate] = useState(""); // State for the current date
//   let mediaRecorderRef = useRef(null); // useRef to persist mediaRecorder across renders
//   let audioChunks = useRef([]); // Using useRef to avoid resetting chunks on re-render

//   // UseEffect to fetch the current date and set it
//   useEffect(() => {
//     const today = new Date();
//     const formattedDate = new Intl.DateTimeFormat("en-US", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     }).format(today);
//     setCurrentDate(formattedDate);
//   }, []); // Empty dependency array to run only on initial render

//   const handleFileChange = async (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setImage(URL.createObjectURL(file)); // Create a URL for the uploaded image immediately
//     }
//   };

//   const handleMicClick = async () => {
//     if (isRecording) {
//       // Stop recording if mediaRecorder is available and recording
//       if (
//         mediaRecorderRef.current &&
//         mediaRecorderRef.current.state !== "inactive"
//       ) {
//         mediaRecorderRef.current.stop();
//         setIsRecording(false);
//         console.log("Recording stopped!");
//       }
//     } else {
//       // Start recording
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({
//           audio: true,
//         });

//         const mediaRecorder = new MediaRecorder(stream);
//         mediaRecorderRef.current = mediaRecorder;

//         mediaRecorder.ondataavailable = (event) => {
//           audioChunks.current.push(event.data);
//         };

//         mediaRecorder.onstop = async () => {
//           const audioBlob = new Blob(audioChunks.current, {
//             type: "audio/mp3",
//           });
//           const audioUrl = URL.createObjectURL(audioBlob);
//           setAudioUrl(audioUrl);
//           setAudioBlob(audioBlob);
//           audioChunks.current = [];
//         };

//         mediaRecorder.start();
//         setIsRecording(true);
//         console.log("Recording started!");
//       } catch (error) {
//         console.error("Error accessing microphone:", error);
//       }
//     }
//   };

//   const handlePromptChange = (e) => {
//     setPrompt(e.target.value); // Set the prompt text from input field
//   };

//   const saveData = async () => {
//     const formData = new FormData();

//     if (image) {
//       formData.append("image", image); // Add the image file to the formData
//     }
//     if (audioBlob) {
//       formData.append("audio", audioBlob, "audio.mp3"); // Add the audio file to the formData
//     }
//     formData.append("prompt", prompt); // Add the prompt text to the formData

//     // Log FormData content for debugging
//     for (let [key, value] of formData.entries()) {
//       console.log(key, value);
//     }
//     console.log("image client", image);
//     try {
//       const response = await fetch("http://localhost:3000/api/addentries", {
//         method: "POST",
//         body: formData, // Directly pass the formData object
//         // Do not set 'Content-Type' header manually
//       });

//       // Check if the response is successful
//       if (!response.ok) {
//         throw new Error(`Server error: ${response.statusText}`);
//       }

//       // Try parsing the response as JSON
//       const result = await response.json();

//       console.log(result); // Log the parsed response
//     } catch (error) {
//       console.error("API call failed:", error);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center space-y-4 bg-gray-100 h-screen py-10 px-5">
//       {currentDate && (
//         <div className="text-lg font-semibold text-gray-700">
//           <p>{currentDate}</p>
//         </div>
//       )}

//       <div className="flex flex-col items-center space-y-2 w-full max-w-md">
//         <input
//           type="text"
//           id="prompt"
//           name="prompt"
//           value={prompt}
//           onChange={handlePromptChange}
//           className="p-3 rounded-md border-b-2 text-gray-700 border-b-gray-300 w-full focus:border-none focus:ring-0 focus:shadow-none"
//           placeholder="Enter a prompt here"
//         />
//       </div>

//       {image && (
//         <div className="flex justify-center items-center w-full">
//           <img
//             src={image}
//             alt="Uploaded"
//             className="rounded-lg shadow-md max-w-xs"
//           />
//         </div>
//       )}

//       <button
//         onClick={handleMicClick}
//         className={`p-4 bg-gray-300 text-gray-700 rounded-full hover:bg-transparent transition duration-300 ${
//           isRecording ? "bg-red-500" : "bg-gray-300"
//         }`}
//       >
//         <HiOutlineMicrophone size={30} />
//       </button>

//       <div className="flex justify-center items-center space-x-3">
//         <label
//           htmlFor="file-upload"
//           className="cursor-pointer p-4 bg-gray-300 text-gray-700 rounded-full hover:bg-gray-200 transition duration-300"
//         >
//           <CiImageOn size={30} />
//         </label>
//         <input
//           type="file"
//           name="image"
//           id="file-upload"
//           accept="image/*"
//           onChange={handleFileChange}
//           className="hidden"
//         />
//       </div>

//       {audioUrl && (
//         <div className="mt-4 w-full max-w-md">
//           <h3 className="text-lg font-semibold text-gray-700">Recording:</h3>
//           <audio controls className="w-full" download>
//             <source src={audioUrl} type="audio/wav" />
//             Your browser does not support the audio element.
//           </audio>
//         </div>
//       )}

//       <button
//         onClick={saveData}
//         className="p-4 bg-blue-500 text-white rounded-md hover:bg-blue-400 transition duration-300"
//       >
//         Save Chat
//       </button>
//     </div>
//   );
// };

// export default page;

"use client";
import { useState, useRef, useEffect } from "react";
import { CiImageOn } from "react-icons/ci";
import { HiOutlineMicrophone } from "react-icons/hi2";

const Page = () => {
  const [imageFile, setImageFile] = useState(null); // Store the File object
  const [imagePreview, setImagePreview] = useState(null); // Store preview URL separately
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);

  useEffect(() => {
    const today = new Date();
    const formattedDate = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(today);
    setCurrentDate(formattedDate);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file); // Store the actual File object
      setImagePreview(URL.createObjectURL(file)); // Store preview URL separately
    }
  };

  const handleMicClick = async () => {
    if (isRecording) {
      if (mediaRecorderRef.current?.state !== "inactive") {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
      }
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          audioChunks.current.push(event.data);
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks.current, {
            type: "audio/mp3",
          });
          setAudioBlob(audioBlob);
          setAudioUrl(URL.createObjectURL(audioBlob));
          audioChunks.current = [];
          stream.getTracks().forEach((track) => track.stop()); // Clean up stream
        };

        mediaRecorder.start();
        setIsRecording(true);
      } catch (error) {
        console.error("Error accessing microphone:", error);
      }
    }
  };

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
  };

  // const saveData = async () => {
  //   const formData = new FormData();

  //   if (imageFile) {
  //     formData.append("image", imageFile); // Use the File object, not the URL
  //   }
  //   if (audioBlob) {
  //     formData.append("voiceChat", audioBlob, "recording.mp3"); // Changed to voiceChat to match backend
  //   }
  //   formData.append("prompt", prompt);

  //   // Debug logging
  //   for (let [key, value] of formData.entries()) {
  //     console.log(`${key}:`, value);
  //   }

  //   try {
  //     const response = await fetch("http://localhost:3000/api/addentries", {
  //       // Update to match your API route
  //       method: "POST",
  //       body: formData,
  //     });

  //     if (!response.ok) {
  //       throw new Error(`Server error: ${response.statusText}`);
  //     }

  //     const result = await response.json();
  //     console.log("Server response:", result);
  //   } catch (error) {
  //     console.error("API call failed:", error);
  //   }
  // };

  return (
    <div className="flex flex-col items-center space-y-4 bg-gray-100 h-screen py-10 px-5">
      {currentDate && (
        <div className="text-lg font-semibold text-gray-700">
          <p>{currentDate}</p>
        </div>
      )}

      <div className="flex flex-col items-center space-y-2 w-full max-w-md">
        <input
          type="text"
          id="prompt"
          name="prompt"
          value={prompt}
          onChange={handlePromptChange}
          className="p-3 rounded-md border-b-2 text-gray-700 border-b-gray-300 w-full focus:border-none focus:ring-0 focus:shadow-none"
          placeholder="Enter a prompt here"
        />
      </div>

      {imagePreview && (
        <div className="flex justify-center items-center w-full">
          <img
            src={imagePreview}
            alt="Uploaded"
            className="rounded-lg shadow-md max-w-xs"
          />
        </div>
      )}

      <button
        onClick={handleMicClick}
        className={`p-4 rounded-full hover:bg-transparent transition duration-300 ${
          isRecording ? "bg-red-500" : "bg-gray-300"
        }`}
      >
        <HiOutlineMicrophone size={30} />
      </button>

      <div className="flex justify-center items-center space-x-3">
        <label
          htmlFor="file-upload"
          className="cursor-pointer p-4 bg-gray-300 text-gray-700 rounded-full hover:bg-gray-200 transition duration-300"
        >
          <CiImageOn size={30} />
        </label>
        <input
          type="file"
          name="image"
          id="file-upload"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      {audioBlob && (
        <div className="mt-4 w-full max-w-md">
          <h3 className="text-lg font-semibold text-gray-700">Recording:</h3>
          <audio controls className="w-full">
            <source src={audioUrl} type="audio/mp3" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
      <button
        // onClick={saveData}
        className="p-4 bg-blue-500 text-white rounded-md hover:bg-blue-400 transition duration-300"
      >
        Save Chat
      </button>
    </div>
  );
};

export default Page;
