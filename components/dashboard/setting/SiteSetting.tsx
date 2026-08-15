"use client";

import { useState, useRef, useEffect } from "react";
import { Globe, Image as ImageIcon, Link2, ChevronDown, AlertCircle, Check, Loader2 } from "lucide-react";
import { getAdminAuthHeaders, canUpdateModule } from "@/lib/auth";

type SocialKey = "twitter" | "linkedin" | "instagram" | "facebook" | "youtube" | "whatsapp";

const SOCIAL_FIELDS: { key: SocialKey; label: string; placeholder: string }[] = [
  { key: "twitter", label: "Twitter / X", placeholder: "https://twitter.com/handle" },
  { key: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/company/..." },
  { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/handle" },
  { key: "facebook", label: "Facebook", placeholder: "https://facebook.com/page" },
  { key: "youtube", label: "YouTube", placeholder: "https://youtube.com/@channel" },
  { key: "whatsapp", label: "WhatsApp", placeholder: "+1 234 567 8900" },
];

function FieldLabel({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <div className="mb-1.5">
      <label className="text-[11px] font-semibold uppercase tracking-wide text-neutral-900">
        {children}
      </label>
      {hint && <p className="mt-0.5 text-[11px] text-neutral-400">{hint}</p>}
    </div>
  );
}

function TextField({
  value,
  onChange,
  placeholder,
  disabled = false,
}: {
  value: string | null | undefined;
  onChange: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <input
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-[12px] text-neutral-800 outline-none transition placeholder:text-neutral-400 focus:border-rose-400 focus:ring-1 focus:ring-rose-400 disabled:bg-neutral-100 disabled:text-neutral-400 disabled:cursor-not-allowed"
    />
  );
}

function SelectField({
  value,
  onChange,
  options,
  disabled = false,
}: {
  value: string | null | undefined;
  onChange: (v: string) => void;
  options: string[];
  disabled?: boolean;
}) {
  return (
    <div className="relative">
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full appearance-none rounded-lg border border-neutral-200 bg-white px-3 py-2.5 pr-9 text-[12px] text-neutral-800 outline-none transition focus:border-rose-400 focus:ring-1 focus:ring-rose-400 disabled:bg-neutral-100 disabled:text-neutral-400 disabled:cursor-not-allowed"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
    </div>
  );
}

function UploadTile({
  icon,
  title,
  hint,
  previewLabel,
  onFile,
  disabled = false,
}: {
  icon: React.ReactNode;
  title: string;
  hint: string;
  previewLabel: string;
  onFile: (file: File) => void;
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  return (
    <div className={`flex items-center gap-4 rounded-xl border p-2 border-dashed border-neutral-200 bg-neutral-50/60 ${disabled ? "opacity-50" : ""}`}>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-white text-[10px] font-semibold uppercase tracking-wide text-rose-600">
        {previewLabel ? previewLabel : icon}
      </div>
      <div className="min-w-0">
        <p className="text-[12px] font-medium text-neutral-800">{title}</p>
        <p className="mt-0.5 text-[11.5px] text-neutral-400">{hint}</p>
        <button
          onClick={() => !disabled && inputRef.current?.click()}
          disabled={disabled}
          className="mt-1 text-[12px] font-medium text-rose-600 hover:text-rose-700 disabled:text-neutral-400 disabled:cursor-not-allowed"
        >
          Browse files
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          disabled={disabled}
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f && !disabled) onFile(f);
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
}

export default function SiteSettings() {
  const [siteName, setSiteName] = useState("Digital Studio");
  const [tagline, setTagline] = useState("Award-Winning Web Design & Development");
  const [formEmail, setFormEmail] = useState("forms@digitalstudio.com");
  const [adminEmail, setAdminEmail] = useState("hello@digitalstudio.com");
  const [timezone, setTimezone] = useState("UTC-5 (Eastern Time)");
  const [language, setLanguage] = useState("English (US)");
  const [social, setSocial] = useState<Record<SocialKey, string>>({
    twitter: "",
    linkedin: "",
    instagram: "",
    facebook: "",
    youtube: "",
    whatsapp: "",
  });

  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [faviconUrl, setFaviconUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);

  const canEdit = canUpdateModule("settings");

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    setLoading(true);
    setError(null);
    try {
      const [identityRes, brandRes] = await Promise.all([
        fetch("/api/admin/site-identity", {
          method: "GET",
          headers: getAdminAuthHeaders(),
        }),
        fetch("/api/admin/brand-assets", {
          method: "GET",
          headers: getAdminAuthHeaders(),
        }),
      ]);

      if (!identityRes.ok || !brandRes.ok) {
        throw new Error("Failed to fetch settings");
      }

      const identityData = await identityRes.json();
      const brandData = await brandRes.json();

      if (identityData.site_name) setSiteName(identityData.site_name);
      if (identityData.tagline) setTagline(identityData.tagline);
      if (identityData.form_email) setFormEmail(identityData.form_email);
      if (identityData.admin_email) setAdminEmail(identityData.admin_email);
      if (identityData.timezone) setTimezone(identityData.timezone);
      if (identityData.language) setLanguage(identityData.language);

      if (brandData.logo_url) setLogoUrl(brandData.logo_url);
      if (brandData.favicon_url) setFaviconUrl(brandData.favicon_url);
      if (brandData.social_media) {
        setSocial((prev) => ({ ...prev, ...brandData.social_media }));
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load settings";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function saveSettings() {
    if (!canEdit) {
      setError("You do not have permission to edit settings");
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const payload = {
        site_name: siteName,
        tagline,
        contact_form_notification_email: formEmail,
        admin_email: adminEmail,
        timezone,
        language,
      };
      console.log("Sending payload:", payload);

      const identityRes = await fetch("/api/admin/site-identity", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAdminAuthHeaders(),
        },
        body: JSON.stringify(payload),
      });

      const socialPayload = {
        social_media: social,
      };
      console.log("Sending social payload:", socialPayload);

      const brandRes = await fetch("/api/admin/brand-assets", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAdminAuthHeaders(),
        },
        body: JSON.stringify(socialPayload),
      });

      if (!identityRes.ok) {
        const errorText = await identityRes.text();
        console.error("Identity save error:", identityRes.status, errorText);
        let errorMsg = `Failed to save site identity (${identityRes.status})`;
        try {
          const errorJson = JSON.parse(errorText);
          if (errorJson.detail) {
            if (Array.isArray(errorJson.detail)) {
              errorMsg = errorJson.detail
                .map((err: { loc?: string[]; msg?: string }) => {
                  if (err.msg) return `${err.loc?.[1] || "field"}: ${err.msg}`;
                  return JSON.stringify(err);
                })
                .join("; ");
            } else if (typeof errorJson.detail === "string") {
              errorMsg = errorJson.detail;
            }
          } else if (errorJson.message) {
            errorMsg = errorJson.message;
          }
        } catch {
          errorMsg = errorText || errorMsg;
        }
        throw new Error(errorMsg);
      }

      if (!brandRes.ok) {
        const errorText = await brandRes.text();
        console.error("Brand assets save error:", brandRes.status, errorText);
        let errorMsg = `Failed to save brand assets (${brandRes.status})`;
        try {
          const errorJson = JSON.parse(errorText);
          if (errorJson.detail) {
            if (Array.isArray(errorJson.detail)) {
              errorMsg = errorJson.detail
                .map((err: { loc?: string[]; msg?: string }) => {
                  if (err.msg) return `${err.loc?.[1] || "field"}: ${err.msg}`;
                  return JSON.stringify(err);
                })
                .join("; ");
            } else if (typeof errorJson.detail === "string") {
              errorMsg = errorJson.detail;
            }
          } else if (errorJson.message) {
            errorMsg = errorJson.message;
          }
        } catch {
          errorMsg = errorText || errorMsg;
        }
        throw new Error(errorMsg);
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to save settings";
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  async function uploadLogo(file: File) {
    if (!canEdit) {
      setError("You do not have permission to edit settings");
      return;
    }

    setUploadingLogo(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/brand-assets/upload-logo", {
        method: "POST",
        headers: getAdminAuthHeaders(),
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to upload logo");

      const data = await res.json();
      if (data.logo_url) setLogoUrl(data.logo_url);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to upload logo";
      setError(message);
    } finally {
      setUploadingLogo(false);
    }
  }

  async function uploadFavicon(file: File) {
    if (!canEdit) {
      setError("You do not have permission to edit settings");
      return;
    }

    setUploadingFavicon(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/brand-assets/upload-favicon", {
        method: "POST",
        headers: getAdminAuthHeaders(),
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to upload favicon");

      const data = await res.json();
      if (data.favicon_url) setFaviconUrl(data.favicon_url);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to upload favicon";
      setError(message);
    } finally {
      setUploadingFavicon(false);
    }
  }

  const updateSocial = (key: SocialKey, value: string) =>
    setSocial((prev) => ({ ...prev, [key]: value }));

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
  
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
          <p className="text-[12px] text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-lg bg-green-50 border border-green-200 p-4 flex items-start gap-3">
          <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
          <p className="text-[12px] text-green-700">Settings saved successfully</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Site Identity */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6">
          <div className="mb-4 flex items-center gap-2 border-b border-neutral-100 pb-4">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
              <Globe className="h-4 w-4" strokeWidth={2} />
            </div>
            <h2 className="text-[14px] font-semibold text-neutral-900">Site Identity</h2>
          </div>

          <div className="space-y-4">
            <div>
              <FieldLabel>Site Name</FieldLabel>
              <TextField value={siteName} onChange={setSiteName} disabled={!canEdit} />
            </div>

            <div>
              <FieldLabel>Tagline</FieldLabel>
              <TextField value={tagline} onChange={setTagline} disabled={!canEdit} />
            </div>

            <div>
              <FieldLabel>Admin Email</FieldLabel>
              <TextField value={adminEmail} onChange={setAdminEmail} disabled={!canEdit} />
            </div>

            <div>
              <FieldLabel>Timezone</FieldLabel>
              <SelectField
                value={timezone}
                onChange={setTimezone}
                disabled={!canEdit}
                options={[
                  "UTC-8 (Pacific Time)",
                  "UTC-7 (Mountain Time)",
                  "UTC-6 (Central Time)",
                  "UTC-5 (Eastern Time)",
                  "UTC+0 (GMT)",
                  "UTC+5 (Pakistan Standard Time)",
                ]}
              />
            </div>

          </div>
        </div>

        {/* Brand Assets */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6">
          <div className="mb-4 flex items-center gap-2 border-b border-neutral-100 pb-4">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
              <ImageIcon className="h-4 w-4" strokeWidth={2} />
            </div>
            <h2 className="text-[14px] font-semibold text-neutral-900">Brand Assets</h2>
          </div>

          <div className="space-y-5">
            <div>
              <FieldLabel>Site Logo</FieldLabel>
              <UploadTile
                icon={<ImageIcon className="h-4 w-4" strokeWidth={1.8} />}
                title="Upload new logo"
                hint="SVG, PNG recommended · 400x120px"
                previewLabel={logoUrl ? "✓" : "LOGO"}
                onFile={uploadLogo}
                disabled={!canEdit || uploadingLogo}
              />
              {uploadingLogo && (
                <p className="mt-2 text-[11px] text-neutral-500 flex items-center gap-2">
                  <Loader2 className="h-3 w-3 animate-spin" /> Uploading...
                </p>
              )}
            </div>

            <div>
              <FieldLabel>Favicon</FieldLabel>
              <UploadTile
                icon={<Globe className="h-4 w-4" strokeWidth={1.8} />}
                title="Upload favicon"
                hint="ICO, PNG · 32x32px or 64x64px"
                previewLabel={faviconUrl ? "✓" : ""}
                onFile={uploadFavicon}
                disabled={!canEdit || uploadingFavicon}
              />
              {uploadingFavicon && (
                <p className="mt-2 text-[11px] text-neutral-500 flex items-center gap-2 ">
                  <Loader2 className="h-3 w-3 animate-spin" /> Uploading...
                </p>
              )}
            </div>

            <div className="pt-1">
              <div className="mb-3 flex items-center gap-2 border-b border-neutral-100 pb-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
                  <Link2 className="h-4 w-4" strokeWidth={2} />
                </div>
                <h3 className="text-[14px] font-semibold text-neutral-900">Social Media Links</h3>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                {SOCIAL_FIELDS.map((field) => (
                  <div key={field.key}>
                    <FieldLabel>{field.label}</FieldLabel>
                    <TextField
                      value={social[field.key]}
                      onChange={(v) => updateSocial(field.key, v)}
                      placeholder={field.placeholder}
                      disabled={!canEdit}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {canEdit && (
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => fetchSettings()}
            disabled={saving}
            className="px-6 py-2.5 rounded-lg border border-neutral-200 bg-white text-[12px] font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={saveSettings}
            disabled={saving}
            className="px-6 py-2.5 rounded-lg bg-primary text-[12px] font-medium text-white hover:bg-rose-700 disabled:opacity-50 transition flex items-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Settings"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
