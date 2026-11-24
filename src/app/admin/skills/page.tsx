"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { AutoTranslateButton, LangTabs } from "@/components/admin/lang-tabs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2, Wrench } from "lucide-react";
import { FormModal } from "@/components/admin/form-modal";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Skill {
  id: number;
  title: string;
  description: string;
  description_id?: string;
  icon?: string;
}

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    description_id: "",
    icon: "",
  });
  const [activeLangTab, setActiveLangTab] = useState<"id" | "en">("id");
  const [isTranslating, setIsTranslating] = useState(false);
  const [uploadingIcon, setUploadingIcon] = useState(false);

  async function handleIconUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingIcon(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Upload failed");
      }
      const data = await res.json();
      setFormData((prev) => ({ ...prev, icon: data.url }));
      toast.success("Icon uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to upload icon");
    } finally {
      setUploadingIcon(false);
      e.target.value = "";
    }
  }

  useEffect(() => {
    fetchSkills();
  }, []);

  async function fetchSkills() {
    try {
      const res = await fetch("/api/skills");
      if (!res.ok) throw new Error();
      setSkills(await res.json());
    } catch {
      toast.error("Failed to load skills");
    } finally {
      setLoading(false);
    }
  }

  async function handleAutoTranslate() {
    if (!formData.description_id || formData.description_id.trim() === "")
      return;
    setIsTranslating(true);
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: formData.description_id,
          from: "id",
          to: "en",
        }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setFormData((prev) => ({
        ...prev,
        description: data.translatedText || prev.description,
      }));
      toast.success("Successfully translated Indonesian to English");
    } catch {
      toast.error("Failed to auto-translate");
    } finally {
      setIsTranslating(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const url = editing ? `/api/skills/${editing.id}` : "/api/skills";
      const method = editing ? "PUT" : "POST";
      const body = {
        ...formData,
        description: formData.description || formData.description_id,
        description_id: formData.description_id || formData.description,
        sort_order: (editing as any)?.sort_order ?? 0,
        is_active: 1,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error();
      toast.success(editing ? "Skill updated" : "Skill created");
      setFormData({ title: "", description: "", description_id: "", icon: "" });
      setEditing(null);
      setFormOpen(false);
      fetchSkills();
    } catch {
      toast.error("Failed to save skill");
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/skills/${deleteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Skill deleted");
      fetchSkills();
    } catch {
      toast.error("Failed to delete skill");
    } finally {
      setDeleteId(null);
    }
  }

  async function moveSkill(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= skills.length) return;
    const next = [...skills];
    [next[index], next[target]] = [next[target], next[index]];
    setSkills(next);
    try {
      const updates = next.map((skill, i) => ({ id: skill.id, sort_order: i }));
      const res = await fetch("/api/skills/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: updates }),
      });
      if (!res.ok) throw new Error();
    } catch {
      toast.error("Failed to save order");
      fetchSkills();
    }
  }

  function handleEdit(skill: Skill) {
    setEditing(skill);
    setFormData({
      title: skill.title,
      description: skill.description,
      description_id: skill.description_id ?? "",
      icon: skill.icon || "",
    });
    setFormOpen(true);
  }

  function handleCancel() {
    setEditing(null);
    setFormData({ title: "", description: "", description_id: "", icon: "" });
    setFormOpen(false);
  }

  return (
    <AdminShell>
      <div className="mx-auto max-w-[1400px] space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-body-md text-muted-foreground">
            {skills.length} records
          </p>
          <Button
            onClick={() => {
              setEditing(null);
              setFormData({
                title: "",
                description: "",
                description_id: "",
                icon: "",
              });
              setFormOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" strokeWidth={1.5} />
            Add Skill
          </Button>
        </div>

        <FormModal
          open={formOpen}
          onOpenChange={(open) => {
            if (open) {
              setFormOpen(true);
            } else {
              handleCancel();
            }
          }}
          title={editing ? "Edit Skill" : "Add Skill"}
          description={
            editing
              ? "Update skill details and categorization"
              : "Create a new skill offering"
          }
          headerExtra={
            <div className="flex flex-wrap items-center justify-between gap-3">
              <LangTabs value={activeLangTab} onChange={setActiveLangTab} />
              <AutoTranslateButton
                onClick={handleAutoTranslate}
                busy={isTranslating}
                disabled={!formData.description_id}
              />
            </div>
          }
          footer={
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button type="submit" form="skill-form" className="flex-1">
                {editing ? "Update Skill" : "Add Skill"}
              </Button>
            </div>
          }
        >
          <form id="skill-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Icon</Label>
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-20 shrink-0 items-center justify-center overflow-hidden rounded-[10px] border bg-muted">
                  {formData.icon ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={formData.icon} alt="Icon preview" className="max-h-full max-w-full object-contain" />
                  ) : (
                    <Wrench className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
                  )}
                </div>
                <div className="flex flex-1 flex-wrap gap-2">
                  <Button type="button" variant="outline" disabled={uploadingIcon} asChild>
                    <label className="cursor-pointer">
                      {uploadingIcon ? "Uploading..." : "Upload icon"}
                      <input type="file" accept=".jpg,.jpeg,.png,.webp,.gif,.svg,image/*" className="hidden" onChange={handleIconUpload} disabled={uploadingIcon} />
                    </label>
                  </Button>
                  {formData.icon && (
                    <Button type="button" variant="ghost" onClick={() => setFormData({ ...formData, icon: "" })}>
                      Remove
                    </Button>
                  )}
                </div>
              </div>
              <p className="text-label-md text-muted-foreground">PNG, SVG, atau WEBP. Ditampilkan di kartu skill pada beranda.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Skill Name *</Label>
              <Input
                id="title"
                placeholder="e.g. Flutter, Laravel, Docker, Problem Solving"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>

            {activeLangTab === "id" ? (
              <div className="space-y-2">
                <Label htmlFor="description_id">
                  Kategori / Keterangan (ID) *
                </Label>
                <Input
                  id="description_id"
                  placeholder="contoh: Pemrograman & Pengembangan, Backend & API, Keterampilan Interpersonal"
                  value={formData.description_id}
                  onChange={(e) =>
                    setFormData({ ...formData, description_id: e.target.value })
                  }
                  required={!formData.description}
                />
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[
                    "Pemrograman & Pengembangan",
                    "Backend & API",
                    "Basis Data",
                    "Alat & Infrastruktur",
                    "Metodologi Pengembangan",
                    "Keterampilan Interpersonal",
                  ].map((cat) => (
                    <Button
                      key={cat}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setFormData({ ...formData, description_id: cat })
                      }
                    >
                      +{cat}
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="description">Category / Subtitle (EN) *</Label>
                <Input
                  id="description"
                  placeholder="e.g. Programming & Development, Backend & API, Tools & Infrastructure, Soft Skills"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required={!formData.description_id}
                />
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[
                    "Programming & Development",
                    "Backend & API",
                    "Database",
                    "Tools & Infrastructure",
                    "Development Practices",
                    "Soft Skills",
                  ].map((cat) => (
                    <Button
                      key={cat}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setFormData({ ...formData, description: cat })
                      }
                    >
                      +{cat}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </form>
        </FormModal>

        <Card>
          <CardHeader>
            <CardTitle>Existing Skills</CardTitle>
            <CardDescription>{skills.length} skills total</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="py-12 text-center text-body-md text-muted-foreground">
                Loading...
              </p>
            ) : skills.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
                <Wrench
                  className="h-10 w-10 text-muted-foreground"
                  strokeWidth={1.5}
                />
                <p className="text-sm font-medium text-foreground">
                  No skills yet
                </p>
                <p className="text-sm text-muted-foreground">
                  Add your first skill to the offering library.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {skills.map((skill, index) => (
                  <li
                    key={skill.id}
                    className="flex items-start justify-between gap-4 py-4 transition-colors hover:bg-sidebar"
                  >
                    <div className="min-w-0">
                      <p className="text-headline-sm text-foreground">
                        {skill.title}
                      </p>
                      <p className="mt-1 text-body-sm text-muted-foreground">
                        {skill.description}
                        {skill.description_id &&
                          skill.description_id !== skill.description && (
                            <span className="ml-2 text-label-md text-muted-foreground">
                              ID: {skill.description_id}
                            </span>
                          )}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 rounded-[8px]"
                        onClick={() => moveSkill(index, -1)}
                        disabled={index === 0}
                        aria-label="Move skill up"
                      >
                        <ArrowUp className="h-4 w-4" strokeWidth={1.5} />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 rounded-[8px]"
                        onClick={() => moveSkill(index, 1)}
                        disabled={index === skills.length - 1}
                        aria-label="Move skill down"
                      >
                        <ArrowDown className="h-4 w-4" strokeWidth={1.5} />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 rounded-[8px]"
                        onClick={() => handleEdit(skill)}
                        aria-label="Edit skill"
                      >
                        <Pencil className="h-4 w-4" strokeWidth={1.5} />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 rounded-[8px]"
                        onClick={() => setDeleteId(skill.id)}
                        aria-label="Delete skill"
                      >
                        <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <AlertDialog
          open={deleteId !== null}
          onOpenChange={() => setDeleteId(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Skill</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction variant="destructive" onClick={handleDelete}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminShell>
  );
}
