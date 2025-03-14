"use client";
import { useState, useRef } from "react";
import { HiOutlineMicrophone } from "react-icons/hi2";

const Page = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);

  const handleMicClick = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
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

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunks.current, {
            type: "audio/mp3",
          });
          const audioFile = new File([audioBlob], "recording.mp3", {
            type: "audio/mp3",
          });

          // Upload audio to backend
          await uploadAudio(audioFile);

          setAudioUrl(URL.createObjectURL(audioBlob));
          audioChunks.current = [];
          stream.getTracks().forEach((track) => track.stop());
        };

        mediaRecorder.start();
        setIsRecording(true);
      } catch (error) {
        console.error("Error accessing microphone:", error);
      }
    }
  };

  // Upload function
  const uploadAudio = async (file) => {
    const formData = new FormData();
    formData.append("audio", file);

    try {
      const response = await fetch("/api/addentries", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("File uploaded:", data);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 bg-gray-100 h-screen py-10 px-5">
      <button
        onClick={handleMicClick}
        className={`p-4 rounded-full transition duration-300 ${
          isRecording ? "bg-red-500" : "bg-gray-300"
        }`}
      >
        <HiOutlineMicrophone size={30} />
      </button>

      {audioUrl && (
        <audio controls className="mt-4 w-full max-w-md">
          <source src={audioUrl} type="audio/mp3" />
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
};

export default Page;
