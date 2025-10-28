export const getRandomPosition = (index: number) => {
  const positions = [
    "top-40 left-[20%] rotate-[-5deg]",
    "top-80 left-[25%] rotate-[-7deg]",
    "top-25 left-[40%] rotate-[8deg]",
    "top-64 left-[55%] rotate-[10deg]",
    "top-40 right-[35%] rotate-[2deg]",
    "top-84 left-[45%] rotate-[-7deg]",
    "top-28 left-[30%] rotate-[4deg]",
  ];
  return positions[index % positions.length];
};
