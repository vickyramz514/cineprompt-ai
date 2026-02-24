"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { getTemplateById } from "@/lib/templates-data";
import { buildPromptFromTemplate } from "@/lib/prompt-builder";
import type { TemplateInputField } from "@/lib/template-schema";
import { useTemplateStore } from "@/store/useStore";

function FavoriteButton({ templateId }: { templateId: string }) {
  const { isFavorite, addFavorite, removeFavorite } = useTemplateStore();
  const fav = isFavorite(templateId);
  return (
    <button
      onClick={() => (fav ? removeFavorite(templateId) : addFavorite(templateId))}
      className="rounded-full bg-black/50 p-2 hover:bg-black/70"
    >
      {fav ? "❤️" : "🤍"}
    </button>
  );
}

function DynamicFormField({
  field,
  value,
  onChange,
}: {
  field: TemplateInputField;
  value: string | number;
  onChange: (v: string | number) => void;
}) {
  if (field.type === "textarea") {
    return (
      <textarea
        value={String(value)}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-indigo-500/50 focus:outline-none"
        rows={3}
      />
    );
  }
  if (field.type === "date") {
    return (
      <input
        type="date"
        value={String(value)}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-indigo-500/50 focus:outline-none"
      />
    );
  }
  if (field.type === "number") {
    return (
      <input
        type="number"
        value={String(value)}
        onChange={(e) => onChange(parseInt(e.target.value) || 0)}
        placeholder={field.placeholder}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-indigo-500/50 focus:outline-none"
      />
    );
  }
  return (
    <input
      type="text"
      value={String(value)}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder}
      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-indigo-500/50 focus:outline-none"
    />
  );
}

export default function TemplateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const template = getTemplateById(params.id as string);
  const addUsedTemplate = useTemplateStore((s) => s.addUsedTemplate);

  const [formValues, setFormValues] = useState<Record<string, string | number>>({});
  const [showAdvancedPrompt, setShowAdvancedPrompt] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");

  const generatedPrompt = useMemo(() => {
    if (!template) return "";
    return buildPromptFromTemplate(template, formValues);
  }, [template, formValues]);

  const displayPrompt = showAdvancedPrompt ? customPrompt || generatedPrompt : generatedPrompt;

  if (!template) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Template not found</h1>
          <Link href="/templates" className="mt-4 text-indigo-400 hover:underline">
            Browse templates
          </Link>
        </div>
      </div>
    );
  }

  const updateField = (key: string, value: string | number) => {
    setFormValues((v) => ({ ...v, [key]: value }));
  };

  const handleGenerate = () => {
    addUsedTemplate(template.id);
    router.push(
      `/dashboard/create?template=${template.id}&prompt=${encodeURIComponent(displayPrompt)}`
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <header className="sticky top-0 z-40 border-b border-white/5 bg-black/60 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
          <Link href="/templates" className="text-indigo-400 hover:underline">
            ← Back to templates
          </Link>
          <Link href="/auth/signup" className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white">
            Get Started
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Preview */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-900/30 to-purple-900/20">
              <div className="flex h-full items-center justify-center text-8xl opacity-50">🎬</div>
              <div className="absolute right-4 top-4">
                <FavoriteButton templateId={template.id} />
              </div>
            </div>
            <div className="mt-6">
              <h1 className="text-3xl font-bold">{template.name}</h1>
              <p className="mt-2 text-white/70">{template.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {template.useCases.map((uc) => (
                  <span
                    key={uc}
                    className="rounded-full bg-white/10 px-3 py-1 text-sm font-medium"
                  >
                    {uc}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-2xl border border-white/5 bg-white/[0.02] p-6"
          >
            <h2 className="text-lg font-semibold">Customize your video</h2>
            <div className="mt-6 space-y-4">
              {template.inputFields.map((field) => (
                <div key={field.id}>
                  <label className="mb-2 block text-sm font-medium text-white/80">
                    {field.label} {field.required && "*"}
                  </label>
                  <DynamicFormField
                    field={field}
                    value={formValues[field.key] ?? ""}
                    onChange={(v) => updateField(field.key, v)}
                  />
                </div>
              ))}
            </div>

            {/* Prompt */}
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-white/80">Generated prompt</label>
                <button
                  onClick={() => setShowAdvancedPrompt(!showAdvancedPrompt)}
                  className="text-xs text-indigo-400 hover:underline"
                >
                  {showAdvancedPrompt ? "Hide" : "Advanced edit"}
                </button>
              </div>
              {showAdvancedPrompt ? (
                <textarea
                  value={customPrompt || generatedPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/90"
                  rows={4}
                />
              ) : (
                <p className="mt-2 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
                  {generatedPrompt || "Fill in the form to generate prompt..."}
                </p>
              )}
            </div>

            <div className="mt-6 flex items-center justify-between">
              <span className="text-sm text-white/60">{template.creditsCost} credits</span>
              <button
                onClick={handleGenerate}
                className="rounded-xl bg-indigo-500 px-6 py-2.5 font-semibold text-white hover:bg-indigo-600"
              >
                Generate Video
              </button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
