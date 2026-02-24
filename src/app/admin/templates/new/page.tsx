"use client";

import { useState } from "react";
import Link from "next/link";
import { NICHES } from "@/lib/niches";

type InputField = {
  id: string;
  key: string;
  label: string;
  type: "text" | "date" | "textarea" | "number";
  placeholder?: string;
  required?: boolean;
  promptVariable: string;
};

export default function CreateTemplatePage() {
  const [name, setName] = useState("");
  const [nicheId, setNicheId] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(10);
  const [creditsCost, setCreditsCost] = useState(10);
  const [promptTemplate, setPromptTemplate] = useState("");
  const [inputFields, setInputFields] = useState<InputField[]>([]);

  const addField = () => {
    setInputFields((f) => [
      ...f,
      {
        id: `f${Date.now()}`,
        key: "",
        label: "",
        type: "text",
        promptVariable: "",
      },
    ]);
  };

  const updateField = (id: string, updates: Partial<InputField>) => {
    setInputFields((f) => f.map((x) => (x.id === id ? { ...x, ...updates } : x)));
  };

  const removeField = (id: string) => {
    setInputFields((f) => f.filter((x) => x.id !== id));
  };

  return (
    <div>
      <Link href="/admin/templates" className="text-indigo-400 hover:underline">
        ← Back
      </Link>
      <h1 className="mt-6 text-2xl font-semibold">Create Template</h1>

      <form className="mt-8 space-y-8">
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
          <h2 className="font-semibold">Basic Info</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-white/70">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white"
                placeholder="Template name"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm text-white/70">Niche</label>
              <select
                value={nicheId}
                onChange={(e) => setNicheId(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white"
              >
                <option value="">Select niche</option>
                {NICHES.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.icon} {n.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm text-white/70">Category</label>
              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white"
                placeholder="e.g. Invitation"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm text-white/70">Duration (seconds)</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value) || 10)}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm text-white/70">Credits cost</label>
              <input
                type="number"
                value={creditsCost}
                onChange={(e) => setCreditsCost(parseInt(e.target.value) || 10)}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="mb-2 block text-sm text-white/70">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white"
              rows={3}
            />
          </div>
        </div>

        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Input Fields</h2>
            <button
              type="button"
              onClick={addField}
              className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white"
            >
              Add Field
            </button>
          </div>
          <div className="mt-4 space-y-4">
            {inputFields.map((f) => (
              <div
                key={f.id}
                className="flex flex-wrap gap-4 rounded-lg border border-white/5 p-4"
              >
                <input
                  value={f.key}
                  onChange={(e) => updateField(f.id, { key: e.target.value, promptVariable: e.target.value })}
                  placeholder="Key"
                  className="w-24 rounded border border-white/10 bg-white/5 px-2 py-1 text-sm"
                />
                <input
                  value={f.label}
                  onChange={(e) => updateField(f.id, { label: e.target.value })}
                  placeholder="Label"
                  className="w-32 rounded border border-white/10 bg-white/5 px-2 py-1 text-sm"
                />
                <select
                  value={f.type}
                  onChange={(e) => updateField(f.id, { type: e.target.value as InputField["type"] })}
                  className="rounded border border-white/10 bg-white/5 px-2 py-1 text-sm"
                >
                  <option value="text">Text</option>
                  <option value="textarea">Textarea</option>
                  <option value="date">Date</option>
                  <option value="number">Number</option>
                </select>
                <button
                  type="button"
                  onClick={() => removeField(f.id)}
                  className="text-red-400 hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
          <h2 className="font-semibold">Prompt Template</h2>
          <p className="mt-2 text-sm text-white/60">
            Use {"{{variable}}"} for form fields. e.g. {"{{name}}"}, {"{{date}}"}
          </p>
          <textarea
            value={promptTemplate}
            onChange={(e) => setPromptTemplate(e.target.value)}
            className="mt-4 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white"
            rows={5}
            placeholder="Cinematic video for {{name}} on {{date}}..."
          />
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            className="rounded-xl bg-indigo-500 px-6 py-2.5 font-semibold text-white hover:bg-indigo-600"
          >
            Save Template
          </button>
          <Link
            href="/admin/templates"
            className="rounded-xl border border-white/20 px-6 py-2.5 font-medium"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
