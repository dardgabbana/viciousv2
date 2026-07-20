"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent, type PointerEvent } from "react";
import styles from "./ViciousOS.module.css";

type Product = {
  id: number;
  title: string;
  price: number;
  image: string;
  images: string;
  description: string;
  category: string;
  createdAt: Date | string;
};

type Collection = {
  id: number;
  name: string;
  description: string | null;
  image: string | null;
  createdAt: Date | string;
};

type Post = {
  id: number;
  title: string;
  content: string;
  coverImage: string | null;
  publishedAt: Date | string | null;
  createdAt: Date | string;
};

type WindowId =
  | "artifacts"
  | "archive"
  | "entities"
  | "surveillance"
  | "thoughts"
  | "gaming"
  | "terminal"
  | "contact"
  | "createUser";

type WindowState = {
  id: WindowId;
  title: string;
  x: number;
  y: number;
  w: number;
  h: number;
  open: boolean;
  z: number;
};

type ViciousOSProps = {
  products: Product[];
  collections: Collection[];
  posts: Post[];
};

const characterFiles = [
  { name: "ENTITY_78LEET", src: "/images/characters/78leet.png", code: "VIC-078", status: "FIELD HOSTILE" },
  { name: "ENTITY_BRAIDOC", src: "/images/characters/braidoc.png", code: "VIC-204", status: "ANALYSIS LOOP" },
  { name: "ENTITY_CIRLEVIL", src: "/images/characters/cirlevil.png", code: "VIC-666", status: "SMILING" },
  { name: "ENTITY_LIGHNY", src: "/images/characters/lighny.png", code: "VIC-011", status: "ENERGY LEAK" },
  { name: "ENTITY_ROANBO", src: "/images/characters/roanbo.png", code: "VIC-313", status: "MECHANICAL" },
  { name: "ENTITY_SEWNTON", src: "/images/characters/sewnton.png", code: "VIC-097", status: "MOOD ARRAY" },
];

const desktopApps: { id: WindowId; label: string; glyph: string; variant: string }[] = [
  { id: "artifacts", label: "CLOTHING ARTIFACTS", glyph: "CA", variant: "clothing" },
  { id: "archive", label: "ARCHIVE", glyph: "AR", variant: "archive" },
  { id: "entities", label: "ENTITY DATABASE", glyph: "ED", variant: "entity" },
  { id: "surveillance", label: "SURVEILLANCE", glyph: "SV", variant: "surveillance" },
  { id: "thoughts", label: "THOUGHTS", glyph: "TH", variant: "thoughts" },
  { id: "gaming", label: "GAMING", glyph: "GM", variant: "gaming" },
  { id: "terminal", label: "TERMINAL", glyph: ">_", variant: "terminal" },
  { id: "contact", label: "CONTACT", glyph: "CN", variant: "contact" },
];

const surveillanceFrames = [
  { title: "ROOM_A / SUBJECT HOLDING FILE", src: "/images/surveillance-2026/imvicious-0002-layer-3.jpg" },
  { title: "ROOM_A / DICE INCIDENT", src: "/images/surveillance-2026/imvicious-0008-layer-9.jpg" },
  { title: "ROOM_A / TABLE RECORD", src: "/images/surveillance-2026/imvicious-0009-layer-10.jpg" },
  { title: "ROOM_A / CRT TRANSFER", src: "/images/surveillance-2026/imvicious-0012-layer-13.jpg" },
  { title: "ROOM_A / BELT FILE", src: "/images/surveillance-2026/imvicious-0013-layer-14.jpg" },
  { title: "ROOM_A / CONFLICT STUDY", src: "/images/surveillance-2026/imvicious-0019-layer-20.jpg" },
  { title: "ROOM_A / STATIC FIGHT", src: "/images/surveillance-2026/imvicious-0024-layer-25.jpg" },
  { title: "ROOM_A / SWORD FRAME", src: "/images/surveillance-2026/imvicious-0030-layer-31.jpg" },
];

function formatDate(value: Date | string | null) {
  if (!value) return "UNRECORDED";
  return new Intl.DateTimeFormat("en", { month: "2-digit", day: "2-digit", year: "numeric" }).format(new Date(value));
}

