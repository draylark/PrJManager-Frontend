"use client";
import { useState } from "react";
import { PopulatedContributor } from "../../../../interfaces/models";
import { CommitForWTask } from "../../../../interfaces/models";
import {
  motion,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { getInitialsAvatar } from "../../projects/helpers/helpers"; 

export const AnimatedTooltip = ({
  items, commits
}: {
  items: PopulatedContributor[];
  commits: CommitForWTask[];
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<string | null>(null);
  const springConfig = { stiffness: 100, damping: 5 };
  const x = useMotionValue(0); // going to set this value on mouse move
  // rotate the tooltip
  const rotate = useSpring(
    useTransform(x, [-100, 100], [-45, 45]),
    springConfig
  );
  // translate the tooltip
  const translateX = useSpring(
    useTransform(x, [-100, 100], [-50, 50]),
    springConfig
  );

  const handleMouseMove = (
    event: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    const target = event.target as HTMLImageElement;  // Aserción de tipo a HTMLImageElement
    const halfWidth = target.offsetWidth / 2;
    x.set(event.nativeEvent.offsetX - halfWidth); // set the x value, which is then used in transform and rotate
  };

  const findUserCommits = (uid: string) => {
    return commits.filter( commit => commit.author.uid === uid ).length
  }

 
  return (
    <>
      { 
        items.map((item) => (
          <div
            className="-mr-4  relative group "
            key={item._id}
            onMouseEnter={() => setHoveredIndex(item._id)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {hoveredIndex === item._id && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.6 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    type: "spring",
                    stiffness: 260,
                    damping: 10,
                  },
                }}
                exit={{ opacity: 0, y: 20, scale: 0.6 }}
                style={{
                  translateX: translateX,
                  rotate: rotate,
                  whiteSpace: "nowrap",
                }}
                className="absolute -top-16 -left-1/2 translate-x-1/2 flex text-xs  flex-col items-center justify-center rounded-md bg-black z-50 shadow-xl px-4 py-2"
              >
                <div className="absolute inset-x-10 z-30 w-[20%] -bottom-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent h-px " />
                <div className="absolute left-10 w-[40%] z-30 -bottom-px bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px " />
                <div className="font-bold text-white relative z-30 text-base">
                  {item.uid.username}
                </div>
                <div className="font-semibold text-white text-[12px] relative z-30">
                  finished his contributions.
                </div>
                <div className="text-green-300 text-xs">Commits: { findUserCommits(item.uid._id) }</div>
              </motion.div>
            )}
            <img
              onMouseMove={handleMouseMove}
              height={100}
              width={100}
              src={item.uid.photoUrl || getInitialsAvatar(item.uid.username)}
              alt={item.uid.username}
              className="object-cover !m-0 !p-0 object-top rounded-full h-9 w-9 border-2 group-hover:scale-105 group-hover:z-30 border-white relative transition duration-500"
              onError={(e) => {
                const target = e.target as HTMLImageElement; // Asegura el tipo
                target.onerror = null; // Previene el bucle de error
                target.src = getInitialsAvatar(item.uid.username); // Establece la imagen de las iniciales si la imagen principal falla
              }}
            />
          </div>
        ))
      }
    </>
  );
};