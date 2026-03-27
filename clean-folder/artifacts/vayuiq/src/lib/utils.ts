import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAqiColorClass(aqi: number): string {
  if (aqi <= 50) return "text-aqi-good";
  if (aqi <= 100) return "text-aqi-moderate";
  if (aqi <= 150) return "text-aqi-poor";
  if (aqi <= 200) return "text-aqi-unhealthy";
  return "text-aqi-severe";
}

export function getAqiBgClass(aqi: number): string {
  if (aqi <= 50) return "bg-aqi-good";
  if (aqi <= 100) return "bg-aqi-moderate";
  if (aqi <= 150) return "bg-aqi-poor";
  if (aqi <= 200) return "bg-aqi-unhealthy";
  return "bg-aqi-severe";
}

export function getAqiGlowClass(aqi: number): string {
  if (aqi <= 50) return "box-glow-aqi-good border-aqi-good/50";
  if (aqi <= 100) return "box-glow-aqi-moderate border-aqi-moderate/50";
  if (aqi <= 150) return "box-glow-aqi-poor border-aqi-poor/50";
  if (aqi <= 200) return "box-glow-aqi-unhealthy border-aqi-unhealthy/50";
  return "box-glow-aqi-severe border-aqi-severe/50";
}
