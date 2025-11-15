import { Card } from "../ui";

type Me = {
    email: string;
    display_name?: string | null;
    total_pieces: number;
    total_sessions: number;
    total_minutes: number;
    current_streak_days: number;
};

export default function WelcomeCard({ me }: { me: Me }) {
    return (
        <Card title={`Welcome${me.display_name ? `, ${me.display_name}` : ""}`}>
            <p>
                <b>{me.email}</b>
            </p>
        </Card>
    );
}
