import { GlassButton } from "../glass-button";
import { motion } from "framer-motion";

type Props = {
  onSelect: (text: string) => void;
};

const options = [
  "🫠 حالم خوب نیست",
  "🤯 ذهنم شلوغه",
  "❤️ درباره رابطه‌م صحبت کنیم",
  "😌 میخوام آروم شم",
  "🌱 کمکم کن رشد کنم",

];

export default function OptionChips({ onSelect }: Props) {
  return (
    <motion.div
      className="mt-4 flex flex-wrap justify-center gap-2 sm:mt-6 sm:gap-3"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.08, delayChildren: 0.12 } },
      }}
    >
      {options.map((option) => (
        <motion.div
          key={option}
          variants={{
            hidden: { y: 12, opacity: 0, scale: 0.97 },
            visible: { y: 0, opacity: 1, scale: 1 },
          }}
          transition={{ duration: 0.32, ease: "easeOut" }}
        >
          <GlassButton
            className="min-h-9 max-w-full whitespace-normal text-center leading-5 text-white/85 hover:text-white/90"
            variant="outline"
            size="sm"
            onClick={() => onSelect(option)}
          >
            {option}
          </GlassButton>
        </motion.div>
      ))}
    </motion.div>
  );
}
