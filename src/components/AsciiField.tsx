interface AsciiFieldProps {
  dense?: boolean;
  className?: string;
}

function buildAscii(rows: number, cols: number) {
  const chars = ["D", "<", ">", "v", "^", "K", "T", "/", "\\"];
  const lines: string[] = [];

  for (let y = 0; y < rows; y += 1) {
    let line = "";
    for (let x = 0; x < cols; x += 1) {
      const index = (x * 11 + y * 7 + (x % 6) * (y % 5)) % chars.length;
      line += chars[index];
    }
    lines.push(line);
  }

  return lines.join("\n");
}

const asciiDefault = buildAscii(62, 180);
const asciiDense = buildAscii(74, 210);

export default function AsciiField({ dense = false, className = "" }: AsciiFieldProps) {
  const pattern = dense ? asciiDense : asciiDefault;

  return (
    <div className={`v-ascii-field ${dense ? "v-ascii-field-dense" : ""} ${className}`} aria-hidden>
      <pre className="v-ascii-layer v-ascii-layer-a">{pattern}</pre>
      <pre className="v-ascii-layer v-ascii-layer-b">{pattern}</pre>
      <pre className="v-ascii-layer v-ascii-layer-c">{pattern}</pre>
    </div>
  );
}
