import { IoIosArrowRoundForward } from "react-icons/io";

const ToogleStartBtn = () => {
  return (
    <div className="group rounded-full p-[3px] bg-white h-12 w-40 flex z-30 mt-10 relative">
      <button className="group-hover:w-full  p-2 bg-blue-400 text-white rounded-full text-lg  flex justify-end items-center">
        <IoIosArrowRoundForward className="" size={30} />
      </button>
      <p className="ml-2 absolute top-[50%] translate-y-[-50%] right-5 text-black group-hover:right-10 group-hover:text-white transition-all">
        Start Writing
      </p>
    </div>
  );
};

export default ToogleStartBtn;
