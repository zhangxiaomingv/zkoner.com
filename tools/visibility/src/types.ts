/** 单次观测：一个问题 × 一个模型源的回答与判定结果 */
export interface Observation {
  ts: string;
  date: string;
  questionId: string;
  questionText: string;
  provider: string;
  providerLabel: string;
  raw: string;         // 回答全文
  error?: string;      // 查询失败原因
  mentionHit: boolean; // 是否提到品牌
  consistency: number; // 描述一致性 0-1
  sourceHit: boolean;  // 是否出现官方来源
  score: number;       // 0-100
  pass: boolean;       // score >= passThreshold
}

export type CrosscheckStatus = "ok" | "partial" | "miss" | "blocked" | "error";

export interface CrosscheckResult {
  id: string;
  label: string;
  status: CrosscheckStatus;
  hitKeywords: string[];
  note?: string;
}

/** 一次运行的完整结果（落盘用） */
export interface RunSummary {
  date: string;
  generatedAt: string;
  observations: Observation[];
  crosschecks: CrosscheckResult[];
}

/** data/index.json — 逐日达标率汇总（趋势曲线数据） */
export interface IndexRun {
  date: string;
  passRate: number; // 0-100
  checked: number;  // 有实际回答的观测数
}

export interface IndexData {
  runs: IndexRun[];
}
