"use client";

import { useProgressTracker } from "./ProgressTracker";

export default function ProgressTrackerWrapper({ slug }: { slug: string }) {
  useProgressTracker(slug);
  return null;
}
