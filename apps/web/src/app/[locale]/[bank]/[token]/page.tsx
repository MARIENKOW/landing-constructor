import LandingPage from "@/app/[locale]/[bank]/[token]/LandingPage";
import LandingService from "@/services/landing/landing.service";
import { $apiServer } from "@/utils/api/fetch.server";
import { LandingDto } from "@myorg/shared/dto";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

type Params = {
    params: Promise<{ locale: string; bank: string; token: string }>;
};

const { getByToken } = new LandingService($apiServer);

export async function generateMetadata({ params }: Params): Promise<Metadata> {
    const { bank, token } = await params;

    let data;
    try {
        const body = await getByToken({ id: bank, token });
        data = body.data;
    } catch (error) {}

    return {
        title: data?.meta.title,
        icons: {
            icon: data?.meta.icon,
        },
    };
}

export default async function Page({ params }: Params) {
    const { bank, token } = await params;

    let data;
    try {
        const body = await getByToken({ id: bank, token });
        data = body.data;
    } catch (error) {
        return redirect("https://www.google.com/");
    }

    return <LandingPage landing={data} />;
}
