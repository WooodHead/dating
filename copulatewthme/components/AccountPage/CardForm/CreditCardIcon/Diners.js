import React from "react";

export default function Diners({ width }) {
  return (
    <svg width={width} viewBox="0 0 780 500" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M40 0h700c22 0 40 18 40 40v420c0 22-18 40-40 40H40c-22 0-40-18-40-40V40C0 18 18 0 40 0z"
        fill="#0079BE"
      />
      <path
        d="M600 251c0-99-83-168-174-168h-78a167 167 0 100 333h78c91 1 174-74 174-165z"
        fill="#fff"
      />
      <path d="M348 97a152 152 0 101 305 152 152 0 00-1-305z" fill="#0079BE" />
      <path
        d="M252 250c0-42 26-77 62-91v181a97 97 0 01-62-90zm131 90V159a97 97 0 010 181z"
        fill="#fff"
      />
    </svg>
  );
}
