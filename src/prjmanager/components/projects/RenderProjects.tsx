import { cn } from "../../../utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import { cleanUrl } from "./helpers/helpers";
import { useState } from "react";
import projectbg from '../../assets/imgs/projectbg.jpg'
 
export const RenderProjects = ({ items, className, navigate }: {
  items: {
    name: string;
    description: string;
    pid: string;
    accessLevel: string | null;
  }[];
  className?: string;
  navigate: (url: string, options: { state: { project: { ID: string; name: string; accessLevel: string | null } } }) => void;
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
 
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-9",
        className
      )}
    >
      {items.map((item, idx) => (
        <button
        onClick={() => navigate(`${cleanUrl(item.name)}`, { 
          state: { 
            project: { ID: item.pid, name: item.name, accessLevel: item?.accessLevel || null } } } )} 
          className="relative group  block p-2 h-[240px] w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-neutral-200 dark:bg-slate-600/[0.8] block  rounded-3xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <Card>
            <CardTitle>{item.name}</CardTitle>
            <CardDescription>{item.description}</CardDescription>
          </Card>
        </button>
      ))}
    </div>
  );
};
 
export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "rounded-2xl h-full w-full  overflow-hidden border-[1px] border-gray-400 group-hover:border-slate-700 relative z-20",
        className
      )}
      style={{
        backgroundImage: `url(${projectbg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'      
      }}
    >
      <div className="relative z-50 h-full backdrop-blur-2xl bg-white/50">
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};
export const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h4 className={cn("text-black font-bold tracking-wide mt-3 text-xl text-left", className)}>
      {children}
    </h4>
  );
};
export const CardDescription = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <p
      className={cn(
        "mt-5 text-black tracking-wide leading-relaxed text-sm text-left line-clamp-5",
        className
      )}
    >
      {children}
    </p>
  );
};