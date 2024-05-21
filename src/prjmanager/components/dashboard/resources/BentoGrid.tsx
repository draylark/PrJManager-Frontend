import { cn } from '../../../../utils/cn'
import React from "react";
import { IconClipboardCopy, IconFileBroken, IconSignature, IconTableColumn, IconArticle } from "@tabler/icons-react";
import stars from '../../../assets/imgs/stars.jpg'
import sea from '../../../assets/imgs/sea.jpg'
import figures from '../../../assets/imgs/projectbg.jpg'
  
  






export function BentoGridSecondDemo() {
  return (
    <BentoGrid className="w-full px-7 mx-auto md:auto-rows-[20rem]">
      {items.map((item, i) => (
        <BentoGridItem
          key={i}
          title={item.title}
          description={item.description}
          src={item.src}
          textColor={item.textColor}
          className={item.className}
          icon={item.icon}
        />
      ))}
    </BentoGrid>
  );
}


export const BentoGrid = ({
    className,
    children,
  }: {
    className?: string;
    children?: React.ReactNode;
  }) => {
    return (
      <div
        className={cn(
          "grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto ",
          className
        )}
      >
        {children}
      </div>
    );
};
   
export const BentoGridItem = ({

    src,
    className,
    textColor,
    title,
    description,
    header,
    icon,
  }: {
    src?: string;
    className?: string;
    textColor?: string;
    title?: string | React.ReactNode;
    description?: string | React.ReactNode;
    header?: React.ReactNode;
    icon?: React.ReactNode;
  }) => {

    console.log(textColor)

    return (
      <div
        style={{
          backgroundImage: `url(${src})`,
          backgroundSize: "cover",
            backgroundPosition: "center",
        }}
        className={cn(
          "cursor-pointer row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-black dark:border-black/[0.2] bg-white border border-transparent flex flex-col space-y-4 justify-end pb-10 pl-5",
          className
        )}
      >
        {header}
        <div className="group-hover/bento:translate-x-2 transition duration-200">
          <IconArticle className={
            cn(
              "h-4 w-4",
              textColor
            )
          } />
          <div className={cn(
            "font-sans font-bold mb-2 mt-2",
            textColor    
          )}>
            {title}
          </div>
          <div className={
            cn(
                "font-sans font-normaltext-xs",
                textColor
            )
          }>
            {description}
          </div>
        </div>
      </div>
    );
};

const Skeleton = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl   dark:bg-dot-white/[0.2] bg-dot-black/[0.2] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]  border border-transparent dark:border-white/[0.2] bg-neutral-100 dark:bg-black"></div>
);

const items = [
  {
    title: "The Dawn of Innovation",
    textColor: 'text-neutral-600 dark:text-neutral-700',
    src: figures,
    description: "Explore the birth of groundbreaking ideas and inventions.",
    header: <Skeleton />,
    className: "md:col-span-3",
  },
  {
    title: "The Digital Revolution",
    textColor: 'text-neutral-600 dark:text-neutral-200',
    src: sea,
    description: "Dive into the transformative power of technology.",
    header: <Skeleton />,
    className: "md:col-span-2",
  },
  {
    title: "The Art of Design",
    textColor: 'text-neutral-600 dark:text-neutral-200',
    src: stars,
    description: "Discover the beauty of thoughtful and functional design.",
    header: <Skeleton />,
    className: "md:col-span-1",
  },

];