import { Card, Row, Input, Button } from "../ui";

type Props = {
    title: string;
    composer: string;
    onTitleChange: (v: string) => void;
    onComposerChange: (v: string) => void;
    onSubmit: (e: React.FormEvent) => void;
};

export default function AddPieceCard({
    title,
    composer,
    onTitleChange,
    onComposerChange,
    onSubmit,
}: Props) {
    return (
        <Card title="Add a Piece">
            <form onSubmit={onSubmit}>
                <Row>
                    <Input
                        placeholder="Title"
                        value={title}
                        onChange={(e) => onTitleChange(e.target.value)}
                        required
                    />
                    <Input
                        placeholder="Composer"
                        value={composer}
                        onChange={(e) => onComposerChange(e.target.value)}
                    />
                    <Button type="submit">Add</Button>
                </Row>
            </form>
        </Card>
    );
}
