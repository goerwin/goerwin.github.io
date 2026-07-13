export default function GradientBackground() {
  return (
    <>
      <div className="absolute top--24 left-[calc(50%+1rem)] -z-10 h-128 w-lg rounded-full bg-[#fbe2e3] blur-[200px] dark:bg-[#2e0507]" />
      <div className="absolute top--4 left-[calc(50%-40rem)] -z-10 h-128 w-200 rounded-full bg-[#dbd7fb] blur-[200px] dark:bg-[#6a5ae4]" />
    </>
  );
}
