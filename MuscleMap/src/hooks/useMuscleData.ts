import { useQuery } from "@tanstack/react-query";

const API_MUSCLE_BASE = "https://exercisedb-api.vercel.app/api/v1/muscles/";
const API_BODY_BASE = "https://exercisedb-api.vercel.app/api/v1/bodyparts/";

type MuscleInfo = {
  name: string;
  grouping: string;
  fact: string[];
  exercises: string[];
};

// Remove "exercises" key — they will now be fetched dynamically
const localMuscleData: Record<string, Omit<MuscleInfo, "exercises">> = {
  Neck: {
    name: "Neck",
    grouping: "body part",
    fact: [
      "Strengthening your neck muscles can improve posture and reduce the risk of tension headaches.",
      "A strong neck is crucial for contact sports and injury prevention.",
    ],
  },
  RearDelt: {
    name: "Rear Delts (Posterior Deltoids)",
    grouping: "muscle part",
    fact: [
      "Rear delts are often undertrained but essential for balanced shoulder development.",
      "Strong rear delts support better posture and prevent shoulder impingement.",
    ],
  },
  Traps: {
    name: "Traps (Trapezius)",
    grouping: "muscle part",
    fact: [
      "The traps stabilize the shoulder blades and are key in heavy lifts like deadlifts and shrugs.",
      "Well-developed traps contribute to a powerful-looking upper back.",
    ],
  },
  Tricep: {
    name: "Triceps",
    grouping: "muscle part",
    fact: [
      "Triceps make up about two-thirds of your upper arm mass.",
      "Strong triceps improve pressing movements like bench press and overhead press.",
    ],
  },
  Lats: {
    name: "Lats (Latissimus Dorsi)",
    grouping: "muscle part",
    fact: [
      "The lats are the widest muscles on the back",
      "Strong lats aid in pull-ups, rows, and overall upper body power.",
    ],
  },
  UpperBack: {
    name: "UpperBack (Rhomboids, Traps, Rear Delts)",
    grouping: "muscle part",
    fact: [
      "A strong upper back improves posture and reduces the risk of shoulder injuries",
      "Developing the upper back helps with pulling strength and shoulder stability.",
    ],
  },
  LowerBack: {
    name: "LowerBack (Erector Spinae)",
    grouping: "body part",
    fact: [
      "The lower back supports the spine and plays a major role in lifting and core stability.",
      "Strengthening the lower back helps prevent lower back pain and injuries.",
    ],
  },
  Hamstring: {
    name: "Hamstring",
    grouping: "muscle part",
    fact: [
      "The hamstrings are key for explosive movements like sprinting and jumping.",
      "Balanced hamstring strength reduces knee injury risk and supports hip mobility.",
    ],
  },
  Shoulder: {
    name: "Shoulder (Deltoids)",
    grouping: "muscle part",
    fact: [
      "The shoulder joint has the most range of motion in the body—making deltoid stability essential.",
      "Well-rounded deltoid training ensures balance across all three heads: front, side, and rear.",
    ],
  },
  Chest: {
    name: "Chest (Pectorals)",
    grouping: "body part",
    fact: [
      "The pecs assist in pushing movements like push-ups, bench press, and dips.",
      "Chest development enhances upper body strength and aesthetics.",
    ],
  },
  UpperAbs: {
    name: "UpperAbs",
    grouping: "muscle part",
    fact: [
      "The upper abs are most activated during crunching and sit-up movements.",
      "Visible upper abs often develop first with consistent training and low body fat.",
    ],
  },
  Obliques: {
    name: "Obliques",
    grouping: "muscle part",
    fact: [
      "The obliques control twisting and side-bending movements of the torso.",
      "Strong obliques improve core stability and help protect the spine during rotation.",
    ],
  },
  LowerAbs: {
    name: "LowerAbs",
    grouping: "muscle part",
    fact: [
      "Lower abs are typically harder to isolate and often require leg-raise type movements.",
      "Strengthening the lower abs improves pelvic control and reduces lower back strain.",
    ],
  },
  Bicep: {
    name: "Bicep",
    grouping: "muscle part",
    fact: [
      "The biceps flex the elbow and rotate the forearm—key for pulling movements.",
      "Strong biceps enhance performance in rows, pull-ups, and curls.",
    ],
  },
  Forearm: {
    name: "Forearm",
    grouping: "muscle part",
    fact: [
      "Forearm muscles control grip strength and wrist movement.",
      "A strong grip supports lifts like deadlifts and pull-ups, and reduces injury risk.",
    ],
  },
  Quad: {
    name: "Quads (Quadriceps)",
    grouping: "muscle part",
    fact: [
      "The quads are the largest muscle group in the body, critical for walking, running, and squatting.",
      "Well-developed quads improve knee stability and lower-body power.",
    ],
  },
  Calve: {
    name: "Calves (Gastrocnemius and Soleus)",
    grouping: "muscle part",
    fact: [
      "Calves support ankle movement and help with balance and explosive steps.",
      "Strong calves reduce risk of Achilles injuries and enhance jumping ability.",
    ],
  },
};

