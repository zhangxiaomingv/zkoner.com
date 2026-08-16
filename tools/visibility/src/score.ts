/**
 * 打分规则（0-100）：
 *  命中品牌 40 分 + 描述一致性 30 分（×比例）+ 官方来源 30 分
 * 达到 passThreshold（config.ts 默认 60）即达标。
 */
export function score(
  mentionHit: boolean,
  consistency: number,
  sourceHit: boolean
): number {
  const s = (mentionHit ? 40 : 0) + consistency * 30 + (sourceHit ? 30 : 0);
  return Math.round(s);
}
