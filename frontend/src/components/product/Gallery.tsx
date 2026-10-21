import { useState } from "react";
import { motion } from "framer-motion";

interface GalleryProps {
  images: string[];
  alt: string;
  badge?: React.ReactNode;
}

function Gallery({ images, alt, badge }: GalleryProps) {
  const [index, setIndex] = useState(0);
  return (
    <div className="flex flex-col gap-3 lg:flex-row-reverse lg:gap-4">
      <div className="border-line bg-surface-muted relative flex-1 border">
        <motion.img
          key={index}
          src={images[index]}
          alt={alt}
          initial={{ opacity: 0.4 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
          className="aspect-square w-full object-cover"
        />
        {badge && <div className="absolute top-4 left-4">{badge}</div>}
      </div>

      <div className="nova-scroll-x flex gap-3 overflow-x-auto lg:w-21 lg:flex-col lg:overflow-visible">
        {images.map((src, i) => (
          <button
            key={`${src}-${i}`}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`View image ${i + 1}`}
            aria-current={index === i}
            className={`bg-surface-muted ease-premium h-18 w-18 shrink-0 border transition-colors duration-150 lg:h-21 lg:w-21 ${
              index === i
                ? "border-ink"
                : "border-line hover:border-line-strong"
            }`}
          >
            <img src={src} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

export default Gallery;
