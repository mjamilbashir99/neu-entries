import Banner from "./component/Banner";

export default function Home() {
  return (
    <div className="p-5 bg-white">
      <div className="relative">
        <Banner
          title1={"Reflect and grow"}
          title2={"with AI-enhanced journaling"}
          img={"/banner.webp"}
          title4={"The world's first AI-powered journal"}
        />
      </div>
    </div>
  );
}
