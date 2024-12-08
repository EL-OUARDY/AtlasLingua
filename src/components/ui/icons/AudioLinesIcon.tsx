import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";

interface Props {
  className: string;
}

const AudioLinesIcon = ({ className }: Props) => {
  const controls = useAnimation();

  useEffect(() => {
    controls.start("animate");
  }, [controls]); // run only once when component mounts

  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 10v3" />
      <motion.path
        initial="normal"
        animate={controls}
        variants={{
          normal: { d: "M6 6v11" },
          animate: {
            d: ["M6 6v11", "M6 10v3", "M6 6v11"],
            transition: {
              duration: 1.5,
              repeat: Infinity,
            },
          },
        }}
      />
      <motion.path
        initial="normal"
        animate={controls}
        variants={{
          normal: { d: "M10 3v18" },
          animate: {
            d: ["M10 3v18", "M10 9v5", "M10 3v18"],
            transition: {
              duration: 1,
              repeat: Infinity,
            },
          },
        }}
      />
      <motion.path
        initial="normal"
        animate={controls}
        variants={{
          normal: { d: "M14 8v7" },
          animate: {
            d: ["M14 8v7", "M14 6v11", "M14 8v7"],
            transition: {
              duration: 0.8,
              repeat: Infinity,
            },
          },
        }}
      />
      <motion.path
        initial="normal"
        animate={controls}
        variants={{
          normal: { d: "M18 5v13" },
          animate: {
            d: ["M18 5v13", "M18 7v9", "M18 5v13"],
            transition: {
              duration: 1.5,
              repeat: Infinity,
            },
          },
        }}
      />
      <path d="M22 10v3" />
    </svg>
  );
};

export { AudioLinesIcon };
