import { useQuery } from "@tanstack/react-query";

const mockMuscleData = {
  Head: {
    name: "Head",
    fact: [],
    exercises: ["Neck Flexion", "Neck Extension", "Neck Rotation"],
  },
  Neck: {
    name: "Neck",
    fact: [
      "Strengthening your neck muscles can improve posture and reduce the risk of tension headaches.",
      "A strong neck is crucial for contact sports and injury prevention.",
    ],
    exercises: [
      "Neck Curls",
      "Neck Bridges",
      "Resistance Band Neck Extensions",
    ],
  },
  RearDelt: {
    name: "Rear Delts (Posterior Deltoids)",
    fact: [
      "Rear delts are often undertrained but essential for balanced shoulder development.",
      "Strong rear delts support better posture and prevent shoulder impingement.",
    ],
    exercises: ["Face Pulls", "Reverse Pec Deck", "Bent-Over Rear Delt Raises"],
  },
  Traps: {
    name: "Traps (Trapezius)",
    fact: [
      "The traps stabilize the shoulder blades and are key in heavy lifts like deadlifts and shrugs.",
      "Well-developed traps contribute to a powerful-looking upper back.",
    ],
    exercises: ["Barbell Shrugs", "Farmer's Carries", "Upright Rows"],
  },
  Tricep: {
    name: "Triceps",
    fact: [
      "Triceps make up about two-thirds of your upper arm mass.",
      "Strong triceps improve pressing movements like bench press and overhead press.",
    ],
    exercises: [
      "Skullcrushers",
      "Tricep Pushdowns",
      "Overhead Tricep Extensions",
    ],
  },
  Lats: {
    name: "Lats (Latissimus Dorsi)",
    fact: [
      "The lats are the widest muscles on the back",
      "Strong lats aid in pull-ups, rows, and overall upper body power.",
    ],
    exercises: ["Lat Pull Down", "Barbell Row", "Single Arm Barbel Row"],
  },
  UpperBack: {
    name: "UpperBack (Rhomboids, Traps, Rear Delts)",
    fact: [
      "A strong upper back improves posture and reduces the risk of shoulder injuries",
      "Developing the upper back helps with pulling strength and shoulder stability.",
    ],
    exercises: ["Pull-Ups", "Bent-Over Rows", "Lat Pulldowns"],
  },
  LowerBack: {
    name: "LowerBack (Erector Spinae)",
    fact: [
      "The lower back supports the spine and plays a major role in lifting and core stability.",
      "Strengthening the lower back helps prevent lower back pain and injuries.",
    ],
    exercises: ["Deadlifts", "Back Extensions", "Good Mornings"],
  },
  Hamstring: {
    name: "Hamstring",
    fact: [
      "The hamstrings are key for explosive movements like sprinting and jumping.",
      "Balanced hamstring strength reduces knee injury risk and supports hip mobility.",
    ],
    exercises: ["Romanian Deadlifts", "Leg Curls", "Glute-Ham Raises"],
  },
  Shoulder: {
    name: "Shoulder (Deltoids)",
    fact: [
      "The shoulder joint has the most range of motion in the body—making deltoid stability essential.",
      "Well-rounded deltoid training ensures balance across all three heads: front, side, and rear.",
    ],
    exercises: ["Overhead Press", "Lateral Raises", "Arnold Press"],
  },
  Chest: {
    name: "Chest (Pectorals)",
    fact: [
      "The pecs assist in pushing movements like push-ups, bench press, and dips.",
      "Chest development enhances upper body strength and aesthetics.",
    ],
    exercises: ["Bench Press", "Push-Ups", "Chest Flyes"],
  },
  UpperAbs: {
    name: "UpperAbs",
    fact: [
      "The upper abs are most activated during crunching and sit-up movements.",
      "Visible upper abs often develop first with consistent training and low body fat.",
    ],
    exercises: ["Crunches", "Cable Crunches", "Sit-Ups"],
  },
  Obliques: {
    name: "Obliques",
    fact: [
      "The obliques control twisting and side-bending movements of the torso.",
      "Strong obliques improve core stability and help protect the spine during rotation.",
    ],
    exercises: ["Side Plank", "Hanging Oblique Raise", "Bicycle Crunch"],
  },
  LowerAbs: {
    name: "LowerAbs",
    fact: [
      "Lower abs are typically harder to isolate and often require leg-raise type movements.",
      "Strengthening the lower abs improves pelvic control and reduces lower back strain.",
    ],
    exercises: ["Leg Raises", "Reverse Crunches", "Hanging Leg Raises"],
  },
  Bicep: {
    name: "Bicep",
    fact: [
      "The biceps flex the elbow and rotate the forearm—key for pulling movements.",
      "Strong biceps enhance performance in rows, pull-ups, and curls.",
    ],
    exercises: ["Barbell Curl", "Hammer Curl", "Concentration Curl"],
  },
  Forearm: {
    name: "Forearm",
    fact: [
      "Forearm muscles control grip strength and wrist movement.",
      "A strong grip supports lifts like deadlifts and pull-ups, and reduces injury risk.",
    ],
    exercises: ["Wrist Curls", "Reverse Wrist Curls", "Farmer’s Walk"],
  },
  Quad: {
    name: "Quads (Quadriceps)",
    fact: [
      "The quads are the largest muscle group in the body, critical for walking, running, and squatting.",
      "Well-developed quads improve knee stability and lower-body power.",
    ],
    exercises: ["Squats", "Lunges", "Leg Press"],
  },
  Calve: {
    name: "Calves (Gastrocnemius and Soleus)",
    fact: [
      "Calves support ankle movement and help with balance and explosive steps.",
      "Strong calves reduce risk of Achilles injuries and enhance jumping ability.",
    ],
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
