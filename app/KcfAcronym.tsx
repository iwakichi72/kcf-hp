"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

/**
 * 社名 KCF を「ひとつに固定した意味」ではなく、K / C / F の三つのリールが
 * 入れ替わり続ける略語として見せるブロック。
 *
 * スロットに寄せすぎると遊技機になるので、機構は空港の反転フラップ表示に寄せた。
 *   - 三つのリールは同時に止まらない。K → C → F の順に 150ms ずつ遅れて着地する。
 *   - 一巡すると必ず 0 番目（社名の原点）に戻る。名前は動いても、署名は一つ。
 *   - 動くのは英単語だけ。K/C/F の字面と和文の位置は動かないので、
 *     視線がページ上で跳ねない。
 *
 * 文言はすべて READINGS の一箇所に置いてある。ここを書き換えれば足りる。
 */

export type Reading = {
  /** K / C / F に当てる語。頭文字は必ず K・C・F。 */
  readonly words: readonly [string, string, string];
  /** 三語をつないだ和文の理念。句点まで含めて 20 字以内に収める。 */
  readonly ja: string;
};

/**
 * ※ 文言はデザイン提案時点のたたき台。確定前に必ず内容の確認を受けること。
 * 0 番目は社名の由来として扱うので、並べ替えるときも先頭に置く。
 */
export const READINGS: readonly Reading[] = [
  { words: ["Kumazawa", "Creative", "Function"], ja: "熊澤の創造を、機能させる。" },
  { words: ["Kaizen", "Continuity", "Field"], ja: "改善を、現場で、続ける。" },
  { words: ["Knowledge", "Clarity", "Foundation"], ja: "知見を、明快な土台にする。" },
  { words: ["Kickoff", "Commitment", "Follow-through"], ja: "始まりから、定着まで。" },
  { words: ["Key", "Collaboration", "Future"], ja: "要をともに担い、次へ。" },
];

const LETTERS = ["K", "C", "F"] as const;

/** 和文を読み切れる長さ。短くすると落ち着きがなくなる。 */
const INTERVAL = 4600;

/** リール一本ごとの着地差。0 だと三つ同時に止まって機構に見えない。 */
const STAGGER = 150;

const MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToMotionPreference(onChange: () => void) {
  const query = window.matchMedia(MOTION_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/** サーバーでは常に false。設定を尊重した静止状態はマウント後に確定する。 */
function useReducedMotion() {
  return useSyncExternalStore(
    subscribeToMotionPreference,
    () => window.matchMedia(MOTION_QUERY).matches,
    () => false,
  );
}

export function KcfAcronym() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();

  // ポインタがブロックの上にある / フォーカスが中にある間は進めない。
  // 読んでいる最中に切り替わるのが、この手の表現でいちばん嫌われる。
  const [held, setHeld] = useState(false);

  const stopped = paused || reduced || held;

  useEffect(() => {
    if (stopped) return;

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % READINGS.length);
    }, INTERVAL);

    return () => window.clearInterval(timer);
  }, [stopped]);

  const reading = READINGS[index];

  return (
    <section className="acronym-section" aria-labelledby="acronym-title">
      <div className="section-shell">
        <div className="section-heading">
          <div>
            <p className="section-kicker section-kicker-dark">WHAT THE LETTERS STAND FOR</p>
            <h2 id="acronym-title">
              KCFは、
              <span>ひとつの意味に固定しません。</span>
            </h2>
          </div>
          <p className="section-introduction">
            三文字は、支援の場面ごとに違う言葉を受け取ります。
            どの読み方をしても、最後は同じ一つの姿勢に戻ります。
          </p>
        </div>

        <div
          className="acronym-stage"
          onMouseEnter={() => setHeld(true)}
          onMouseLeave={() => setHeld(false)}
          onFocusCapture={() => setHeld(true)}
          onBlurCapture={() => setHeld(false)}
        >
          {/* 目に見える機構は装飾。読み上げには下の一覧を渡す。 */}
          <div className="acronym-reels" aria-hidden="true">
            {LETTERS.map((letter, column) => (
              <div className="acronym-reel" key={letter}>
                <span className="acronym-letter">{letter}</span>
                <span className="acronym-window">
                  <span
                    className="acronym-track"
                    style={{
                      transform: `translateY(${-index * 100}%)`,
                      transitionDelay: `${column * STAGGER}ms`,
                    }}
                  >
                    {READINGS.map((entry, row) => (
                      <span className="acronym-word" key={row}>
                        {entry.words[column]}
                      </span>
                    ))}
                  </span>
                </span>
              </div>
            ))}
          </div>

          {/* key を変えて差し替えることで、和文だけは滑らずに入れ替わる。 */}
          <p className="acronym-japanese" key={index} aria-hidden="true">
            {reading.ja}
          </p>

          <ul className="visually-hidden">
            {READINGS.map((entry) => (
              <li key={entry.ja}>
                {entry.words.join(" / ")}：{entry.ja}
              </li>
            ))}
          </ul>

          <div className="acronym-controls">
            <ul className="acronym-dots" aria-hidden="true">
              {READINGS.map((entry, dot) => (
                <li key={entry.ja}>
                  <button
                    type="button"
                    className={
                      dot === index ? "acronym-dot acronym-dot-active" : "acronym-dot"
                    }
                    tabIndex={-1}
                    onClick={() => setIndex(dot)}
                  >
                    <span />
                  </button>
                </li>
              ))}
            </ul>

            <button
              type="button"
              className="acronym-toggle"
              aria-pressed={paused}
              onClick={() => setPaused((current) => !current)}
            >
              {paused ? "切り替えを再開" : "切り替えを止める"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