const getTargetMuscleName = (groupId: string): string | null => {
  const mapping: Record<string, string> = {
    Head: "neck",
    Neck: "neck",
    RearDelt: "delts",
    Traps: "traps",
    Tricep: "triceps",
    Lats: "lats",
    UpperBack: "upper back",
    LowerBack: "lower back",
    Hamstring: "hamstrings",
    Shoulder: "delts",
    Chest: "chest",
    UpperAbs: "abs",
    Obliques: "abs",
    LowerAbs: "abs",
    Bicep: "biceps",
    Forearm: "forearms",
    Quad: "quads",
    Calve: "calves",
  };

  return mapping[groupId] || null;
};

const fetchMuscleData = async (groupId: string): Promise<MuscleInfo> => {
  //console.log("FETCHING groupId: ", groupId);
  const returnData = localMuscleData[groupId];
  const target = getTargetMuscleName(groupId);
  if (!target) throw new Error(`No API mapping for groupId: ${groupId}`);

  let targetAPI = API_MUSCLE_BASE;
  if (returnData.grouping == "body part") {
    targetAPI = API_BODY_BASE;
  }

  const server_response = await fetch(`${targetAPI}${target}/exercises`);
  //console.log("fetchMuscleData with res: ", server_response);

  if (!server_response.ok) throw new Error("Failed to fetch exercises");

  const dataJson = await server_response.json(); //Lets build that local muscle data Obj
  //console.log("fetchMuscleData with dataJson: ", dataJson);

  let exercises = dataJson.data.exercises.slice(0, 4).map((ex: any) => ex.name);
  //console.log("list of exercises: ", exercises);
  if (target == "abs") {
    if (groupId == "Obliques") {
      exercises = dataJson.data.exercises
        .filter((ex: any) => ex.secondaryMuscles.includes("obliques"))
        .map((ex: any) => ex.name);
    }
    if (groupId == "LowerAbs") {
      exercises = dataJson.data.exercises
        .filter(
          (ex: any) =>
            ex.secondaryMuscles.includes("hip flexors") &&
            ex.name.toLowerCase() !==
              "barbell sitted alternate leg raise (female)"
        )
        .map((ex: any) => ex.name);
    }
  }
  if (target == "delts") {
    if (groupId == "RearDelt") {
      exercises = dataJson.data.exercises
        .filter((ex: any) => ex.secondaryMuscles.includes("traps"))
        .map((ex: any) => ex.name);
    }
    if (groupId == "Shoulder") {
      exercises = dataJson.data.exercises
        .filter((ex: any) => ex.secondaryMuscles.includes("upper back"))
        .map((ex: any) => ex.name);
    }
  }

  return {
    name: returnData?.name || groupId,
    fact: returnData?.fact || [],
    grouping: returnData?.grouping || "",
    exercises,
  };
};

export const useMuscleData = (groupId: string | null) =>
  useQuery({
    queryKey: ["muscle", groupId],
    queryFn: () => fetchMuscleData(groupId!),
    enabled: !!groupId,
  });
