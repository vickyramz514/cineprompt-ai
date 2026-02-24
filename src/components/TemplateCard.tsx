"use client";

interface Template {
  id: string;
  name: string;
  thumbnail: string;
  prompt: string;
}

interface TemplateCardProps {
  template: Template;
  onGenerate: (id: string) => void;
}

export default function TemplateCard({ template, onGenerate }: TemplateCardProps) {
  return (
    <div className="group overflow-hidden rounded-xl border border-white/5 bg-white/[0.02] transition-all duration-300 hover:border-white/10 hover:bg-white/[0.04]">
      <div className="aspect-video w-full overflow-hidden bg-zinc-800/50">
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-900/30 to-purple-900/20">
          <span className="text-4xl opacity-50">🎬</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-medium">{template.name}</h3>
        <button
          onClick={() => onGenerate(template.id)}
          className="mt-3 w-full rounded-lg bg-indigo-500/20 py-2 text-sm font-medium text-indigo-300 transition-colors hover:bg-indigo-500/30"
        >
          Generate
        </button>
      </div>
    </div>
  );
}
