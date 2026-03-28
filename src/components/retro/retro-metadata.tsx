"use client";

import { useState } from "react";
import { updateRetroMetadataAction } from "@/lib/actions/retro-session";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Camera, Calendar } from "lucide-react";
import { toast } from "sonner";

interface RetroMetadataProps {
  retroId: string;
  location: string | null;
  photoUrl: string | null;
  date: string;
  isFacilitator: boolean;
}

export function RetroMetadata({
  retroId,
  location: initialLocation,
  photoUrl: initialPhotoUrl,
  date: initialDate,
  isFacilitator,
}: RetroMetadataProps) {
  const [location, setLocation] = useState(initialLocation ?? "");
  const [date, setDate] = useState(initialDate);
  const [photoUrl, setPhotoUrl] = useState(initialPhotoUrl);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    const result = await updateRetroMetadataAction(retroId, {
      location: location || null,
      date,
    });
    if (result?.error) toast.error("Failed to save metadata");
    else toast.success("Saved");
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

    const formData = new FormData();
    formData.set("file", file);
    formData.set("retroId", retroId);

    const res = await fetch("/api/uploads/retro-photo", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      toast.error("Upload failed");
      setUploading(false);
      return;
    }

    const { url } = await res.json();

    await updateRetroMetadataAction(retroId, { photoUrl: url });

    setPhotoUrl(url);
    setUploading(false);
    toast.success("Photo uploaded");
  }

  if (!isFacilitator) {
    return (
      <Card>
        <CardContent className="py-3 px-4">
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
            {location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {location}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" /> {date}
            </span>
            {photoUrl && (
              <span className="flex items-center gap-1">
                <Camera className="h-3 w-3" /> Photo attached
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="py-2 px-4">
        <CardTitle className="text-xs text-muted-foreground">
          Retro details
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-3 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label className="text-xs" htmlFor="location">
              Location
            </Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Office, Room 3..."
              className="h-7 text-xs"
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
              className="h-7 text-xs"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            {photoUrl ? (
              <div className="flex items-center gap-2">
                <img
                  src={photoUrl}
                  alt="Retro photo"
                  className="h-10 w-10 rounded object-cover"
                />
                <span className="text-xs text-muted-foreground">
                  Photo attached
                </span>
              </div>
            ) : (
              <label className="flex items-center gap-1 text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                <Camera className="h-3 w-3" />
                {uploading ? "Uploading..." : "Add photo"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            )}
          </div>
          <Button size="sm" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
