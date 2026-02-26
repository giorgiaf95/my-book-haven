import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ImagePlus, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { supportedLanguages } from "@/lib/mockData";
import { cn } from "@/lib/utils";

const visibilityOptions = [
  { value: "public", label: "Pubblico" },
  { value: "private", label: "Privato" },
  { value: "limited", label: "Limitato" },
] as const;

type Visibility = (typeof visibilityOptions)[number]["value"];

type MemberPermissions = {
  discussions: "all" | "mods" | "admins";
  polls: "all" | "mods" | "admins";
  events: "all" | "mods" | "admins";
};

const categories = ["Generale", "Narrativa", "Fantascienza", "Gialli", "Manga", "Autori", "Saggistica"];

const CommunityCreate = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [rules, setRules] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [visibility, setVisibility] = useState<Visibility>("public");
  const [maxMembers, setMaxMembers] = useState<number>(100);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(["Italiano"]);
  const [allLanguages, setAllLanguages] = useState(false);
  const [permissions, setPermissions] = useState<MemberPermissions>({
    discussions: "all",
    polls: "mods",
    events: "admins",
  });
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const availableLanguages = useMemo(
    () => supportedLanguages.filter((language) => language !== "Tutte"),
    []
  );

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (!tag || tags.includes(tag)) return;
    setTags((prev) => [...prev, tag]);
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setTags((prev) => prev.filter((item) => item !== tag));
  };

  const toggleLanguage = (language: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(language) ? prev.filter((item) => item !== language) : [...prev, language]
    );
    setAllLanguages(false);
  };

  const handleCoverChange = (file: File | null) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setCoverPreview(url);
  };

  const submit = () => {
    if (name.trim().length < 3) {
      toast("Inserisci un nome gruppo valido");
      return;
    }
    if (description.trim().length < 20) {
      toast("Aggiungi una descrizione più dettagliata");
      return;
    }
    if (visibility === "limited" && maxMembers < 2) {
      toast("Per il gruppo limitato imposta almeno 2 membri");
      return;
    }

    toast("Gruppo creato con successo");
    navigate("/community");
  };

  return (
    <div className="container py-6 md:py-10 max-w-4xl space-y-5">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Torna alla community
      </button>

      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">Crea gruppo</h1>
        <p className="text-sm text-muted-foreground mt-1">Configura il tuo gruppo con regole, visibilità e permessi</p>
      </div>

      <section className="rounded-2xl bg-card border border-border p-5 md:p-6 shadow-card space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Nome del gruppo</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Es. Lettori del Weekend"
              className="w-full px-3 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Categoria</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {categories.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Descrizione</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descrivi obiettivi e stile del gruppo"
            className="w-full min-h-24 px-3 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Regole (opzionale)</label>
          <textarea
            value={rules}
            onChange={(e) => setRules(e.target.value)}
            placeholder="Regole principali del gruppo"
            className="w-full min-h-20 px-3 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Tag</label>
          <div className="flex gap-2">
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Aggiungi tag"
              className="flex-1 px-3 py-2 rounded-xl bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button onClick={addTag} className="px-3 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => removeTag(tag)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-secondary text-secondary-foreground"
              >
                #{tag} <X className="h-3 w-3" />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Visibilità</label>
          <div className="flex flex-wrap gap-2">
            {visibilityOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setVisibility(option.value)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium",
                  visibility === option.value ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
          {visibility === "limited" && (
            <div className="max-w-xs">
              <label className="text-xs text-muted-foreground">Numero massimo membri</label>
              <input
                type="number"
                min={2}
                value={maxMembers}
                onChange={(e) => setMaxMembers(Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Permessi membri</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {([
              { key: "discussions", label: "Creare discussioni" },
              { key: "polls", label: "Creare sondaggi" },
              { key: "events", label: "Creare eventi" },
            ] as const).map((item) => (
              <div key={item.key} className="rounded-xl bg-background border border-border p-2.5">
                <p className="text-xs font-medium text-foreground mb-1.5">{item.label}</p>
                <select
                  value={permissions[item.key]}
                  onChange={(e) => setPermissions((prev) => ({ ...prev, [item.key]: e.target.value as MemberPermissions[typeof item.key] }))}
                  className="w-full px-2 py-1.5 rounded-lg bg-card border border-border text-xs text-foreground focus:outline-none"
                >
                  <option value="all">Tutti</option>
                  <option value="mods">Moderatori + admin</option>
                  <option value="admins">Solo admin</option>
                </select>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Lingua</label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setAllLanguages((prev) => !prev);
                if (!allLanguages) setSelectedLanguages([]);
              }}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium",
                allLanguages ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
              )}
            >
              Tutte
            </button>
            {availableLanguages.map((language) => (
              <button
                key={language}
                onClick={() => toggleLanguage(language)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium",
                  selectedLanguages.includes(language) ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                )}
              >
                {language}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Copertina gruppo</label>
          <label className="flex items-center justify-center gap-2 min-h-32 rounded-xl border border-dashed border-border bg-background text-muted-foreground cursor-pointer hover:bg-secondary/40 transition-colors">
            <ImagePlus className="h-4 w-4" />
            <span className="text-sm">Carica immagine</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleCoverChange(e.target.files?.[0] ?? null)}
            />
          </label>
          {coverPreview && (
            <img src={coverPreview} alt="Anteprima copertina" className="w-full h-40 object-cover rounded-xl border border-border" />
          )}
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <button onClick={() => navigate(-1)} className="px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground">
            Annulla
          </button>
          <button onClick={submit} className="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:opacity-90">
            Crea gruppo
          </button>
        </div>
      </section>
    </div>
  );
};

export default CommunityCreate;
