interface Props {
  className: string;
}
function MoroccoIcon({ className }: Props) {
  return (
    <div className="transform transition-transform duration-300 hover:scale-110">
      <svg
        className={className}
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="32" cy="32" r="30" fill="#f42f4c" />
        <path
          fill="#23cc32"
          d="M 19.364 50.47 L 24.158 36.404 L 11.666 27.596 L 27.208 27.596 L 32 13.529 L 36.794 27.596 L 52.334 27.596 L 39.698 36.261 L 44.491 50.328 L 32 41.803 L 19.364 50.47 M 34.614 39.956 L 38.537 42.656 L 37.084 38.251 L 34.614 39.956 M 26.917 38.251 L 25.465 42.656 L 29.385 39.956 L 26.917 38.251 M 27.933 35.267 L 32 38.109 L 36.067 35.267 L 34.47 30.721 L 29.385 30.721 L 27.933 35.267 M 21.398 30.721 L 25.319 33.42 L 26.191 30.721 L 21.398 30.721 M 38.681 33.42 L 42.603 30.721 L 37.81 30.721 L 38.681 33.42 M 30.548 27.596 L 33.452 27.596 L 32 23.191 L 30.548 27.596"
        />
      </svg>
    </div>
  );
}

export default MoroccoIcon;
