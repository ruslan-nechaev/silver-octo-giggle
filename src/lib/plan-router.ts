export type RoutedPayload =
  | { kind: 'plan'; items: Array<{ exercise: string; sets: number; reps: number; emoji?: string }> }
  | { kind: 'text'; text: string }
  | { kind: 'noop' };

// Try to parse a string to JSON safely
function tryParseJSON(input: string): unknown | null {
  try {
    return JSON.parse(input);
  } catch {
    return null;
  }
}

export function routeWebhookPayload(raw: string): RoutedPayload {
  const trimmed = (raw || '').trim();
  if (!trimmed) return { kind: 'noop' };

  // Explicit prefixes (ru): "План:" or "Обычный текст:" at the start or first line
  const firstLine = trimmed.split(/\r?\n/, 1)[0].trim();

  const lower = firstLine.toLowerCase();
  if (lower.startsWith('план:') || lower === 'план') {
    const after = trimmed.slice(firstLine.length).trim().replace(/^[:\-\s]+/, '');
    const parsed = tryParseJSON(after);
    if (Array.isArray(parsed)) {
      // Validate items
      const items = (parsed as any[])
        .map((v) => ({
          exercise: String(v.exercise ?? v.name ?? ''),
          sets: Number(v.sets ?? v.approaches ?? v.set ?? 0),
          reps: Number(v.reps ?? v.repeat ?? v.count ?? 0),
          emoji: v.emoji ? String(v.emoji) : undefined,
        }))
        .filter((x) => x.exercise && x.sets > 0 && x.reps > 0);
      if (items.length > 0) return { kind: 'plan', items };
    }
    return { kind: 'noop' };
  }

  if (lower.startsWith('обычный текст:')) {
    const after = trimmed.slice(firstLine.length).trim().replace(/^[:\-\s]+/, '');
    if (after) return { kind: 'text', text: after };
    return { kind: 'noop' };
  }

  // Heuristic: JSON array with exercise fields
  const maybeJson = tryParseJSON(trimmed);
  if (Array.isArray(maybeJson)) {
    // Case A: direct array of exercises
    const items = (maybeJson as any[])
      .map((v) => ({
        exercise: String(v.exercise ?? v.name ?? ''),
        sets: Number(v.sets ?? v.approaches ?? v.set ?? 0),
        reps: Number(v.reps ?? v.repeat ?? v.count ?? 0),
        emoji: v.emoji ? String(v.emoji) : undefined,
      }))
      .filter((x) => x.exercise && x.sets > 0 && x.reps > 0);
    if (items.length > 0) return { kind: 'plan', items };

    // Case B: array with `output` field that contains an embedded json block
    const first = (maybeJson as any[])[0];
    if (first && typeof first.output === 'string') {
      const out: string = first.output;
      // try to find JSON array between first '[' and last ']'
      const start = out.indexOf('[');
      const end = out.lastIndexOf(']');
      if (start >= 0 && end > start) {
        const inner = out.slice(start, end + 1);
        const innerParsed = tryParseJSON(inner);
        if (Array.isArray(innerParsed)) {
          const innerItems = (innerParsed as any[])
            .map((v) => ({
              exercise: String(v.exercise ?? v.name ?? ''),
              sets: Number(v.sets ?? v.approaches ?? v.set ?? 0),
              reps: Number(v.reps ?? v.repeat ?? v.count ?? 0),
              emoji: v.emoji ? String(v.emoji) : undefined,
            }))
            .filter((x) => x.exercise && x.sets > 0 && x.reps > 0);
          if (innerItems.length > 0) return { kind: 'plan', items: innerItems };
        }
      }
      // Otherwise treat as plain text output
      if (out && out.trim().length > 0) {
        return { kind: 'text', text: out.trim() };
      }
    }
  }

  return { kind: 'text', text: trimmed };
}

// Map plan items to timeline data entries
export function mapPlanToTimeline(items: RoutedPayload & { kind: 'plan' }): {
  id: number;
  title: string;
  date: string;
  content: string;
  category: string;
  icon: any;
  relatedIds: number[];
  status: 'completed' | 'in-progress' | 'pending';
  energy: number;
  sets: number;
  reps: number;
  emoji?: string;
}[] {
  // Simple mapping: today as date, pending status
  const today = new Date().toISOString().slice(0, 10);
  return items.items.map((it, idx) => ({
    id: idx + 1,
    title: it.exercise,
    date: today,
    content: `${it.emoji ? it.emoji + ' ' : ''}${it.exercise}: ${it.sets}×${it.reps}`,
    category: 'exercise',
    icon: () => null, // will be replaced by timeline
    relatedIds: [],
    status: 'pending',
    energy: 50,
    sets: it.sets,
    reps: it.reps,
    emoji: it.emoji,
  }));
}


