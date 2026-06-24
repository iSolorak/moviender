const LABELS = [
  { genres: ["Action"], label: "Action Junkie" },
  { genres: ["Science Fiction"], label: "Sci-Fi Explorer" },
  { genres: ["Thriller"], label: "Thriller Hunter" },
  { genres: ["Drama"], label: "Drama Connoisseur" },
  { genres: ["Adventure"], label: "Blockbuster Fanatic" },
  { genres: ["Animation"], label: "Animated Dreamer" },
  { genres: ["Romance"], label: "Heartfelt Romantic" },
  { genres: ["Horror"], label: "Midnight Screamer" },
];

export function getPersonalityLabel(topGenres: string[]) {
  const match = LABELS.find((item) => item.genres.some((genre) => topGenres.includes(genre)));

  if (match) {
    return match.label;
  }

  if (topGenres.length > 2) {
    return "Genre Hopper";
  }

  if (topGenres.length === 0) {
    return "Fresh Explorer";
  }

  return `${topGenres[0]} Devotee`;
}
