// Breaks a display name into the first name, last initial and initials for avatars
export function getNameParts(displayName) {
  // Split on any whitespace and drop empty pieces so extra spaces don't cause problems
  const words = (displayName ?? "").trim().split(/\s+/).filter(Boolean);

  const firstName = words[0] ?? "";

  // Last initial only exists when the name has more than one word
  const lastInitial =
    words.length > 1 ? words[words.length - 1][0].toUpperCase() : "";

  // Initials are the first letter of the first name plus the last initial
  const initials = (firstName.slice(0, 1) + lastInitial).toUpperCase();

  return { firstName, lastInitial, initials };
}
