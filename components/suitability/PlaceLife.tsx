"use client";

/** The newer, everyday sections of a place (food, live music, getting around, a note for Winnie). Each only shows when the data has it. */
type Fav = { name: string; what?: string; neighborhood?: string; url?: string | null };
type Venue = { name: string; kind?: string; neighborhood?: string; url?: string | null };
export interface PlaceLifeData {
  forWinnie?: string;
  foodScene?: { score?: number; rating?: string; notes?: string; favorites?: Fav[] };
  liveMusic?: { score?: number; rating?: string; notes?: string; venues?: Venue[] };
  everydayLife?: {
    markets?: (string | Fav)[];
    walks?: { name: string; notes?: string }[];
    gettingAround?: string;
    neighborhoods?: { name: string; why?: string }[];
    notes?: string;
  };
}

const label: React.CSSProperties = { fontSize: "0.5625rem", color: "#a8a29e", letterSpacing: "0.15em", margin: "0 0 1rem" };
const card = (accent: string): React.CSSProperties => ({ padding: "1.25rem", backgroundColor: "#faf8f5", borderLeft: `3px solid ${accent}` });
const small: React.CSSProperties = { fontSize: "0.75rem", color: "#78716c", margin: 0, lineHeight: 1.6 };

function Name({ name, url }: { name: string; url?: string | null }) {
  return url ? (
    <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: "#292524", textDecoration: "underline", textUnderlineOffset: 3, textDecorationColor: "#d6d3d1" }}>
      {name}
    </a>
  ) : (
    <span style={{ color: "#292524" }}>{name}</span>
  );
}

function Score({ score, rating }: { score?: number; rating?: string }) {
  if (typeof score !== "number" && !rating) return null;
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem", marginBottom: "0.5rem" }}>
      {typeof score === "number" && <span style={{ fontFamily: "Georgia, serif", fontSize: "2rem", color: "#292524" }}>{score}</span>}
      {rating && <span style={{ fontSize: "0.875rem", color: "#78716c" }}>{rating}</span>}
    </div>
  );
}

function List({ items }: { items: { key: string; node: React.ReactNode }[] }) {
  return (
    <ul style={{ listStyle: "none", padding: 0, margin: "0.75rem 0 0" }}>
      {items.map((i) => (
        <li key={i.key} style={{ padding: "0.5rem 0", borderTop: "1px solid #e7e5e4", fontSize: "0.8125rem", lineHeight: 1.5 }}>
          {i.node}
        </li>
      ))}
    </ul>
  );
}

export function ForWinnie({ data }: { data: PlaceLifeData }) {
  if (!data.forWinnie) return null;
  return (
    <div style={{ marginBottom: "2.5rem" }}>
      <p style={label}>IN SHORT</p>
      <p style={{ fontFamily: "Georgia, serif", fontSize: "1.15rem", lineHeight: 1.6, color: "#44403c", margin: 0 }}>{data.forWinnie}</p>
    </div>
  );
}

export function PlaceLife({ data }: { data: PlaceLifeData }) {
  const { foodScene: f, liveMusic: m, everydayLife: e } = data;
  return (
    <>
      {f && (
        <div style={{ marginBottom: "2.5rem" }}>
          <p style={label}>FOOD &amp; MARKETS</p>
          <div style={card("#B4633F")}>
            <Score score={f.score} rating={f.rating} />
            {f.notes && <p style={{ ...small, fontStyle: "italic" }}>{f.notes}</p>}
            {f.favorites && f.favorites.length > 0 && (
              <List
                items={f.favorites.map((x) => ({
                  key: x.name,
                  node: (
                    <>
                      <Name name={x.name} url={x.url} />
                      <span style={{ color: "#78716c" }}>{[x.what, x.neighborhood].filter(Boolean).join(" · ") ? ` · ${[x.what, x.neighborhood].filter(Boolean).join(" · ")}` : ""}</span>
                    </>
                  ),
                }))}
              />
            )}
          </div>
        </div>
      )}
      {m && (
        <div style={{ marginBottom: "2.5rem" }}>
          <p style={label}>LIVE MUSIC</p>
          <div style={card("#2E5552")}>
            <Score score={m.score} rating={m.rating} />
            {m.notes && <p style={{ ...small, fontStyle: "italic" }}>{m.notes}</p>}
            {m.venues && m.venues.length > 0 && (
              <List
                items={m.venues.map((v) => ({
                  key: v.name,
                  node: (
                    <>
                      <Name name={v.name} url={v.url} />
                      <span style={{ color: "#78716c" }}>{[v.kind, v.neighborhood].filter(Boolean).length ? ` · ${[v.kind, v.neighborhood].filter(Boolean).join(" · ")}` : ""}</span>
                    </>
                  ),
                }))}
              />
            )}
          </div>
        </div>
      )}
      {e && (
        <div style={{ marginBottom: "2.5rem" }}>
          <p style={label}>EVERYDAY LIFE</p>
          <div style={card("#9BAE8E")}>
            {e.notes && <p style={{ ...small, fontStyle: "italic", marginBottom: "0.75rem" }}>{e.notes}</p>}
            {e.gettingAround && (
              <p style={{ ...small, marginBottom: "0.75rem" }}>
                <strong style={{ color: "#44403c", fontWeight: 500 }}>Getting around.</strong> {e.gettingAround}
              </p>
            )}
            {e.neighborhoods && e.neighborhoods.length > 0 && (
              <>
                <p style={{ ...small, color: "#44403c", fontWeight: 500, marginTop: "0.75rem" }}>Neighbourhoods to look at</p>
                <List items={e.neighborhoods.map((n) => ({ key: n.name, node: <><span style={{ color: "#292524" }}>{n.name}</span>{n.why && <span style={{ color: "#78716c" }}> · {n.why}</span>}</> }))} />
              </>
            )}
            {e.markets && e.markets.length > 0 && (
              <>
                <p style={{ ...small, color: "#44403c", fontWeight: 500, marginTop: "1rem" }}>Markets</p>
                <List
                  items={e.markets.map((x, i) =>
                    typeof x === "string"
                      ? { key: x + i, node: x }
                      : { key: x.name + i, node: <><Name name={x.name} url={x.url} />{(x.what || x.neighborhood) && <span style={{ color: "#78716c" }}> · {[x.what, x.neighborhood].filter(Boolean).join(" · ")}</span>}</> }
                  )}
                />
              </>
            )}
            {e.walks && e.walks.length > 0 && (
              <>
                <p style={{ ...small, color: "#44403c", fontWeight: 500, marginTop: "1rem" }}>Walks</p>
                <List items={e.walks.map((w) => ({ key: w.name, node: <><span style={{ color: "#292524" }}>{w.name}</span>{w.notes && <span style={{ color: "#78716c" }}> · {w.notes}</span>}</> }))} />
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
