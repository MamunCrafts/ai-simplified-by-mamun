import Image from "next/image";
type PromptCardProps = {
  title: string;
  subtitle: string;
  image: string;
  borderColor: string;
};

const PromptCard = ({ title, subtitle, image, borderColor }: PromptCardProps) => (
  <div
    className={`group flex flex-col overflow-hidden rounded-2xl bg-white shadow-md border-t-4 ${borderColor} transition-all hover:shadow-xl`}
  >
    <div className="aspect-square w-full overflow-hidden">
      <Image
        src={image}
        alt={title}
        width={400}
        height={400}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
    </div>
    <div className="flex flex-1 flex-col p-4">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
    </div>
  </div>
);
export default PromptCard;