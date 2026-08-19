"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { AlertCircle, ArrowLeft, ArrowRight, ImagePlus, Loader2, Star, X } from "lucide-react";
import { getBrowserSupabase, PRODUCT_BUCKET } from "@/lib/supabase/client";

/** Longest edge after downscaling. Plenty for a full-bleed gallery. */
const MAX_EDGE = 1920;
const QUALITY = 0.82;
const MAX_SOURCE_BYTES = 25 * 1024 * 1024;

type Shot = {
  key: string;
  url: string;
  /** 0-100 while uploading, undefined once stored. */
  progress?: number;
  error?: string;
};

/**
 * Downscale in the browser before uploading.
 *
 * A modern phone photo is 4-12 MB. Sending those raw over mobile data is slow
 * enough that people assume the page has hung, and we would be storing far
 * more resolution than the site ever renders. Re-encoding to WebP at 1920px
 * typically cuts a 6 MB original to about 200 KB.
 */
async function downscale(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) return file; // HEIC on an unsupported browser — send as-is.

  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close?.();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", QUALITY),
  );
  // Keep whichever is smaller — re-encoding can inflate an already-tiny file.
  return blob && blob.size < file.size ? blob : file;
}

export function ImageUploader({
  unitId,
  initial,
}: {
  unitId: string;
  initial: string[];
}) {
  const [shots, setShots] = useState<Shot[]>(
    initial.map((url, i) => ({ key: `existing-${i}-${url}`, url })),
  );
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback(
    async (files: FileList | null) => {
      if (!files?.length) return;
      setNotice(null);
      setBusy(true);

      const supabase = getBrowserSupabase();
      const picked = Array.from(files);

      // Show every tile immediately so the grid reflects the selection while
      // uploads are still running.
      const pending: Shot[] = picked.map((f, i) => ({
        key: `up-${Date.now()}-${i}-${f.name}`,
        url: "",
        progress: 0,
      }));
      setShots((prev) => [...prev, ...pending]);

      await Promise.all(
        picked.map(async (file, i) => {
          const key = pending[i].key;
          const fail = (message: string) =>
            setShots((prev) =>
              prev.map((s) => (s.key === key ? { ...s, error: message, progress: undefined } : s)),
            );

          if (!file.type.startsWith("image/")) return fail("Not an image");
          if (file.size > MAX_SOURCE_BYTES) return fail("Over 25 MB");

          try {
            const blob = await downscale(file);
            setShots((prev) =>
              prev.map((s) => (s.key === key ? { ...s, progress: 45 } : s)),
            );

            const ext = blob.type === "image/webp" ? "webp" : (file.name.split(".").pop() ?? "jpg");
            const path = `${unitId || "unassigned"}/${Date.now()}-${Math.random()
              .toString(36)
              .slice(2, 8)}.${ext}`;

            const { error } = await supabase.storage
              .from(PRODUCT_BUCKET)
              .upload(path, blob, { contentType: blob.type, upsert: false });

            if (error) return fail(error.message.slice(0, 60));

            const { data } = supabase.storage.from(PRODUCT_BUCKET).getPublicUrl(path);
            setShots((prev) =>
              prev.map((s) =>
                s.key === key ? { ...s, url: data.publicUrl, progress: undefined } : s,
              ),
            );
          } catch (err) {
            fail(err instanceof Error ? err.message.slice(0, 60) : "Upload failed");
          }
        }),
      );

      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    },
    [unitId],
  );

  const stored = shots.filter((s) => s.url && !s.error);

  const remove = (key: string) => setShots((prev) => prev.filter((s) => s.key !== key));
  const move = (key: string, dir: -1 | 1) =>
    setShots((prev) => {
      const i = prev.findIndex((s) => s.key === key);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  return (
    <section className="rounded-xl border border-ink-200 bg-white p-5">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-display text-sm font-extrabold uppercase tracking-[0.08em] text-ink-900">
          Photos
        </h2>
        <span className="text-xs text-ink-400">
          {stored.length} {stored.length === 1 ? "photo" : "photos"}
        </span>
      </div>
      <p className="mb-4 text-xs text-ink-500">
        Pick several at once. The first photo is the one shown on cards and search results —
        drag order with the arrows.
      </p>

      {/* The form posts this; the server action reads it instead of guessing
          filenames from the unit id. */}
      <input type="hidden" name="images" value={JSON.stringify(stored.map((s) => s.url))} />

      {/* `multiple` + `accept="image/*"` opens the phone's photo library with
          multi-select, and offers the camera as a source. */}
      <input
        ref={inputRef}
        id="photo-input"
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        onChange={(e) => addFiles(e.target.files)}
      />

      <label
        htmlFor="photo-input"
        className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-ink-300 px-4 py-8 text-center transition-colors hover:border-accent-500 hover:bg-accent-500/[0.03]"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          void addFiles(e.dataTransfer.files);
        }}
      >
        {busy ? (
          <Loader2 aria-hidden className="size-6 animate-spin text-accent-500" />
        ) : (
          <ImagePlus aria-hidden className="size-6 text-ink-400" />
        )}
        <span className="font-display text-xs font-bold uppercase tracking-[0.14em] text-ink-900">
          {busy ? "Uploading" : "Add photos"}
        </span>
        <span className="text-xs text-ink-400">
          Tap to choose from your camera roll, or drop files here
        </span>
      </label>

      {notice && (
        <p role="alert" className="mt-3 flex items-center gap-2 text-xs text-accent-600">
          <AlertCircle aria-hidden className="size-4 shrink-0" />
          {notice}
        </p>
      )}

      {shots.length > 0 && (
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {shots.map((shot, i) => (
            <li
              key={shot.key}
              className="group/shot relative aspect-4/3 overflow-hidden rounded-lg border border-ink-200 bg-ink-100"
            >
              {shot.url && !shot.error && (
                <Image
                  src={shot.url}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover"
                  unoptimized={shot.url.startsWith("blob:")}
                />
              )}

              {shot.progress !== undefined && (
                <div className="absolute inset-0 grid place-items-center bg-ink-900/70">
                  <Loader2 aria-hidden className="size-5 animate-spin text-white" />
                </div>
              )}

              {shot.error && (
                <div className="absolute inset-0 grid place-items-center bg-accent-600/90 p-2 text-center">
                  <span className="text-[0.625rem] leading-tight text-white">{shot.error}</span>
                </div>
              )}

              {i === 0 && !shot.error && shot.url && (
                <span className="absolute left-1.5 top-1.5 inline-flex items-center gap-1 rounded-full bg-ink-900/85 px-2 py-0.5 font-display text-[0.5rem] font-bold uppercase tracking-[0.12em] text-white">
                  <Star aria-hidden className="size-2.5 fill-current" />
                  Main
                </span>
              )}

              {/* Always-visible controls: hover states are useless on a phone. */}
              <div className="absolute inset-x-1 bottom-1 flex items-center justify-between gap-1">
                <span className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => move(shot.key, -1)}
                    disabled={i === 0}
                    aria-label="Move earlier"
                    className="grid size-7 place-items-center rounded-md bg-ink-900/80 text-white transition-colors hover:bg-ink-900 disabled:opacity-30"
                  >
                    <ArrowLeft aria-hidden className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(shot.key, 1)}
                    disabled={i === shots.length - 1}
                    aria-label="Move later"
                    className="grid size-7 place-items-center rounded-md bg-ink-900/80 text-white transition-colors hover:bg-ink-900 disabled:opacity-30"
                  >
                    <ArrowRight aria-hidden className="size-3.5" />
                  </button>
                </span>
                <button
                  type="button"
                  onClick={() => remove(shot.key)}
                  aria-label="Remove photo"
                  className="grid size-7 place-items-center rounded-md bg-accent-500/90 text-white transition-colors hover:bg-accent-500"
                >
                  <X aria-hidden className="size-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {stored.length > 0 && stored.length < 3 && (
        <p className="mt-3 text-xs text-ink-400">
          Three or more photos give the gallery something to work with.
        </p>
      )}
    </section>
  );
}
