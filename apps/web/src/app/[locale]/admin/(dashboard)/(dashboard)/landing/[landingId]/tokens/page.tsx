import TokenPage from "./TokenPage";

type Params = { params: Promise<{ landingId: string }> };

export default async function Page({ params }: Params) {
    const { landingId } = await params;
    return <TokenPage landingId={landingId} />;
}
