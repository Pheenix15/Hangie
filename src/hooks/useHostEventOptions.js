// Serves as a bridge for userVibes and userInterest fetch in DetailsStep.jsx

import { useEffect, useState } from "react";
import { getUserInterests } from "../services/interests";
import { getVibes } from "../services/vibes";

// Loads the host's interests and the fixed vibes list, both needed for the Details step
export function useHostEventOptions(userId) {
  const [interests, setInterests] = useState([]);
  const [vibes, setVibes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOptions();
  }, [userId]);

  const loadOptions = async () => {
    // Fetch both in parallel since neither depends on the other
    const [interestsResult, vibesResult] = await Promise.all([
      getUserInterests(userId),
      getVibes(),
    ]);

    // console.log("useHostEventOptions results:", {
    //   interestsResult,
    //   vibesResult,
    // }); //For debugging purposes

    if (interestsResult.interests) {
      setInterests(interestsResult.interests);
    }

    if (vibesResult.vibes) {
      setVibes(vibesResult.vibes);
    }

    setLoading(false);
  };

  return { interests, vibes, loading };
}
