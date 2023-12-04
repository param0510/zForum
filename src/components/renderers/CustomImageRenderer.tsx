import Image from "next/image";

const CustomImageRenderer = ({ data }: any) => {
  // Sample data object for image render
  // var imgData = {
  //   file: {
  //     url: "https://uploadthing.com/f/0c9475b5-071d-4328-9e23-2480670d7f8c-c0vngh.jpg",
  //   },
  //   caption: "RBC Headquarters",
  //   withBorder: false,
  //   stretched: false,
  //   withBackground: false,
  // };
  const url = data.file.url;
  const caption = data.caption;
  return (
    <div className="relative min-h-[15rem] w-full">
      <Image alt={caption} className="object-contain" fill src={url} />
    </div>
  );
};

export default CustomImageRenderer;
