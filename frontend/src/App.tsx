import { useEffect, useState } from "react";
import { api } from "./api";
import StatsPanel from "./components/StatsPanel";
import LogSessionForm from "./components/LogSessionForm";
import { Page, Card, Grid, TwoCol, Button, LogOutButton } from "./ui";
import "./App.css";
import PiecesCard from "./components/PiecesCard";
import AddPieceCard from "./components/AddPieceCard";
import WelcomeCard from "./components/WelcomeCard";

const BASE = import.meta.env.VITE_API_BASE_URL || "";

type Me = {
    email: string;
    display_name?: string | null;
    total_pieces: number;
    total_sessions: number;
    total_minutes: number;
    current_streak_days: number;
};

export type Piece = { id: number; title: string; composer?: string | null };

export default function App() {
    const [me, setMe] = useState<Me | null>(null);
    const [pieces, setPieces] = useState<Piece[]>([]);
    const [title, setTitle] = useState("");
    const [composer, setComposer] = useState("");
    const [status, setStatus] = useState("");
    const [refreshTick, setRefreshTick] = useState(0);
    async function handleDeletePiece(id: number) {
        console.log("Deleting piece", id);
        const ok = window.confirm(
            "Are you sure you want to delete this piece? :( This cannot be undone."
        );
        if (!ok) return;

        await api(`/api/pieces/${id}`, { method: "DELETE" });

        // Update UI immediately
        setPieces((prev) => prev.filter((p) => p.id !== id));
    }

    async function load() {
        try {
            const m = await api<Me>("/api/me");
            const p = await api<Piece[]>("/api/pieces");
            setMe(m);
            setPieces(p);
            setStatus("");
        } catch (e: any) {
            setMe(null);
            setStatus(e.message || "Failed to load");
        }
    }

    useEffect(() => {
        load();
    }, []);

    function bumpRefresh() {
        setRefreshTick((t) => t + 1);
    }

    async function addPiece(e: React.FormEvent) {
        e.preventDefault();
        const newPiece = await api<Piece>("/api/pieces", {
            method: "POST",
            body: JSON.stringify({ title, composer: composer || null }),
        });
        setTitle("");
        setComposer("");
        setStatus("Piece added");
        setPieces((prev) => [newPiece, ...prev]); // 🔥 keep local state in sync
        bumpRefresh();
    }

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#111",
                color: "#eaeaea",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <LogOutButton />
            <div
                style={{ width: "100%", maxWidth: 1100, padding: "24px 16px" }}
            >
                <Page>
                    <header style={{ marginBottom: 16 }}>
                        <h1 style={{ margin: 0, fontSize: 36 }}>
                            Piano Practice Tracker
                        </h1>
                        <p style={{ opacity: 0.7, marginTop: 6 }}>
                            Log. Track. Improve.
                        </p>
                    </header>

                    {!me ? (
                        <Card>
                            <section style={{ textAlign: "center" }}>
                                <p
                                    style={{
                                        fontFamily:
                                            "'Inter', 'Helvetica Neue', sans-serif",
                                        fontSize: "2.2rem",
                                        textAlign: "center",
                                        background:
                                            "linear-gradient(90deg, #c0a3ff, #6fa3ff)",
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent",
                                        fontWeight: 700,
                                        marginTop: "1rem",
                                    }}
                                >
                                    Join today.
                                </p>
                                <a href={`${BASE}/login`}>
                                    <Button>Login with Google</Button>
                                </a>
                            </section>
                        </Card>
                    ) : (
                        <Grid>
                            <TwoCol
                                left={
                                    <div style={{ display: "grid", gap: 16 }}>
                                        <WelcomeCard me={me} />

                                        <Card
                                            title="Your Stats"
                                            right={
                                                <span style={{ opacity: 0.7 }}>
                                                    🔥 {me.current_streak_days}
                                                    -day streak
                                                </span>
                                            }
                                        >
                                            <StatsPanel refresh={refreshTick} />
                                        </Card>

                                        <AddPieceCard
                                            title={title}
                                            composer={composer}
                                            onTitleChange={setTitle}
                                            onComposerChange={setComposer}
                                            onSubmit={addPiece}
                                        />

                                        <Card title="Log a Session">
                                            <LogSessionForm
                                                onSaved={bumpRefresh}
                                                pieces={pieces}
                                            />
                                        </Card>
                                    </div>
                                }
                                right={
                                    <div style={{ display: "grid", gap: 16 }}>
                                        <PiecesCard
                                            pieces={pieces}
                                            onDelete={handleDeletePiece}
                                        />
                                    </div>
                                }
                            />
                            {status && (
                                <p style={{ color: "seagreen" }}>{status}</p>
                            )}
                        </Grid>
                    )}
                </Page>
            </div>
        </div>
    );
}
