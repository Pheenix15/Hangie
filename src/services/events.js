import { supabase } from "./supabase";

// Creates a hangout and all its related interest, vibe, and invite rows
export async function createEvent(hostId, eventData) {
  // Pull out the multi-value fields since they go into separate join tables
  const { interestIds, vibeIds, inviteeIds, ...eventFields } = eventData;

  // Insert the core event row first, so we get back its id for the joins
  const { data: event, error: eventError } = await supabase
    .from("events")
    .insert({ host_id: hostId, ...eventFields })
    .select()
    .single();

  // If the main event insert fails, stop here, nothing else can proceed
  if (eventError) {
    return { event: null, error: eventError.message };
  }

  // Build the event_interests rows, one per selected hangout type
  const interestRows = interestIds.map((interestId) => ({
    event_id: event.id,
    interest_id: interestId,
  }));

  const { error: interestsError } = await supabase
    .from("event_interests")
    .insert(interestRows);

  // If the interests fail to save, roll back the event so we don't leave a broken half-created hangout
  if (interestsError) {
    await supabase.from("events").delete().eq("id", event.id);
    return { event: null, error: interestsError.message };
  }

  // Build the event_vibes rows, one per selected vibe
  const vibeRows = vibeIds.map((vibeId) => ({
    event_id: event.id,
    vibe_id: vibeId,
  }));

  const { error: vibesError } = await supabase
    .from("event_vibes")
    .insert(vibeRows);

  // Same rollback logic if vibes fail to save
  if (vibesError) {
    await supabase.from("events").delete().eq("id", event.id);
    return { event: null, error: vibesError.message };
  }

  // Build the event_invites rows, one per invited user (can be empty if visibility isn't invite_only)
  if (inviteeIds && inviteeIds.length > 0) {
    const inviteRows = inviteeIds.map((inviteeId) => ({
      event_id: event.id,
      invitee_id: inviteeId,
    }));

    const { error: invitesError } = await supabase
      .from("event_invites")
      .insert(inviteRows);

    // Same rollback logic if invites fail to save
    if (invitesError) {
      await supabase.from("events").delete().eq("id", event.id);
      return { event: null, error: invitesError.message };
    }
  }

  return { event, error: null };
}
