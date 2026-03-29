"use client";

import { useState } from "react";
import { updateRetroMetadataAction } from "@/lib/actions/retro-session";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Camera, Calendar } from "lucide-react";
import { toast } from "sonner";

function resizeImage(file: File, maxSize: number, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width > maxSize || height > maxSize) {
        if (width > height) {
          height = Math.round((height * maxSize) / width);
          width = maxSize;
        } else {
          width = Math.round((width * maxSize) / height);
          height = maxSize;
        }
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("no canvas")); return; }
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("canvas toBlob failed"));
      }, "image/jpeg", quality);
    };
    img.onerror = reject;
    img.src = url;
  });
}

interface RetroMetadataProps {
  retroId: string;
  title?: string;
  location: string | null;
  photoUrl: string | null;
  date: string;
  isFacilitator: boolean;
  hidePhoto?: boolean;
  onTitleChange?: (title: string) => void;
}

export function RetroMetadata({
  retroId,
  title: initialTitle,
  location: initialLocation,
  photoUrl: initialPhotoUrl,
  date: initialDate,
  isFacilitator,
  hidePhoto = false,
  onTitleChange,
}: RetroMetadataProps) {
  const [title, setTitle] = useState(initialTitle ?? "");
  const [location, setLocation] = useState(initialLocation ?? "");
  const [date, setDate] = useState(initialDate);
  const [photoUrl, setPhotoUrl] = useState(initialPhotoUrl);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    const result = await updateRetroMetadataAction(retroId, {
      ...(initialTitle !== undefined ? { title: title.trim() || initialTitle } : {}),
      location: location || null,
      date,
    });
    if (result?.error) toast.error("Failed to save metadata");
    else {
      toast.success("Saved");
      if (onTitleChange && title.trim()) onTitleChange(title.trim());
    }
    setSaving(false);
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }

    setUploading(true);

    // Resize image client-side before upload (max 1600px, 85% quality)
    let uploadFile: File | Blob = file;
    try {
      uploadFile = await resizeImage(file, 1600, 0.85);
    } catch {
      // fall back to original file on resize failure
    }

    const formData = new FormData();
    formData.set("file", new File([uploadFile], "photo.jpg", { type: "image/jpeg" }));
    formData.set("retroId", retroId);

    try {
      const res = await fetch("/api/uploads/retro-photo", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const body = await res.text();
        toast.error(`Upload failed (${res.status}): ${body.slice(0, 100)}`);
        setUploading(false);
        return;
      }

      const { url } = await res.json();
      await updateRetroMetadataAction(retroId, { photoUrl: url });
      setPhotoUrl(url);
      setUploading(false);
      toast.success("Photo uploaded");
    } catch (err) {
      toast.error(`Upload error: ${err instanceof Error ? err.message : String(err)}`);
      setUploading(false);
    }
  }

  if (!isFacilitator) {
    return (
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground px-1 pb-1">
        <span className="flex items-center gap-1">
          <Calendar className="h-3 w-3" /> {date}
        </span>
        {location && (
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" /> {location}
          </span>
        )}
        {photoUrl && (
          <span className="flex items-center gap-1">
            <Camera className="h-3 w-3" /> Photo attached
          </span>
        )}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="py-2 px-4">
        <CardTitle className="text-xs text-muted-foreground uppercase tracking-wide">
          Retro details
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 space-y-3">
        {initialTitle !== undefined && (
          <div className="space-y-1">
            <Label className="text-xs" htmlFor="retro-title">
              Title
            </Label>
            <Input
              id="retro-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Retro title"
              className="h-8 text-sm"
            />
          </div>
        )}
        <div className="space-y-1">
          <Label className="text-xs" htmlFor="location">
            Location
          </Label>
          <Input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Office, Room 3..."
            className="h-8 text-sm"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs" htmlFor="date">
            Date
          </Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="h-8 text-sm w-full"
          />
        </div>
        <div className="flex items-center justify-between gap-2 pt-1">
          <div className="flex-1">
            {!hidePhoto && photoUrl ? (
              <div className="flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photoUrl}
                  alt="Retro photo"
                  className="h-9 w-9 rounded-sm object-cover border border-border"
                />
                <span className="text-xs text-muted-foreground">Photo attached</span>
              </div>
            ) : !hidePhoto ? (
              <label className="inline-flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
                <Camera className="h-3.5 w-3.5" />
                {uploading ? "Uploading…" : "Add photo"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            ) : null}
          </div>
          <Button size="sm" onClick={handleSave} disabled={saving} className="shrink-0">
            {saving ? "Saving…" : "Save"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
