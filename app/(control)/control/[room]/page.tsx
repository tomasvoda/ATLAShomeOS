import { ControlPage } from '@/modules/control';

export default async function Page({ params }: { params: Promise<{ room: string }> }) {
    const { room } = await params;
    return <ControlPage room={room} />;
}