function parseImages(images: string) {
  try {
    const parsed = JSON.parse(images);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function createInitialWindows(): Record<WindowId, WindowState> {
  return {
    artifacts: { id: "artifacts", title: "SHOP / RECOVERED ARTIFACTS", x: 212, y: 64, w: 980, h: 640, open: true, z: 8 },
    archive: { id: "archive", title: "ARCHIVE ROOT", x: 252, y: 96, w: 540, h: 420, open: false, z: 3 },
    entities: { id: "entities", title: "ENTITY DATABASE", x: 122, y: 176, w: 500, h: 456, open: false, z: 1 },
    surveillance: { id: "surveillance", title: "SURVEILLANCE", x: 664, y: 86, w: 560, h: 390, open: false, z: 1 },
    thoughts: { id: "thoughts", title: "THOUGHTS / RECOVERED WRITING", x: 344, y: 122, w: 620, h: 430, open: false, z: 1 },
    gaming: { id: "gaming", title: "GAMING", x: 554, y: 174, w: 520, h: 380, open: false, z: 1 },
    terminal: { id: "terminal", title: "TERMINAL", x: 174, y: 420, w: 560, h: 300, open: false, z: 1 },
    contact: { id: "contact", title: "CONTACT NODE", x: 480, y: 220, w: 500, h: 342, open: false, z: 1 },
    createUser: { id: "createUser", title: "CREATE USER", x: 430, y: 170, w: 440, h: 366, open: false, z: 1 },
  };
}

export default function ViciousOS({ products, collections, posts }: ViciousOSProps) {
  const [windows, setWindows] = useState(createInitialWindows);
  const [, setMaxZ] = useState(5);
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalLines, setTerminalLines] = useState<string[]>([
    "VICIOUS CORPORATE OPERATOR ONLINE.",
    "ASK ABOUT ARTIFACTS, SIZING, SHIPPING, CONTACT, ENTITIES, OR SURVEILLANCE.",
  ]);
  const [notice] = useState("INDEXED " + products.length + " ARTIFACTS");
  const [idle, setIdle] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [indexOpen, setIndexOpen] = useState(false);
  const idleTimer = useRef<number | null>(null);

  useEffect(() => {
    const armIdle = () => {
      setIdle(false);
      if (idleTimer.current) window.clearTimeout(idleTimer.current);
      idleTimer.current = window.setTimeout(() => setIdle(true), 60000);
    };

    armIdle();
    window.addEventListener("pointermove", armIdle);
    window.addEventListener("keydown", armIdle);
    return () => {
      if (idleTimer.current) window.clearTimeout(idleTimer.current);
      window.removeEventListener("pointermove", armIdle);
      window.removeEventListener("keydown", armIdle);
    };
  }, []);

  const latestArtifacts = useMemo(() => products, [products]);

  const focusWindow = useCallback((id: WindowId) => {
    setMaxZ((current) => {
      const next = current + 1;
      setWindows((state) => ({ ...state, [id]: { ...state[id], z: next, open: true } }));
      return next;
    });
  }, []);

  const closeWindow = (id: WindowId) => {
    setWindows((state) => ({ ...state, [id]: { ...state[id], open: false } }));
  };

  const dragWindow = (event: PointerEvent<HTMLDivElement>, id: WindowId) => {
    if (event.button !== 0) return;
    focusWindow(id);
    const startX = event.clientX;
    const startY = event.clientY;
    const origin = windows[id];
    const target = event.currentTarget;
    target.setPointerCapture(event.pointerId);

    const handleMove = (moveEvent: globalThis.PointerEvent) => {
      const nextX = Math.max(0, Math.min(window.innerWidth - 180, origin.x + moveEvent.clientX - startX));
      const nextY = Math.max(0, Math.min(window.innerHeight - 90, origin.y + moveEvent.clientY - startY));
      setWindows((state) => ({ ...state, [id]: { ...state[id], x: nextX, y: nextY } }));
    };

    const handleUp = () => {
      target.releasePointerCapture(event.pointerId);
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
  };

  const runCommand = () => {
    const command = terminalInput.trim();
    if (!command) return;
    const lowerCommand = command.toLowerCase();

    const exactOutput: Record<string, string[]> = {
      help: ["VICIOUS CORPORATE: I can locate clothing artifacts, entity files, surveillance frames, contact routes, sizing notes, and acquisition guidance."],
      list: desktopApps.map((app) => app.label),
      whoami: ["UNKNOWN VISITOR", "ACCESS: BORROWED", "TRACE: INCOMPLETE"],
      recover: ["RECOVERY ATTEMPT STARTED", "UNINDEXED FILE FOUND: /ROOT/DO_NOT_EXPLAIN.TXT", "CONTENTS: EVERYTHING IS ARCHIVED."],
      vicious: ["VICIOUS CORPORATE: The organization does not answer direct questions. It leaves records."],
      clear: [],
    };

    let response = exactOutput[lowerCommand];
    if (lowerCommand.includes("artifact") || lowerCommand.includes("clothing") || lowerCommand.includes("shop")) {
      focusWindow("artifacts");
      response = ["VICIOUS CORPORATE: Clothing artifacts opened. Select a recovered object to view its acquisition file."];
    }
    if (lowerCommand.includes("entity") || lowerCommand.includes("character")) {
      focusWindow("entities");
      response = ["VICIOUS CORPORATE: Entity database opened. Their biographies are intentionally incomplete."];
    }
    if (lowerCommand.includes("surveillance") || lowerCommand.includes("camera") || lowerCommand.includes("photo")) {
      focusWindow("surveillance");
      response = ["VICIOUS CORPORATE: Surveillance node opened. Treat every frame as evidence, not content."];
    }
    if (lowerCommand.includes("thought") || lowerCommand.includes("blog") || lowerCommand.includes("writing")) {
      focusWindow("thoughts");
      response = ["VICIOUS CORPORATE: Thoughts opened. These are recovered writings, not explanations."];
    }
    if (lowerCommand.includes("game") || lowerCommand.includes("gaming") || lowerCommand.includes("play")) {
      focusWindow("gaming");
      response = ["VICIOUS CORPORATE: Gaming folder opened. Recreational files may be unstable."];
    }
    if (lowerCommand.includes("contact") || lowerCommand.includes("email") || lowerCommand.includes("instagram")) {
      focusWindow("contact");
      response = ["VICIOUS CORPORATE: Contact route is viciouscorporate@gmail.com. Instagram signal: @imvicious_com."];
    }
    if (lowerCommand.includes("size") || lowerCommand.includes("fit")) {
      response = ["VICIOUS CORPORATE: Size records live inside each artifact file. Open the item before acquisition."];
    }
    if (lowerCommand.includes("ship") || lowerCommand.includes("checkout") || lowerCommand.includes("buy")) {
      response = ["VICIOUS CORPORATE: Acquisition continues through the artifact page checkout queue."];
    }
    if (lowerCommand.includes("create") && lowerCommand.includes("user")) {
      focusWindow("createUser");
      response = ["VICIOUS CORPORATE: Visitor intake form opened. Use accurate records."];
    }
    response ??= ["VICIOUS CORPORATE: Request received. Try asking for artifacts, entities, surveillance, contact, sizing, shipping, or user creation."];

    setTerminalLines((lines) => (lowerCommand === "clear" ? [] : [...lines, `> ${command}`, ...response]));
    setTerminalInput("");
  };

  return (
    <main
      className={styles.os}
      onContextMenu={(event) => {
        event.preventDefault();
        setContextMenu({ x: event.clientX, y: event.clientY });
        setIndexOpen(false);
      }}
      onPointerDown={(event) => {
        if (event.button === 0) {
          setContextMenu(null);
        }
      }}
    >
      <div className={styles.crt} aria-hidden />
      <div className={styles.wallpaper} aria-hidden />
      <aside className={styles.icons} aria-label="Vicious OS applications">
        {desktopApps.map((app) => (
          <button key={app.id} className={styles.icon} type="button" onDoubleClick={() => focusWindow(app.id)} onClick={() => focusWindow(app.id)}>
            <span className={styles.folderIcon} data-folder={app.variant}>
              <span>{app.glyph}</span>
            </span>
            <small>{app.label}</small>
          </button>
        ))}
      </aside>

      {contextMenu && (
        <div
          className={styles.contextMenu}
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onPointerDown={(event) => event.stopPropagation()}
        >
          <button type="button" onClick={() => window.location.reload()}>Refresh</button>
          <button
            type="button"
            onClick={() => {
              focusWindow("createUser");
              setContextMenu(null);
            }}
          >
            Create a User
          </button>
        </div>
      )}

      {indexOpen && (
        <nav className={styles.startMenu} aria-label="Vicious OS index">
          <strong>VICIOUS INDEX</strong>
          {desktopApps.map((app) => (
            <button
              key={app.id}
              type="button"
              onClick={() => {
                focusWindow(app.id);
                setIndexOpen(false);
              }}
            >
              {app.label}
            </button>
          ))}
          <button type="button" onClick={() => window.location.reload()}>REFRESH SYSTEM</button>
        </nav>
      )}

      {Object.values(windows).map((win) =>
        win.open ? (
          <section
            key={win.id}
            className={styles.window}
            style={{ left: win.x, top: win.y, width: win.w, minHeight: win.h, zIndex: win.z }}
            onPointerDown={() => focusWindow(win.id)}
          >
            <div className={styles.titlebar} onPointerDown={(event) => dragWindow(event, win.id)}>
              <span>{win.title}</span>
              <button
                type="button"
                onPointerDown={(event) => event.stopPropagation()}
                onClick={(event) => {
                  event.stopPropagation();
                  closeWindow(win.id);
                }}
                aria-label={`Close ${win.title}`}
              >
                X
              </button>
            </div>
            <div className={styles.windowBody}>
              {win.id === "archive" && (
                <ArchiveApp collections={collections} posts={posts} onOpen={focusWindow} />
              )}
              {win.id === "artifacts" && <ArtifactsApp products={latestArtifacts} />}
              {win.id === "entities" && <EntitiesApp />}
              {win.id === "surveillance" && <SurveillanceApp />}
              {win.id === "thoughts" && <ThoughtsApp posts={posts} />}
              {win.id === "gaming" && <GamingApp />}
              {win.id === "terminal" && (
                <TerminalApp
                  lines={terminalLines}
                  value={terminalInput}
                  onChange={setTerminalInput}
                  onRun={runCommand}
                />
              )}
              {win.id === "contact" && <ContactApp />}
              {win.id === "createUser" && <CreateUserApp />}
            </div>
          </section>
        ) : null
      )}

      {idle && (
        <div className={styles.screensaver}>
          <span>ARCHIVE IDLE</span>
          <span>CAMERA FEED LOST</span>
        </div>
      )}

      <footer className={styles.taskbar}>
        <button type="button" onClick={() => setIndexOpen((open) => !open)}>INDEX</button>
        <span>{notice}</span>
        <button type="button" onClick={() => window.location.reload()}>REFRESH</button>
      </footer>
    </main>
  );
}

function ArchiveApp({
  collections,
  posts,
  onOpen,
}: {
  collections: Collection[];
  posts: Post[];
  onOpen: (id: WindowId) => void;
}) {
  return (
    <div className={styles.archiveGrid}>
      <div className={styles.stamp}>EVERYTHING IS ARCHIVED. NOTHING IS EXPLAINED.</div>
      <button type="button" onClick={() => onOpen("artifacts")}>/ROOT/RECOVERED_ARTIFACTS</button>
      <button type="button" onClick={() => onOpen("entities")}>/ROOT/ENTITY_DATABASE</button>
      <button type="button" onClick={() => onOpen("surveillance")}>/ROOT/SURVEILLANCE</button>
      <button type="button" onClick={() => onOpen("thoughts")}>/ROOT/THOUGHTS</button>
      <button type="button" onClick={() => onOpen("gaming")}>/ROOT/GAMING</button>
      <button type="button" onClick={() => onOpen("contact")}>/ROOT/CONTACT_NODE</button>
      <div>
        <h3>OPERATIONS</h3>
        {(collections.length ? collections : [{ id: 0, name: "NO OPERATIONS INDEXED", description: null, image: null, createdAt: new Date() }]).slice(0, 4).map((item) => (
          <p key={item.id}>{item.name.toUpperCase()} / {formatDate(item.createdAt)}</p>
        ))}
      </div>
      <div>
        <h3>RECOVERED NOTES</h3>
        {(posts.length ? posts : [{ id: 0, title: "NO NOTES RECORDED", content: "", coverImage: null, createdAt: new Date(), publishedAt: null }]).slice(0, 3).map((post) => (
          <p key={post.id}>{post.title.toUpperCase()}</p>
        ))}
      </div>
    </div>
  );
}

function ArtifactsApp({ products }: { products: Product[] }) {
  if (!products.length) return <p className={styles.empty}>NO ARTIFACTS RECOVERED.</p>;

  return (
    <div className={styles.artifactShop}>
      <div className={styles.shopHeader}>
        <div>
          <h2>RECOVERED CLOTHING INDEX</h2>
          <p>SELECT AN ARTIFACT TO OPEN ITS ACQUISITION FILE.</p>
        </div>
        <Link href="/shop" className={styles.shopHeaderLink}>OPEN LEGACY SHOP</Link>
      </div>
      <div className={styles.artifacts}>
        {products.map((product) => {
          const hoverImage = parseImages(product.images)[0];
          return (
            <article key={product.id} className={styles.artifact}>
              <Link href={`/shop/${product.id}`} className={styles.artifactImage}>
                <Image src={product.image} alt={product.title} fill className={hoverImage ? styles.primaryImage : ""} sizes="(max-width: 900px) 46vw, 260px" />
                {hoverImage && <Image src={hoverImage} alt="" fill className={styles.hoverImage} sizes="(max-width: 900px) 46vw, 260px" />}
              </Link>
              <Link href={`/shop/${product.id}`} className={styles.artifactRecord}>
                <h3>{product.title.toUpperCase()}</h3>
                <p>FILE: ART-{String(product.id).padStart(3, "0")}</p>
                <p>DEPARTMENT: TEXTILE EVIDENCE</p>
                <p>TYPE: {(product.category || "single").toUpperCase()}</p>
                <strong>${product.price.toFixed(2)}</strong>
              </Link>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function EntitiesApp() {
  return (
    <div className={styles.entities}>
      {characterFiles.map((entity) => (
        <article key={entity.name}>
          <div className={styles.entityImage}>
            <Image src={entity.src} alt={entity.name} fill sizes="150px" />
          </div>
          <h3>{entity.name}</h3>
          <p>{entity.code}</p>
          <p>{entity.status}</p>
        </article>
      ))}
    </div>
  );
}

function SurveillanceApp() {
  return (
    <div className={styles.surveillance}>
      {surveillanceFrames.map((frame, index) => (
        <div key={frame.src} className={styles.feed}>
          <Image src={frame.src} alt={frame.title} fill className={styles.feedImage} sizes="280px" />
          <span>CAM_{String(index + 1).padStart(2, "0")} / SIGNAL DEGRADED</span>
        </div>
      ))}
    </div>
  );
}

function ThoughtsApp({ posts }: { posts: Post[] }) {
  if (!posts.length) {
    return <p className={styles.empty}>NO THOUGHTS RECOVERED.</p>;
  }

  return (
    <div className={styles.thoughts}>
      {posts.map((post) => (
        <Link key={post.id} href={`/blog/${post.id}`}>
          <span>{formatDate(post.publishedAt || post.createdAt)}</span>
          <strong>{post.title.toUpperCase()}</strong>
          <p>{stripHtml(post.content).slice(0, 180) || "CONTENTS REDACTED"}...</p>
        </Link>
      ))}
    </div>
  );
}

function GamingApp() {
  const games = [
    { name: "TETRIS", note: "BLOCK STACKING FILE" },
    { name: "PACMAN", note: "MAZE CONSUMPTION SIM" },
    { name: "SNAKE", note: "GROWTH LOOP" },
    { name: "PAINTBALL", note: "IMPACT TEST ARENA" },
  ];

  return (
    <div className={styles.gaming}>
      <p>SELECT A RECREATIONAL FILE. FULL EMULATION PENDING.</p>
      <div>
        {games.map((game) => (
          <button key={game.name} type="button">
            <strong>{game.name}</strong>
            <span>{game.note}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function TerminalApp({
  lines,
  value,
  onChange,
  onRun,
}: {
  lines: string[];
  value: string;
  onChange: (value: string) => void;
  onRun: () => void;
}) {
  return (
    <div className={styles.terminal}>
      <div>
        {lines.map((line, index) => (
          <p key={`${line}-${index}`}>{line}</p>
        ))}
      </div>
      <label>
        <span>&gt;</span>
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") onRun();
          }}
          autoComplete="off"
          spellCheck={false}
        />
      </label>
    </div>
  );
}

function ContactApp() {
  return (
    <div className={styles.contact}>
      <p>CONTACT NODE IS OPEN.</p>
      <p>DIRECT TRANSMISSIONS ONLY.</p>
      <a href="mailto:viciouscorporate@gmail.com">VICIOUSCORPORATE@GMAIL.COM</a>
      <a href="https://instagram.com/imvicious_com" target="_blank" rel="noreferrer">@IMVICIOUS_COM</a>
      <Link href="/checkout">ACQUISITION QUEUE</Link>
      <Link href="/radio">RADIO SIGNAL</Link>
    </div>
  );
}

function CreateUserApp() {
  const [submitted, setSubmitted] = useState(false);

  const submitUser = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <form className={styles.userForm} onSubmit={submitUser}>
      <p>VISITOR INTAKE / TEMPORARY ACCESS RECORD</p>
      <label>
        <span>FIRST NAME</span>
        <input name="firstName" required autoComplete="given-name" />
      </label>
      <label>
        <span>LAST NAME</span>
        <input name="lastName" required autoComplete="family-name" />
      </label>
      <label>
        <span>EMAIL ADDRESS</span>
        <input name="email" type="email" required autoComplete="email" />
      </label>
      <button type="submit">CREATE USER</button>
      {submitted && <strong>USER RECORD CREATED / PERMANENCE NOT GUARANTEED</strong>}
    </form>
  );
}
