import { Card } from "../ui";
import type { Piece } from "../App";

type Props = {
    pieces: Piece[];
    onDelete: (id: number) => void | Promise<void>;
};

export default function PiecesCard({ pieces, onDelete }: Props) {
    return (
        <div style={{ display: "grid", gap: 16 }}>
            <Card title="Your Pieces">
                {pieces.length === 0 ? (
                    <p style={{ opacity: 0.7, margin: 0 }}>No pieces yet.</p>
                ) : (
                    <ul style={{ margin: 0, paddingLeft: 18 }}>
                        {pieces.map((p) => (
                            <li key={p.id} style={{ margin: "6px 0" }}>
                                <b>{p.title}</b>
                                {p.composer ? ` — ${p.composer}` : ""}
                                <button
                                    type="button"
                                    style={{
                                        background: "transparent",
                                        color: "#ff6b6b",
                                        cursor: "pointer",
                                        fontSize: "0.9rem",
                                        padding: "8px 16px", // Added padding
                                        borderRadius: "6px", // Rounded corners
                                        fontWeight: "bold",
                                    }}
                                    onClick={() => onDelete(p.id)}
                                >
                                    X
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </Card>
        </div>
    );
}
