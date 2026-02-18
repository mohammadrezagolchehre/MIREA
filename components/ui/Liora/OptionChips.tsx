import { GlassButton } from "../glass-button";

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
    <div className="flex flex-wrap gap-3 justify-center mt-6">
      {options.map((option) => (
        <GlassButton
          key={option}
          variant="default"
          size="sm"
          onClick={() => onSelect(option)}

        >
          {option}
        </GlassButton>
      ))}
    </div>
  );
}
