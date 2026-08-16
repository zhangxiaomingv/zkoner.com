import type { Question } from "../config.js";

export interface Extracted {
  mentionHit: boolean; // 是否提到品牌
  consistency: number; // 描述一致性 0-1（命中期望描述词的比例）
  sourceHit: boolean;  // 是否出现官方来源
}

/** 从回答原文抽取三个判定维度 */
export function extract(question: Question, raw: string): Extracted {
  if (!raw) return { mentionHit: false, consistency: 0, sourceHit: false };

  const text = raw;
  const mentionHit = question.targets.some((t) => text.includes(t));
  const matched = question.descriptors.filter((d) => text.includes(d)).length;
  const consistency = matched / question.descriptors.length;
  const sourceHit = question.officialUrls.some((u) => text.includes(u));

  return { mentionHit, consistency, sourceHit };
}
