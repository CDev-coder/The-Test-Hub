import { useQuery } from "@tanstack/react-query";

const mockMuscleData = {
  Head: {
    name: "Head",
    exercises: ["Neck Flexion", "Neck Extension", "Neck Rotation"],
  },
  Neck: {
    name: "Neck",
    exercises: [
      "Neck Curls",
      "Neck Bridges",
      "Resistance Band Neck Extensions",
    ],
  },
  RearDelt: {
    name: "Rear Delt",
    exercises: ["Face Pulls", "Reverse Pec Deck", "Bent-Over Rear Delt Raises"],
  },
  Traps: {
    name: "Traps",
    exercises: ["Barbell Shrugs", "Farmer's Carries", "Upright Rows"],
  },
  Tricep: {
    name: "Triceps",
    exercises: [
      "Skullcrushers",
      "Tricep Pushdowns",
      "Overhead Tricep Extensions",
    ],
  },
  Lats: {
    name: "Lats",
    exercises: ["Lat Pull Down", "Barbell Row", "Single Arm Barbel Row"],
  },
  UpperBack: {
    name: "UpperBack",
    exercises: ["Pull-Ups", "Bent-Over Rows", "Lat Pulldowns"],
  },
  LowerBack: {
    name: "LowerBack",
    exercises: ["Deadlifts", "Back Extensions", "Good Mornings"],
  },
  Hamstring: {
    name: "Hamstring",
    exercises: ["Romanian Deadlifts", "Leg Curls", "Glute-Ham Raises"],
  },
  Shoulder: {
    name: "Shoulder",
    exercises: ["Overhead Press", "Lateral Raises", "Arnold Press"],
  },
  Chest: {
    name: "Chest",
    exercises: ["Bench Press", "Push-Ups", "Chest Flyes"],
  },
  UpperAbs: {
    name: "UpperAbs",
    exercises: ["Crunches", "Cable Crunches", "Sit-Ups"],
  },

  Obliques: {
    name: "Obliques",
    exercises: ["Side Plank", "Hanging Oblique Raise", "Bicycle Crunch"],
  },
  LowerAbs: {
    name: "LowerAbs",
    exercises: ["Leg Raises", "Reverse Crunches", "Hanging Leg Raises"],
  },
  Bicep: {
    name: "Bicep",
    exercises: ["Barbell Curl", "Hammer Curl", "Concentration Curl"],
  },
  Forearm: {
    name: "Forearm",
    exercises: ["Wrist Curls", "Reverse Wrist Curls", "Farmer’s Walk"],
  },
  Quad: {
    name: "Quad",
    exercises: ["Squats", "Lunges", "Leg Press"],
  },
  Calf: {
    name: "Calf",
    exercises: ["Seated calf raise", "Single-Leg Calf Raise", "Calf Press"],
  },
};

const fetchMuscleData = async (groupId: string) => {
  await new Promise((res) => setTimeout(res, 300));
  if (!mockMuscleData[groupId as keyof typeof mockMuscleData]) {
    throw new Error("Muscle not found");
  }
  return mockMuscleData[groupId as keyof typeof mockMuscleData];
};

export const useMuscleData = (groupId: string | null) =>
  useQuery({
    queryKey: ["muscle", groupId],
    queryFn: () => fetchMuscleData(groupId!),
    enabled: !!groupId, // only fetch if groupId exists
  });
